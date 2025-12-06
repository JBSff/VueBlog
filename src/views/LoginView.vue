<template>
  <div class="login-container">
    <div class="login-form">
      <h2>登录</h2>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="80px" autocomplete="off">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" autocomplete="new-password"></el-input>
        </el-form-item>
        <el-form-item class="submit-button-wrapper">
          <el-button type="primary" @click="handleLogin" :loading="loading">登录</el-button>
        </el-form-item>
        <el-form-item class="register-link-wrapper">
          <span>还没有账号？</span>
          <a href="/register" @click.prevent="goToRegister">立即注册</a>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { login } from '../api/auth'
import { useUserStore } from '../stores/userStore'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const loginForm = ref({
      username: '',
      password: ''
    })
    const loading = ref(false)
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    }

    const loginFormRef = ref(null)
    
    // 页面加载时清空表单
    onMounted(() => {
      loginForm.value.username = ''
      loginForm.value.password = ''
    })

    const handleLogin = async () => {
      loginFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          try {
            // 使用新的登录API
            const success = await login(loginForm.value.username, loginForm.value.password)
            
            if (success) {
              ElMessage.success('登录成功')
              // 清空表单
              loginForm.value.username = ''
              loginForm.value.password = ''
              
              // 根据用户角色跳转
              if (userStore.isAdmin) {
                router.push('/admin')
              } else {
                router.push('/')
              }
            } else {
              // 登录失败，显示错误信息
              ElMessage.error(userStore.error || '登录失败')
            }
          } catch (error) {
            console.error('登录过程中出错:', error)
            ElMessage.error('登录失败，请稍后重试')
          } finally {
            loading.value = false
          }
        }
      })
    }

    // 跳转到注册页面
    const goToRegister = () => {
      router.push('/register')
    }

    return {
      loginForm,
      rules,
      loginFormRef,
      loading,
      handleLogin,
      goToRegister
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f7fa;
}

.login-form {
  width: 400px;
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.login-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
}

/* 登录按钮居中样式 */
.login-button {
  width: 100%;
  max-width: 200px;
  display: block;
  margin: 0 auto;
  text-align: center;
}

.submit-button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.submit-button-wrapper .el-button {
  width: 200px;
  margin: 0 !important;
}

.register-link-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 15px;
  font-size: 14px;
  color: #606266;
}

.register-link-wrapper a {
  color: #409eff;
  text-decoration: none;
  margin-left: 5px;
}

.register-link-wrapper a:hover {
  color: #66b1ff;
}
</style>