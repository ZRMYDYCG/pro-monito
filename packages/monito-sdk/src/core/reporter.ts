/*
 * @Author: 一勺
 * @Date: 2025-05
 * @LastEditors: 一勺
 * @LastEditTime: 2025-05
 * @Description: 数据上报封装
    - 支持软删除
    - 支持三种上报机制：定量(max=1)、定时、手动（todo）
    - 提供清晰的接口暴露
    - 区分indexDB存储和上报逻辑
    - 目前上报仅console.log模拟
 */
import type { IndexDBData } from './storage/indexDB'
import { IndexDBWrapper } from './storage/indexDB'

interface ReporterOptions<T extends IndexDBData> {
  dbName: string
  maxCount?: number
  interval?: number
  dataTransform?: (data: Omit<T, 'id'>) => T
  enableSoftDelete?: boolean
}

export class Reporter<T extends Record<string, any>> {
  private db: IndexDBWrapper<T & IndexDBData>
  private maxCount: number
  private interval: number
  private timer?: NodeJS.Timeout
  private dataTransform: (data: Omit<T, 'id'>) => T & IndexDBData
  private enableSoftDelete: boolean
  private moduleName: string

  constructor(options: ReporterOptions<T & IndexDBData>, moduleName: string) {
    this.moduleName = moduleName
    this.db = new IndexDBWrapper<T & IndexDBData>({
      dbName: options.dbName,
      storeName: moduleName,
    })
    this.maxCount = options.maxCount || 1
    this.interval = options.interval || 0
    this.enableSoftDelete = options.enableSoftDelete ?? true
    this.dataTransform =
      options.dataTransform ||
      ((data) => {
        const result = {
          ...data,
          id: Date.now().toString(),
          deleted: false,
          createdAt: Date.now(),
        }
        return result as unknown as T & IndexDBData
      })

    if (this.interval > 0) {
      this.startTimer()
    }
  }

  private async checkAndReport() {
    try {
      const data = await this.getAllData()
      console.log('上报数据:', data)
      await this.clearReportedData()
    } catch (error) {
      console.error('上报失败:', error)
    }
  }

  private startTimer() {
    this.timer = setInterval(() => {
      this.checkAndReport()
    }, this.interval)
  }

  async add(data: Omit<T, 'id'>): Promise<void> {
    const dbData = this.dataTransform(data)
    await this.db.add(dbData)
    const count = await this.getCount()
    if (count >= this.maxCount) {
      await this.checkAndReport()
    }
  }

  async report(): Promise<void> {
    await this.checkAndReport()
  }

  async getCount(): Promise<number> {
    const allData = await this.getAllData()
    return allData.length
  }

  private async clearReportedData(): Promise<void> {
    if (this.enableSoftDelete) {
      const store = await this.db['getStore']('readwrite')
      return new Promise((resolve, reject) => {
        const request = store.openCursor()
        let processedCount = 0

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
          if (cursor) {
            if (!cursor.value.deleted && !cursor.value.isReported) {
              const reportedData = {
                ...cursor.value,
                deleted: true,
                reportedAt: Date.now(),
                isReported: true,
              }
              const updateRequest = cursor.update(reportedData)
              updateRequest.onsuccess = () => {
                processedCount++
                cursor.continue()
              }
              updateRequest.onerror = () => {
                reject(new Error(`标记删除失败: ${updateRequest.error}`))
              }
            } else {
              cursor.continue()
            }
          } else {
            if (processedCount > 0) {
              console.log(`成功标记 ${processedCount} 条数据为已上报`)
            }
            resolve()
          }
        }
        request.onerror = () => reject(new Error(`打开游标失败: ${request.error}`))
      })
    } else {
      const store = await this.db['getStore']('readwrite')
      return new Promise((resolve, reject) => {
        const request = store.clear()
        request.onsuccess = () => resolve()
        request.onerror = () => reject(new Error(`清空数据失败: ${request.error}`))
      })
    }
  }

  private async getAllData(options?: { includeDeleted?: boolean }): Promise<(T & IndexDBData)[]> {
    const store = await this.db['getStore']('readonly')
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        const result = request.result
        resolve(
          this.enableSoftDelete && !options?.includeDeleted
            ? result.filter((item) => !item.deleted && !item.isReported) // 过滤已上报数据
            : result,
        )
      }
      request.onerror = () => reject(new Error(`获取数据失败: ${request.error}`))
    })
  }

  async cleanDeletedData(): Promise<void> {
    if (!this.enableSoftDelete) return

    const store = await this.db['getStore']('readwrite')
    const allData = await this.getAllData({ includeDeleted: true })

    return new Promise((resolve, reject) => {
      const request = store.openCursor()
      const deletedKeys: IDBValidKey[] = []

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
        if (cursor) {
          if (cursor.value.deleted) {
            deletedKeys.push(cursor.primaryKey)
          }
          cursor.continue()
        } else {
          Promise.all(
            deletedKeys.map((key) => {
              return new Promise<void>((res, rej) => {
                const deleteRequest = store.delete(key)
                deleteRequest.onsuccess = () => res()
                deleteRequest.onerror = () => rej(new Error(`删除记录失败: ${deleteRequest.error}`))
              })
            }),
          )
            .then(() => resolve())
            .catch((err) => reject(err))
        }
      }
      request.onerror = () => reject(new Error(`清理删除数据失败: ${request.error}`))
    })
  }

  destroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.db.close()
  }
}
