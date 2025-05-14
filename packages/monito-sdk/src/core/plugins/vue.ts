import { autoTrack } from '../track'
import { realTimeMonitor } from '../monitor'
import { performanceAnalysis } from '../performance'
import { userBehaviorAnalysis } from '../behavior'
import { errorMonitoring } from '../error'

// 为 Vue 提供插件安装方法
export const install = (Vue: any) => {
  Vue.prototype.$monito = {
    autoTrack,
    realTimeMonitor,
    performanceAnalysis,
    userBehaviorAnalysis,
    errorMonitoring,
  }
  console.log('🛠️ [Monito SDK] 已成功安装至Vue应用')
}
