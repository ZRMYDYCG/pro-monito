/*
 * @Author: ZRMYDYCG
 * @Date: 2025-05
 * @LastEditors: ZRMYDYCG
 * @LastEditTime: 2025-05
 * @Description: Jest配置文件
 */
import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest', // 使用ts-jest处理TypeScript
  testEnvironment: 'node', // 测试环境为Node.js
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'], // 支持的模块扩展名
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)'], // 测试文件匹配模式
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // 用ts-jest转换TS/TSX文件
  },
}

export default config
