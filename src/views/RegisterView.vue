<template>
  <div class="register-container">
    <div class="register-form">
      <h2>注册</h2>
      <el-form :model="registerForm" :rules="rules" ref="registerFormRef" label-width="80px" autocomplete="off">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" autocomplete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请确认密码" autocomplete="new-password"></el-input>
        </el-form-item>
        <el-form-item class="submit-button-wrapper">
          <el-button type="primary" @click="handleRegister" :loading="loading">注册</el-button>
        </el-form-item>
        <el-form-item class="login-link-wrapper">
          <span>已有账号？</span>
          <a href="/login" @click.prevent="goToLogin">立即登录</a>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

export default {
  name: 'RegisterView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const registerForm = ref({
      username: '',
      password: '',
      confirmPassword: ''
    })
    const loading = ref(false)
    
    // 自定义验证规则 - 密码一致性检查
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== registerForm.value.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' }
      ]
    }

    const registerFormRef = ref(null)
    
    const handleRegister = async () => {
      registerFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          try {
            // 调用userStore的注册方法
            const success = await userStore.register(
              registerForm.value.username,
              registerForm.value.password,
              `${registerForm.value.username}@example.com` // 默认邮箱
            )
            
            if (success) {
              // 注册成功后跳转到登录页面
              ElMessage.success('注册成功，请登录')
              router.push('/login')
            } else {
              // 注册失败，显示错误信息
              ElMessage.error(userStore.error || '注册失败')
            }
          } catch (error) {
            console.error('注册过程中出错:', error)
            ElMessage.error('注册失败，请稍后重试')
          } finally {
            loading.value = false
          }
        }
      })
    }
    
    // 跳转到登录页面
    const goToLogin = () => {
      router.push('/login')
    }

    return {
      registerForm,
      rules,
      registerFormRef,
      loading,
      handleRegister,
      goToLogin,
      userStore
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f7fa;
}

.register-form {
  width: 400px;
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  box-sizing: border-box;
}

.register-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
}

/* 注册按钮居中样式 */
.submit-button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.submit-button-wrapper .el-button {
  width: 200px;
  margin: 0 !important;
}

/* 登录链接样式 */
.login-link-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 15px;
  font-size: 14px;
  color: #606266;
}

.login-link-wrapper a {
  color: #409eff;
  text-decoration: none;
  margin-left: 5px;
}

.login-link-wrapper a:hover {
  color: #66b1ff;
}
</style>