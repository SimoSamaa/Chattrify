import { defineConfig } from 'vite';
import path from "path";
import react from '@vitejs/plugin-react-swc';
import macrosPlugin from 'vite-plugin-babel-macros';

// https://vitejs.dev/config/ 
export default defineConfig({
  plugins: [
    react(),
    macrosPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
