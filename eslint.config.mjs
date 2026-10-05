// ESLint flat config for Next.js app
import js from '@eslint/js'
import ts from 'typescript-eslint'

export default [
  {
    ignores: ['node_modules', '.next', 'build', 'coverage', '*.js', '*.tsbuildinfo'],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['src/lib/logger.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['src/app/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
]
