/*
 * @Author: 一勺
 * @Date: 2025-05
 * @LastEditors: 一勺
 * @LastEditTime: 2025-05
 * @Description: 数据上报封装
    - 支持三种上报机制：定量(max=1)、定时、定量
    - 提供清晰的接口暴露
    - 区分indexDB存储和上报逻辑
    - 目前上报仅console.log模拟
 */
import type { IndexDBData } from './storage/indexDB'
import { IndexDBWrapper } from './storage/indexDB'

interface ReporterOptions<T extends IndexDBData> {
  dbName: string
  storeName: string
  maxCount?: number
  interval?: number
  dataTransform?: (data: Omit<T, 'id'>) => T
}

export class Reporter<T extends Record<string, any>> {
  private db: IndexDBWrapper<T & IndexDBData>
  private maxCount: number
  private interval: number
  private timer?: NodeJS.Timeout
  private dataTransform: (data: Omit<T, 'id'>) => T & IndexDBData

  constructor(options: ReporterOptions<T & IndexDBData>) {
    this.db = new IndexDBWrapper<T & IndexDBData>({
      dbName: options.dbName,
      storeName: options.storeName,
    })
    this.maxCount = options.maxCount || 1
    this.interval = options.interval || 0
    this.dataTransform =
      options.dataTransform ||
      ((data) => {
        const result = {
          ...data,
          id: Date.now().toString(),
        }
        return result as T & IndexDBData
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

  private async getAllData(): Promise<(T & IndexDBData)[]> {
    const store = await this.db['getStore']('readonly')
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error(`获取数据失败: ${request.error}`))
    })
  }

  private async clearReportedData(): Promise<void> {
    const store = await this.db['getStore']('readwrite')
    return new Promise((resolve, reject) => {
      const request = store.clear()
      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error(`清空数据失败: ${request.error}`))
    })
  }

  destroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.db.close()
  }
}
