import { 
  treeshakeConfig,
  inputConfig,
  outputConfig,
} from './src/build'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'
import nodeResolve from '@rollup/plugin-node-resolve'

export default {
  treeshake: treeshakeConfig,
  input: inputConfig,
  output: outputConfig,
  plugins: [
    typescript(),
    commonjs(),
    copy({
      targets: [
        { src: 'package.json', dest: 'dist' },
        { src: 'README.md', dest: 'dist' },
        { src: 'LICENSE', dest: 'dist' }
      ],
    }),
    nodeResolve({})
  ]
}
