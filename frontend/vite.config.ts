import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: "0.0.0.0", // 讓伺服器綁定所有網路接口
    port: 3000, // 你可以修改為想要的埠號
    proxy: {
      "/api": {
        target: "http://localhost:8000", // 將所有 /api 開頭的請求代理到後端伺服器
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
