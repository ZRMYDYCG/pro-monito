/*
 * @Author: 一勺
 * @Date: 2025-05
 * @LastEditors: ZRMYDYCG
 * @LastEditTime: 2025-05
 * @Description: indexDB操作封装
 */
interface IndexDBWrapperOptions {
  dbName: string
  storeName: string
  version?: number
}

export interface IndexDBData {
  id: IDBValidKey
}

export class IndexDBWrapper<T extends IndexDBData> {
  private dbPromise: Promise<IDBDatabase>
  private storeName: string
  private db: IDBDatabase | null = null

  constructor(options: IndexDBWrapperOptions) {
    this.storeName = options.storeName
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(options.dbName, options.version)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' })
        }
      }

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result
        resolve(this.db)
      }

      request.onerror = (event) => {
        reject(new Error(`数据库打开失败: ${(event.target as IDBOpenDBRequest).error}`))
      }
    })
  }

  close() {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }

  private async getStore(mode: IDBTransactionMode) {
    const db = await this.dbPromise
    const tx = db.transaction(this.storeName, mode)
    return tx.objectStore(this.storeName)
  }

  async add(data: T): Promise<IDBValidKey> {
    const store = await this.getStore('readwrite')
    return new Promise((resolve, reject) => {
      const request = store.add(data)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error(`添加失败: ${request.error}`))
    })
  }

  async get(id: IDBValidKey): Promise<T | undefined> {
    const store = await this.getStore('readonly')
    return new Promise((resolve, reject) => {
      const request = store.get(id)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error(`查询失败: ${request.error}`))
    })
  }

  async update(data: T): Promise<IDBValidKey> {
    const store = await this.getStore('readwrite')
    return new Promise((resolve, reject) => {
      const request = store.put(data)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error(`更新失败: ${request.error}`))
    })
  }

  async delete(id: IDBValidKey): Promise<void> {
    const store = await this.getStore('readwrite')
    return new Promise((resolve, reject) => {
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error(`删除失败: ${request.error}`))
    })
  }
}
