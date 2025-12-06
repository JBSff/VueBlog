<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header v-if="!isAdminRoute">
      <div class="header-content">
        <h1 class="site-title"><router-link to="/">我的博客</router-link></h1>
        <nav>
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/category/1" class="nav-link">分类</router-link>
          <template v-if="isAuthenticated">
            <router-link to="/user/profile" class="nav-link">{{ currentUser?.username || '用户' }}</router-link>
          </template>
          <template v-else>
            <router-link to="/login" class="nav-link">登录</router-link>
          </template>
        </nav>
      </div>
    </header>
    
    <!-- 主内容区域 -->
    <main>
      <router-view />
    </main>
    
    <!-- 页脚 -->
    <footer v-if="!isAdminRoute">
      <p>© 2024 我的博客. 保留所有权利.</p>
    </footer>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from './stores/userStore'

export default {
  name: 'App',
  setup() {
    const route = useRoute()
    const userStore = useUserStore()
    
    // 判断是否为管理后台路由
    const isAdminRoute = computed(() => {
      return route.path.startsWith('/admin')
    })
    
    // 用户认证状态
    const isAuthenticated = computed(() => {
      return userStore.isAuthenticated
    })
    
    // 当前用户信息
    const currentUser = computed(() => {
      return userStore.currentUser
    })
    
    return {
      isAdminRoute,
      isAuthenticated,
      currentUser
    }
  }
}
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #333;
  background-color: #f5f7fa;
}

a {
  color: #409eff;
  text-decoration: none;
}

a:hover {
  color: #66b1ff;
}

/* 应用容器 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 顶部导航 */
header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.site-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.site-title a {
  color: #303133;
}

.site-title a:hover {
  color: #409eff;
}

nav {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: #606266;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #409eff;
  background: #ecf5ff;
}

/* 主内容区域 */
main {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

/* 页脚 */
footer {
  background: #fff;
  padding: 30px 0;
  text-align: center;
  color: #909399;
  margin-top: auto;
}
</style>

