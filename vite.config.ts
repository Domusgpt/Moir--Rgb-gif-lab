import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/Moir--Rgb-gif-lab/', // GitHub Pages base path
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        sourcemap: true,
        // Code splitting for better performance
        rollupOptions: {
          output: {
            manualChunks: {
              // Separate vendor chunks for better caching
              'react-vendor': ['react', 'react-dom'],
              'uuid-vendor': ['uuid']
            }
          }
        },
        // Increase chunk size warning limit
        chunkSizeWarningLimit: 1000
      }
    };
});
