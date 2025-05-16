import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import copy from 'rollup-plugin-copy'

export default {
  treeshake: {
    // Rollup 在打包时, 更激进地删除未被使用的代码 （即「树摇」）
    moduleSideEffects: false,
  },
  // 入口文件
  input: 'src/index.ts',
  // 输出文件
  output: [
    {
      file: 'dist/monito-sdk.cjs.js',
      format: 'cjs',
      exports: 'named',
    },
    {
      file: 'dist/monito-sdk.esm.js',
      format: 'esm',
    },
  ],
  plugins: [
    typescript(), 
    commonjs(), 
    nodeResolve(),   
    // 将 package.json 复制到 dist 目录下
    copy({
      targets: [
        { src: 'package.json', dest: 'dist' }
      ]
    })
  ],
}
