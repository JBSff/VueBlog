import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/VueBlog/' : '/',
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 允许通过 IP 或内网穿透访问
    port: 5174,      // 固定端口为5174，与我们实际使用的端口一致
    strictPort: true, // 端口被占用时直接退出
    allowedHosts: ['frp-fun.com', 'localhost', '127.0.0.1'], // 允许frp-fun.com、localhost和127.0.0.1访问
    cors: true, // 允许跨域
  }
}))
