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
  network: {
    type: string | null
    downlink: number | null
    rtt: number | null
    effectiveType: string | null
  }
  battery: {
    level: number | null
    charging: boolean | null
    chargingTime: number | null
    dischargingTime: number | null
  }
  deviceInfo: {
    os: string
    osVersion: string | null
    browser: string
    browserVersion: string | null
    deviceType: 'desktop' | 'mobile' | 'tablet'
    screenWidth: number
    screenHeight: number
    pixelRatio: number
    orientation: 'portrait' | 'landscape' | null
  }
  gpu: {
    vendor: string | null
    renderer: string | null
  }
  storage: {
    estimatedQuota: number | null
    usage: number | null
  }
}

export class HardwareMonitor {
  private reporter: Reporter<HardwareData>
  private monitorInterval?: NodeJS.Timeout
  private isMonitoring = false
  private lastCpuMeasurement = {
    time: Date.now(),
    usage: 0,
  }

  constructor(reporter: Reporter<HardwareData>) {
    this.reporter = reporter
  }

  async start(interval: number = 5000): Promise<void> {
    if (this.isMonitoring) return
    this.isMonitoring = true

    // 立即收集一次数据
    await this.collectHardwareData()

    // 设置定时收集
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
    try {
      const [cpuUsage, memoryUsage, deviceInfo, network, battery, gpu, storage] = await Promise.all(
        [
          this.getCpuUsage(),
          this.getMemoryUsage(),
          this.getDeviceInfo(),
          this.getNetworkInfo(),
          this.getBatteryInfo(),
          this.getGPUInfo(),
          this.getStorageInfo(),
        ],
      )

      const data: HardwareData = {
        cpuUsage,
        memoryUsage,
        deviceInfo,
        network,
        battery,
        gpu,
        storage,
      }

      await this.reporter.add(data)
    } catch (error) {
      console.error('Failed to collect hardware data:', error)
    }
  }

  private async getCpuUsage(): Promise<number> {
    return new Promise((resolve) => {
      const start = performance.now()

      setTimeout(() => {
        const end = performance.now()
        const duration = end - start

        // 计算实际耗时与理论耗时的比例
        const usage = Math.min(100, Math.round((duration / 10) * 100))

        // 平滑处理数据
        const smoothUsage = (usage + this.lastCpuMeasurement.usage * 3) / 4
        this.lastCpuMeasurement = {
          time: Date.now(),
          usage: smoothUsage,
        }

        resolve(smoothUsage)
      }, 10)
    })
  }

  private getMemoryUsage(): number {
    try {
      if (window.performance && 'memory' in performance) {
        const memory = (performance as any).memory
        if (memory.totalJSHeapSize > 0) {
          return (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
        }
      }
      return 0
    } catch {
      return 0
    }
  }

  private getDeviceInfo() {
    return {
      os: this.detectOS(),
      osVersion: this.detectOSVersion(),
      browser: this.detectBrowser(),
      browserVersion: this.detectBrowserVersion(),
      deviceType: this.detectDeviceType(),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      pixelRatio: window.devicePixelRatio || 1,
      orientation: this.getScreenOrientation(),
    }
  }

  private getNetworkInfo() {
    try {
      const connection =
        (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection

      return {
        type: connection?.type || null,
        downlink: connection?.downlink || null,
        rtt: connection?.rtt || null,
        effectiveType: connection?.effectiveType || null,
      }
    } catch {
      return {
        type: null,
        downlink: null,
        rtt: null,
        effectiveType: null,
      }
    }
  }

  private async getBatteryInfo() {
    try {
      const batteryManager = await (navigator as any).getBattery?.()
      return {
        level: batteryManager?.level ?? null,
        charging: batteryManager?.charging ?? null,
        chargingTime: batteryManager?.chargingTime ?? null,
        dischargingTime: batteryManager?.dischargingTime ?? null,
      }
    } catch {
      return {
        level: null,
        charging: null,
        chargingTime: null,
        dischargingTime: null,
      }
    }
  }

  private getGPUInfo() {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

      if (!gl) return { vendor: null, renderer: null }

      const webglContext = gl as WebGLRenderingContext

      const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info')
      return {
        vendor: debugInfo ? webglContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null,
        renderer: debugInfo ? webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null,
      }
    } catch {
      return { vendor: null, renderer: null }
    }
  }

  private async getStorageInfo() {
    try {
      if ('storage' in navigator && 'estimate' in (navigator as any).storage) {
        const { quota, usage } = await (navigator as any).storage.estimate()
        return {
          estimatedQuota: quota || null,
          usage: usage || null,
        }
      }
      return { estimatedQuota: null, usage: null }
    } catch {
      return { estimatedQuota: null, usage: null }
    }
  }

  private detectOS(): string {
    const userAgent = navigator.userAgent
    const platform = navigator.platform

    if (/Win/i.test(platform)) return 'Windows'
    if (/Mac/i.test(platform)) return 'MacOS'
    if (/Linux/i.test(platform)) return 'Linux'
    if (/Android/i.test(userAgent)) return 'Android'
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS'

    return 'Unknown'
  }

  private detectOSVersion(): string | null {
    const userAgent = navigator.userAgent
    const matches = userAgent.match(/(Windows NT|Android|Mac OS X|Linux|iOS) ([0-9_.]+)/)
    return matches?.[2]?.replace(/_/g, '.') || null
  }

  private detectBrowser(): string {
    const userAgent = navigator.userAgent

    if (userAgent.includes('Edg/')) return 'Edge'
    if (userAgent.includes('OPR/')) return 'Opera'
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'

    return 'Unknown'
  }

  private detectBrowserVersion(): string | null {
    const userAgent = navigator.userAgent
    const matches = userAgent.match(/(Edg|OPR|Chrome|Firefox|Safari)\/(\d+\.\d+)/)
    return matches?.[2] || null
  }

  private detectDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const userAgent = navigator.userAgent
    const isMobile = /Mobi|Android|iPhone/i.test(userAgent)
    const isTablet = /(iPad|Tablet|Android)/i.test(userAgent)

    if (isTablet) return 'tablet'
    if (isMobile) return 'mobile'
    return 'desktop'
  }

  private getScreenOrientation(): 'portrait' | 'landscape' | null {
    try {
      if (window.screen.orientation) {
        return window.screen.orientation.type.includes('portrait') ? 'portrait' : 'landscape'
      }
      return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
    } catch {
      return null
    }
  }
}
