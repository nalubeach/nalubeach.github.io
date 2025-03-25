import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './', // <- Adiciona isto
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
});
