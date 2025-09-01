import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import stylelint from 'vite-plugin-stylelint';
import svgLoader from 'vite-svg-loader';
import autoImport from 'unplugin-auto-import/dist/vite.js';
import path from 'path'
import { resolve } from 'path';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
  base: '/OneHundred/',
    plugins: [
      stylelint(),
      svgLoader(),
      vue(),
      autoImport({
        imports: [
          'vue',
          'vue-router',
        ],
        dirs: [
          './src/components',
          './src/composables',
        ],
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '~': path.resolve(__dirname, './src'),
      },
    },
  });
};
