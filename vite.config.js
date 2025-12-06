import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 允许通过 IP 或内网穿透访问
    port: 5173,      // 固定端口
    strictPort: true, // 端口被占用时直接退出，避免自动切换导致穿透配置失效
    allowedHosts: ['frp-fun.com'], // 显式指定允许的域名
    cors: true, // 允许跨域
  }
})
