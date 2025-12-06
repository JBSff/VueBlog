import { defineStore } from 'pinia';
import { mockUsers } from './mockData';
import StorageUtil from '../utils/storage';

// 存储键名
const USER_STORAGE_KEY = 'blog_user';
const TOKEN_STORAGE_KEY = 'blog_token';
const REGISTERED_USERS_KEY = 'registered_users';

export const useUserStore = defineStore('user', {
  state: () => ({
    // 从localStorage获取用户信息，无数据时使用null
    currentUser: StorageUtil.getData(USER_STORAGE_KEY, null),
    // 从localStorage获取token，无数据时使用null
    token: StorageUtil.getData(TOKEN_STORAGE_KEY, null),
    // 获取注册的用户列表，如果没有则使用空数组
    registeredUsers: StorageUtil.getData(REGISTERED_USERS_KEY, []),
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.currentUser,
    isAdmin: (state) => state.currentUser?.role === 'admin'
  },

  actions: {
    // 保存用户信息到localStorage
    saveUserToStorage() {
      StorageUtil.saveData(USER_STORAGE_KEY, this.currentUser);
    },
    
    // 保存token到localStorage
    saveTokenToStorage() {
      StorageUtil.saveData(TOKEN_STORAGE_KEY, this.token);
    },
    
    // 保存注册用户列表到localStorage
    saveRegisteredUsersToStorage() {
      StorageUtil.saveData(REGISTERED_USERS_KEY, this.registeredUsers);
    },
    
    // 注册新用户
    async register(username, password, email) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 检查用户名是否已存在
        const existingUser = mockUsers.find(u => u.username === username) || 
                           this.registeredUsers.find(u => u.username === username);
        
        if (existingUser) {
          throw new Error('用户名已存在');
        }
        
        // 创建新用户
        const newUser = {
          id: Date.now(), // 使用时间戳作为ID
          username,
          password, // 实际项目中应该使用加密密码
          email: email || `${username}@example.com`,
          role: 'user' // 默认角色为普通用户
        };
        
        // 添加到注册用户列表
        this.registeredUsers.push(newUser);
        
        // 保存到localStorage
        this.saveRegisteredUsersToStorage();
        
        return true;
      } catch (error) {
        this.error = error.message;
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // 登录
    async login(username, password) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 查找用户（包括模拟用户和注册用户）
        const user = mockUsers.find(u => u.username === username && u.password === password) ||
                    this.registeredUsers.find(u => u.username === username && u.password === password);
        
        if (!user) {
          throw new Error('用户名或密码错误');
        }
        
        // 生成模拟token
        const mockToken = `mock_token_${Date.now()}`;
        
        // 更新状态
        this.currentUser = user;
        this.token = mockToken;
        
        // 保存到localStorage
        this.saveUserToStorage();
        this.saveTokenToStorage();
        
        return true;
      } catch (error) {
        this.error = error.message;
        return false;
      } finally {
        this.loading = false;
      }
    },

    // 登出
    logout() {
      this.currentUser = null;
      this.token = null;
      
      // 清除localStorage
      StorageUtil.removeData(USER_STORAGE_KEY);
      StorageUtil.removeData(TOKEN_STORAGE_KEY);
    },

    // 验证token
    validateToken() {
      // 简单验证token是否存在
      return !!this.token;
    },
    
    // 重置密码
    async resetPassword(username, newPassword) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 查找用户（包括模拟用户和注册用户）
        const userIndex = this.registeredUsers.findIndex(u => u.username === username);
        
        if (userIndex === -1) {
          // 检查是否为模拟用户
          const mockUserIndex = mockUsers.findIndex(u => u.username === username);
          if (mockUserIndex === -1) {
            throw new Error('用户不存在');
          }
          // 模拟用户不允许修改密码
          throw new Error('模拟用户不支持密码重置');
        }
        
        // 更新用户密码
        this.registeredUsers[userIndex].password = newPassword;
        
        // 保存到localStorage
        this.saveRegisteredUsersToStorage();
        
        return true;
      } catch (error) {
        this.error = error.message;
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
});
