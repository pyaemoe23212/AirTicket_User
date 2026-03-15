import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://festival-interpreted-screensavers-each.trycloudflare.com/api",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
