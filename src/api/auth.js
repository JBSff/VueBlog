import { useUserStore } from '../stores/userStore';

// 登录API
export const login = async (username, password) => {
  const userStore = useUserStore();
  return await userStore.login(username, password);
};

// 登出API
export const logout = () => {
  const userStore = useUserStore();
  userStore.logout();
};

// 验证tokenAPI
export const validateToken = () => {
  const userStore = useUserStore();
  return userStore.validateToken();
};

// 获取当前用户信息
export const getCurrentUser = () => {
  const userStore = useUserStore();
  return userStore.currentUser;
};
