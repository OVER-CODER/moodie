import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: [
      'shared/**/*.test.ts',
      'server/**/*.test.ts',
      'client/src/**/*.test.tsx',
      'client/src/**/*.test.ts'
    ],
    exclude: ['**/node_modules/**', '**/.cache/**', '**/dist/**'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
});
