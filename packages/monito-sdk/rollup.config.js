/*
 * @Author: ZRMYDYCG
 * @Date: 2025-05
 * @LastEditors: ZRMYDYCG
 * @LastEditTime: 2025-05
 * @Description: 构建流程
 */
import { readFileSync } from 'fs';

import { 
  treeshakeConfig,
  inputConfig,
  outputConfig,
  typescriptPlugin,
  commonjsPlugin,
  copyPlugin,
  nodeResolvePlugin
} from './src/build/index.js'
import { MonitoBuildInfoPlugin } from './src/build/plugins/custom/info-plugin.js'

const { name: sdkName, version: sdkVersion } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8')
)

export default {
  treeshake: treeshakeConfig,
  input: inputConfig,
  output: outputConfig,
  plugins: [
    MonitoBuildInfoPlugin({ sdkName, sdkVersion }),
    typescriptPlugin(),
    commonjsPlugin(),
    copyPlugin(),
    nodeResolvePlugin()
  ]
}
