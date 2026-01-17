import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig(({ mode }) => ({
  plugins: [angular()],
  test: {
    globals: true,
    setupFiles: ['src/test-setup.ts'],
    environment: 'jsdom',
    browserMode: true,
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      './projects/shared-modules/src/lib/**/*.ts',
    ],
    projects: [
      './projects/shared-modules',
      './projects/frontend-admin',
      './projects/frontend-client',
    ],
    references: [
      './projects/shared-modules/tsconfig.spec.json',
      './projects/frontend-admin/tsconfig.spec.json',
      './projects/frontend-client/tsconfig.spec.json',
    ],
    resolve: {
      alias: {
        'shared-modules': './projects/shared-modules/src/lib',
      },
    },
    reporters: ['default'],
  },
}));
