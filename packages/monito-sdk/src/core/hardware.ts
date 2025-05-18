/*
 * @Author: 一勺
 * @Date: 2025-05
 * @LastEditors: ZRMYDYCG
 * @LastEditTime: 2025-05
 * @Description: 硬件数据采集
 */
import type { Reporter } from './reporter'

export interface HardwareData {
  cpuUsage: number
  memoryUsage: number
  deviceInfo: {
    os: string
    browser: string
    screenWidth: number
    screenHeight: number
  }
}

export class HardwareMonitor {
  private reporter: Reporter<HardwareData>
  private monitorInterval?: NodeJS.Timeout
  private isMonitoring = false

  constructor(reporter: Reporter<HardwareData>) {
    this.reporter = reporter
  }

  async start(interval: number = 5000): Promise<void> {
    if (this.isMonitoring) return

    this.isMonitoring = true
    this.monitorInterval = setInterval(() => {
      this.collectHardwareData()
    }, interval)
  }

  stop(): void {
    if (!this.isMonitoring) return

    clearInterval(this.monitorInterval)
    this.isMonitoring = false
  }

  private async collectHardwareData(): Promise<void> {
    const data: HardwareData = {
      cpuUsage: this.getCpuUsage(),
      memoryUsage: this.getMemoryUsage(),
      deviceInfo: this.getDeviceInfo(),
    }
    await this.reporter.add(data)
  }

  // 获取CPU使用率（估计）
  private getCpuUsage(): number {
    if (window.performance && (window.performance as any).memory) {
      const cpu = (window.performance as any).now()
      const startTime = Date.now()
      let endTime: number

      // 计算一小段时间内的CPU占用来估算使用率
      while (Date.now() - startTime < 10) {
        endTime = Date.now()
      }
      const elapsedCpu = (window.performance as any).now() - cpu
      const elapsedReal = endTime! - startTime

      // CPU使用率 = (CPU时间 / 真实时间) * 100
      return Math.min(100, Math.max(0, (elapsedCpu / elapsedReal) * 100))
    }
    return 0
  }

  // 获取内存使用率
  private getMemoryUsage(): number {
    if (window.performance && (window.performance as any).memory) {
      const memory = (window.performance as any).memory
      if (memory.jsHeapSizeLimit > 0) {
        return (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      }
    }
    return 0
  }

  private getDeviceInfo() {
    return {
      os: this.detectOS(),
      browser: this.detectBrowser(),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
    }
  }

  private detectOS(): string {
    // OS检测
    const userAgent = navigator.userAgent
    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'MacOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('iOS')) return 'iOS'
    return 'Unknown'
  }

  private detectBrowser(): string {
    // 浏览器检测
    const userAgent = navigator.userAgent
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    if (userAgent.includes('Opera')) return 'Opera'
    return 'Unknown'
  }
}
