import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@icons": path.resolve(__dirname, "src/shared/icons"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@store": path.resolve(__dirname, "src/store"),
      "@models": path.resolve(__dirname, "src/models"),
    },
  },
  server: {
    port: 3080,
    cors: true,
    proxy: {
      "/api": {
        target: "https://pwac.world",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
