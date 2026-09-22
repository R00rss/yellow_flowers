import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base keeps the build portable: Vercel, Netlify and GitHub Pages subpaths.
  base: './',
  plugins: [react()],
  build: {
    cssCodeSplit: true,
    assetsInlineLimit: 2048,
  },
})
