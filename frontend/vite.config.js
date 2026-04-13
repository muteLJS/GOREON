import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      assets: path.resolve(__dirname, "src/assets"),
      components: path.resolve(__dirname, "src/components"),
      pages: path.resolve(__dirname, "src/pages"),
      layouts: path.resolve(__dirname, "src/layouts"),
      styles: path.resolve(__dirname, "src/styles"),
      store: path.resolve(__dirname, "src/store"),
      api: path.resolve(__dirname, "src/api"),
      utils: path.resolve(__dirname, "src/utils"),
    },
  },
  server: {
    port: 3000,
  },
});
