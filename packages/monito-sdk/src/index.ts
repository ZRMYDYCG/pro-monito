import { autoTrack } from './core/track'
import { realTimeMonitor } from './core/monitor'
import { performanceAnalysis } from './core/performance'
import { userBehaviorAnalysis } from './core/behavior'
import { errorMonitoring } from './core/error'

// 从插件目录导入框架集成方法
import { install as vueInstall } from './core/plugins/vue'
import { initForReact } from './core/plugins/react'

// 导出公共API
export { autoTrack, realTimeMonitor, performanceAnalysis, userBehaviorAnalysis, errorMonitoring, vueInstall as install, initForReact }
