/*
 * @Author: ZRMYDYCG
 * @Date: 2025-05
 * @LastEditors: ZRMYDYCG
 * @LastEditTime: 2025-05
 * @Description: commonjs 插件配置
 */
import commonjs from '@rollup/plugin-commonjs'

export const commonjsPlugin = () => {
  return commonjs({})
}