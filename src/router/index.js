import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import HomeView from '../views/frontend/HomeView.vue'
import ArticleDetailView from '../views/frontend/ArticleDetailView.vue'
import CategoryView from '../views/frontend/CategoryView.vue'
import AdminView from '../views/backend/AdminView.vue'
import UserProfileView from '../views/backend/UserProfileView.vue'
import LoginView from '../views/frontend/LoginView.vue'
import RegisterView from '../views/frontend/RegisterView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: '首页' }
  },
  {
    path: '/article/:id',
    name: 'article-detail',
    component: ArticleDetailView,
    meta: { title: '文章详情' }
  },
  {
    path: '/category/:id',
    name: 'category',
    component: CategoryView,
    meta: { title: '分类' }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { requiresAuth: true, title: '管理后台' }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { title: '注册' }
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: UserProfileView,
    meta: { requiresAuth: true, title: '用户中心' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.matched.some(record => record.meta.requiresAuth) && !userStore.token) {
    next({ name: 'login' })
  } else {
    next()
  }
})

// 动态设置页面title
router.afterEach((to, from) => {
  if (to.meta.title) {
    document.title = `Vue学习博客 - ${to.meta.title}`
  } else {
    document.title = 'Vue学习博客'
  }
})

export default router