import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    // Use polling instead of native inotify watchers to avoid
    // "ENOSPC: System limit for number of file watchers reached".
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
});