import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deploy su Cloudflare Pages: il sito è servito dalla radice del dominio.
export default defineConfig({
  plugins: [react()],
  base: '/',
})