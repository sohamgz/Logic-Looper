import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      // Only necessary if you want React plugin to pick up .js files too
      include: /src\/.*\.(js|ts|jsx|tsx)$/,
    }),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@features': resolve(__dirname, './src/features'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@store': resolve(__dirname, './src/store'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
    },
  },

  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx', // Treat JS files as JSX
        '.ts': 'ts',
      },
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'redux': ['@reduxjs/toolkit', 'react-redux'],
          'firebase': ['firebase/app', 'firebase/auth'],
          'animation': ['framer-motion'],
        },
      },
    },
  },
})
