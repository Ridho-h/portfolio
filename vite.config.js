import crypto from 'node:crypto';

// Polyfill crypto.hash for Node versions < 21.7.0
if (!crypto.hash) {
  crypto.hash = (algorithm, data, outputEncoding = 'hex') => {
    return crypto.createHash(algorithm).update(data).digest(outputEncoding);
  };
}

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    glsl(),
  ],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1500,
  },
});
