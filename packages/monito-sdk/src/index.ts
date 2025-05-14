// 自动化埋点
export const autoTrack = () => {
  console.log('🚀 自动追踪页面访问、点击事件、性能指标等')
}

// 实时监控
export const realTimeMonitor = () => {
  console.log('🌐 提供实时数据监控与分析面板')
}

// 性能分析
export const performanceAnalysis = () => {
  console.log('⚡️ 多维性能分析：页面加载性能、资源加载性能、API请求性能等')
}

// 用户行为分析
export const userBehaviorAnalysis = () => {
  console.log('👣 用户行为路径分析 + 🔥 热力图分析，助力洞悉用户行为')
}

// 异常监控
export const errorMonitoring = () => {
  console.log('🚨 自动捕获并上报JS错误、API异常等异常信息')
}

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

// 为 React 提供初始化方法
export const initForReact = () => {
  console.log('⚛️ [Monito SDK] 已在React应用中初始化完成')
}
