/*
 * @Author: 一勺
 * @Date: 2025-05
 * @LastEditors: ZRMYDYCG
 * @LastEditTime: 2025-05
 * @Description: 接口暴露提供给外部调用
 */
import { Reporter } from './core/reporter'

interface MonitoSDKOptions {
  dbName?: string
  storeName?: string
  maxCount?: number
  reportInterval?: number
}

export function createReporter<T>(options: MonitoSDKOptions): Reporter<T> {
  return new Reporter<T>({
    dbName: options.dbName || 'monito_data',
    storeName: options.storeName || 'events',
    maxCount: options.maxCount,
    interval: options.reportInterval,
  })
}

export interface EventData {
  type: string
  timestamp: number
  data: any
}
