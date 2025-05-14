import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'

export default {
  input: 'src/index.ts',
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
  plugins: [typescript(), commonjs(), nodeResolve()],
}
