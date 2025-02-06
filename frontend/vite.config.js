import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-refresh/runtime.js': path.resolve(
        'node_modules/react-refresh/runtime.js'
      )
    }
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[tj]sx?$/,  // ✅ Enables JSX in .js and .jsx files
  },
});
