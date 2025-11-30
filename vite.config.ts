import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Netlify or local env variables need to be exposed to the client
    'process.env': process.env
  }
});