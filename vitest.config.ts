import { defineConfig } from 'vitest/config'

/**
 * Separate from vite.config.ts on purpose: tests must not load the React,
 * Tailwind or PWA plugins — they exercise pure logic only.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
