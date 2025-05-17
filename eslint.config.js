import eslint from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tseslintParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import path from 'path'

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
        // 动态查找子项目的 tsconfig
        project: ['./packages/*/tsconfig.json'],
        warnOnUnsupportedTypeScriptVersion: true,
        // 添加 tsconfig 根目录
        tsconfigRootDir: path.resolve(__dirname)
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
