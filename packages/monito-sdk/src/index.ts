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
  maxCount?: number
  reportInterval?: number
  enableHardwareMonitor?: boolean
  hardwareMonitorInterval?: number
}

interface SDKInstance {
  getReporter: (moduleName: string) => Reporter<any>
  destroy: () => void
}

export function createSDK(options: MonitoSDKOptions): SDKInstance {
  const dbName = options.dbName || 'monito_data'
  const reporters = new Map<string, Reporter<any>>()

  let hardwareMonitor: HardwareMonitor | null = null

  if (options.enableHardwareMonitor) {
    hardwareMonitor = new HardwareMonitor(
      new Reporter(
        {
          dbName,
          maxCount: options.maxCount,
          interval: options.reportInterval,
        },
        'hardware',
      ) as unknown as Reporter<HardwareData>,
    )
    hardwareMonitor.start(options.hardwareMonitorInterval || 5000)
  }

  return {
    getReporter: (moduleName: string) => {
      if (!reporters.has(moduleName)) {
        reporters.set(
          moduleName,
          new Reporter(
            {
              dbName,
              maxCount: options.maxCount,
              interval: options.reportInterval,
            },
            moduleName,
          ),
        )
      }
      return reporters.get(moduleName)!
    },
    destroy: () => {
      reporters.forEach((reporter) => reporter.destroy())
      hardwareMonitor?.stop()
    },
  }
}
