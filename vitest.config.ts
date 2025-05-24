import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: ['node_modules/**', '**/*.{d.ts,js}'],
    workspace: ['packages/**/vitest.config.ts'],
  },
});
