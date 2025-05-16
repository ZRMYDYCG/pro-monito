/*
 * @Author: 一勺
 * @Date: 2025-05
 * @LastEditors: ZRMYDYCG
 * @LastEditTime: 2025-05
 * @Description: 统一导出
 */
// 配置
import treeshakeConfig from './configs/treeshake.js'
import inputConfig from './configs/input.js'
import outputConfig from './configs/output.js'

// 插件
import { commonjsPlugin } from './plugins/base/commonjs.js'
import { copyPlugin } from './plugins/base/copy.js'
import { nodeResolvePlugin } from './plugins/base/nodeResolve.js'
import { typescriptPlugin } from './plugins/base/typescript.js'

// 自定义插件
import { MonitoBuildInfoPlugin } from './plugins/custom/info-plugin.js'

// 辅助

export {
  treeshakeConfig,
  inputConfig,
  outputConfig,
  commonjsPlugin,
  copyPlugin,
  nodeResolvePlugin,
  typescriptPlugin,
  MonitoBuildInfoPlugin,
}
