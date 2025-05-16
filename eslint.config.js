import eslint from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tseslintParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      env: {
        browser: true, // to enable browser globals like indexedDB
      },
      globals: {
        ...globals.node, // 引入 Node.js 的标准全局变量 (包括 console, process 等)
        ...globals.jest, // 声明Jest测试框架的全局变量（describe/it/expect等）
        IDBDatabase: 'readonly',
      },
      parser: tseslintParser, // TypeScript 解析器也能解析 JavaScript
      parserOptions: {
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
]
