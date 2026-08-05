import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // 构建号：优先取 Vercel 系统变量（每次部署对应唯一 commit），本地开发回退为空
    __BUILD_INFO__: JSON.stringify({
      sha: process.env.VERCEL_GIT_COMMIT_SHA ?? "",
      ref: process.env.VERCEL_GIT_COMMIT_REF ?? "",
      env: process.env.VERCEL_ENV ?? "development",
    }),
  },
});
