/*
 * @Author: ZRMYDYCG
 * @Date: 2025-05
 * @LastEditors: ZRMYDYCG
 * @LastEditTime: 2025-05
 * @Description: copy 插件配置
 */
import copy from 'rollup-plugin-copy'

export const copyPlugin = () => {
    return copy({
        targets: [
          { src: 'package.json', dest: 'dist' },
          { src: 'README.md', dest: 'dist' },
          { src: 'LICENSE', dest: 'dist' }
        ],
      })
}