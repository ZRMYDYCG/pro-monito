/*
 * @Author: 一勺
 * @Date: 2025-05
 * @LastEditors: ZRMYDYCG
 * @LastEditTime: 2025-05
 * @Description: 接口暴露提供给外部调用
 */
import { Reporter } from './core/reporter'
import { HardwareMonitor } from './core/hardware'
import type { HardwareData } from './core/hardware'

interface MonitoSDKOptions {
  dbName?: string
  storeName?: string
  maxCount?: number
  reportInterval?: number
  enableHardwareMonitor?: boolean
  hardwareMonitorInterval?: number
}

interface SDKInstance {
  destroy: () => void
}

export function createSDK(options: MonitoSDKOptions): SDKInstance {
  const reporter = new Reporter({
    dbName: options.dbName || 'monito_data',
    storeName: options.storeName || 'events',
    maxCount: options.maxCount,
    interval: options.reportInterval,
  })

  let hardwareMonitor: HardwareMonitor | null = null

  if (options.enableHardwareMonitor) {
    hardwareMonitor = new HardwareMonitor(reporter as unknown as Reporter<HardwareData>)
    hardwareMonitor.start(options.hardwareMonitorInterval || 5000)
  }

  return {
    destroy: () => {
      reporter.destroy()
      hardwareMonitor?.stop()
    },
  }
}
