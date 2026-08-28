import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
    /* content/ modules are large; give the whole-PLAN import room to load */
    testTimeout: 30_000,
  },
});
