import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITE_BASE_PATH || "/",
  esbuild: {
    drop: ["console", "debugger"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@mui")) return "mui";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("emoji-picker-react")) return "emoji";
          if (id.includes("socket.io-client")) return "socketio";
          if (id.includes("react-router")) return "router";
          if (id.includes("axios")) return "axios";
          return "vendor";
        },
      },
    },
  },
})
