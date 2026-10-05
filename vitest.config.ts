import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.{test,spec}.{ts,tsx}', 'tests/integration/**/*.{test,spec}.{ts,tsx}', 'src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./tests/vitest.setup.ts'],
    env: {
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://afit:afitpass@localhost:5433/leadcrm_test?schema=public',
      NEXTAUTH_SECRET: 'test-secret',
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})