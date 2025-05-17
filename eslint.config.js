import eslint from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tseslintParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import path from 'path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

// 获取当前文件目录路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default [
  {
    files: ['packages/**/*.ts', 'packages/**/*.js'],
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/coverage/',
      '**/.git/'
    ],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        IDBDatabase: 'readonly',
        IDBTransaction: 'readonly',
        IDBRequest: 'readonly',
        IDBOpenDBRequest: 'readonly'
      },
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./packages/*/tsconfig.json'],
        warnOnUnsupportedTypeScriptVersion: true,
        tsconfigRootDir: __dirname
      }
    },

    plugins: {
      '@typescript-eslint': tseslint,
      prettier
    },

    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error'
    }
  }
]
