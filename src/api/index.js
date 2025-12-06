import axios from 'axios';
import { useUserStore } from '../stores/userStore';

// 创建axios实例
const api = axios.create({
  baseURL: '/api', // 保持原来的baseURL，以便与现有代码兼容
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    const userStore = useUserStore();
    const token = userStore.token;
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // 处理错误响应
    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          const userStore = useUserStore();
          userStore.logout();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          // 禁止访问
          console.error('没有权限访问此资源');
          break;
        case 404:
          // 资源不存在
          console.error('请求的资源不存在');
          break;
        case 500:
          // 服务器错误
          console.error('服务器内部错误');
          break;
        default:
          console.error(`请求失败: ${error.response.data.message || '未知错误'}`);
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('网络错误，请检查您的网络连接');
    } else {
      // 请求配置出错
      console.error('请求错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// 导出API模块
export * from './auth';
export * from './article';
export * from './category';
export * from './tag';
export * from './comment';

export default api;
