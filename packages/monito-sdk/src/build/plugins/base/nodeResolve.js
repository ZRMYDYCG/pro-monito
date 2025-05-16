/*
 * @Author: ZRMYDYCG
 * @Date: 2025-05
 * @LastEditors: ZRMYDYCG
 * @LastEditTime: 2025-05
 * @Description: nodeResolve 插件配置
 */
import nodeResolve from '@rollup/plugin-node-resolve'

export const nodeResolvePlugin = () => {
  return nodeResolve({})
}