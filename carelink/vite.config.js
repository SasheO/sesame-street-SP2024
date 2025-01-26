import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[tj]sx?$/,  // ✅ Enables JSX in .js and .jsx files
  },
});
