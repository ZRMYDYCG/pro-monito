import { generateUUID, debounce, throttle } from '../../../src/core/utils'

// 测试 UUID 生成函数
describe('generateUUID', () => {
  it('应生成符合 UUID 格式的字符串', () => {
    const uuid = generateUUID()
    // 验证格式：8-4-4-4-12 位十六进制字符，且第 13 位固定为 4（版本号），第 17 位为 8/9/a/b（变体号）
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    expect(uuid).toMatch(uuidRegex)
  })

  it('多次生成的 UUID 应不重复', () => {
    const uuid1 = generateUUID()
    const uuid2 = generateUUID()
    expect(uuid1).not.toBe(uuid2)
  })
})

// 测试防抖函数
describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers() // 启用 Jest 假定时器
  })

  afterEach(() => {
    jest.useRealTimers() // 恢复真实定时器
  })

  it('应在延迟结束后执行函数，且多次调用重置计时', () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 100)

    // 模拟 50ms 内调用 3 次
    debouncedFn()
    debouncedFn()
    debouncedFn()
    jest.advanceTimersByTime(50) // 推进 50ms（未到延迟）
    expect(mockFn).not.toHaveBeenCalled()

    // 再调用一次并推进 100ms
    debouncedFn()
    jest.advanceTimersByTime(100)
    expect(mockFn).toHaveBeenCalledTimes(1) // 仅最后一次调用触发
  })

  it('应正确传递参数', () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 50)
    debouncedFn('arg1', 2)
    jest.runAllTimers() // 执行所有定时器
    expect(mockFn).toHaveBeenCalledWith('arg1', 2)
  })
})

// 测试节流函数
describe('throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('应在间隔时间内只执行一次', () => {
    const mockFn = jest.fn()
    const throttledFn = throttle(mockFn, 100)

    // 100ms 内调用 3 次
    throttledFn()
    throttledFn()
    throttledFn()
    jest.advanceTimersByTime(99) // 未到间隔
    expect(mockFn).toHaveBeenCalledTimes(1) // 首次立即执行

    // 推进 1ms（总时间 100ms），再次调用
    jest.advanceTimersByTime(1)
    throttledFn()
    expect(mockFn).toHaveBeenCalledTimes(2) // 间隔结束后再次执行
  })

  it('应正确传递参数', () => {
    const mockFn = jest.fn()
    const throttledFn = throttle(mockFn, 50)
    throttledFn('arg1', 2)
    expect(mockFn).toHaveBeenCalledWith('arg1', 2) // 首次立即执行
  })
})
