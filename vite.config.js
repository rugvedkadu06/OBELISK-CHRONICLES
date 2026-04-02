import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './', // Allow opening build output directly in a browser or Electron
  plugins: [
    tailwindcss(),
  ],
  server: {
    port: 6969,     
    open: true,
  },
})
