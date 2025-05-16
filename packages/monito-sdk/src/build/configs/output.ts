/*
 * @Author: 一勺
 * @Date: 2025-05
 * @LastEditors: ZRMYDYCG
 * @LastEditTime: 2025-05
 * @Description: 输出配置
 */
export default [
    {
      file: 'dist/monito-sdk.cjs.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: 'dist/monito-sdk.esm.js',
      format: 'esm',
      sourcemap: true
    }
]
