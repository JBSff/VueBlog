<template>
  <div class="login-container">
    <div class="login-form">
      <h2>登录</h2>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="0" autocomplete="off" @keyup.enter.native="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" autocomplete="off" class="full-width-input"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" autocomplete="new-password" @keyup.enter.native="handleLogin" class="full-width-input"></el-input>
        </el-form-item>
        <el-form-item prop="agreeTerms" class="terms-checkbox-wrapper">
          <el-checkbox v-model="loginForm.agreeTerms"><span class="black-text">我已阅读并同意</span><a href="/terms.html" target="_blank">服务条款</a><span class="black-text">和</span><a href="/terms.html" target="_blank">隐私协议</a></el-checkbox>
        </el-form-item>
        <el-form-item class="submit-button-wrapper">
          <el-button type="primary" @click="handleLogin" :loading="loading">登录</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 操作链接区域 - 直接使用div容器，不依赖Element Plus表单项 -->
      <div class="action-links-container">
        <div class="action-links">
          <div class="forgot-password-link">
            <a href="#" @click.prevent="showForgotPasswordDialog = true">忘记密码？</a>
          </div>
          <div class="register-link">
            <a href="/register" @click.prevent="goToRegister">注册</a>
          </div>
        </div>
      </div>
      
      <!-- 忘记密码对话框 -->
      <el-dialog
        title="忘记密码"
        v-model="showForgotPasswordDialog"
        width="400px"
        center
      >
        <el-form :model="forgotPasswordForm" :rules="forgotPasswordRules" ref="forgotPasswordFormRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="forgotPasswordForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="forgotPasswordForm.newPassword" type="password" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="forgotPasswordForm.confirmPassword" type="password" placeholder="请确认新密码"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showForgotPasswordDialog = false">取消</el-button>
            <el-button type="primary" @click="handleForgotPassword" :loading="forgotPasswordLoading">确认重置</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { login } from '../../api/auth'
import { useUserStore } from '../../stores/userStore'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const loginForm = ref({
      username: '',
      password: '',
      agreeTerms: false
    })
    const loading = ref(false)
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ],
      agreeTerms: [
        { 
          required: true, 
          message: '请阅读并同意服务条款和隐私协议', 
          trigger: ['change', 'blur'] 
        },
        { 
          validator: (rule, value, callback) => {
            if (value !== true) {
              callback(new Error('请阅读并同意服务条款和隐私协议'))
            } else {
              callback()
            }
          },
          trigger: ['change', 'blur']
        }
      ]
    }

    const loginFormRef = ref(null)
    
    // 忘记密码相关
    const showForgotPasswordDialog = ref(false)
    const forgotPasswordForm = ref({
      username: '',
      newPassword: '',
      confirmPassword: ''
    })
    const forgotPasswordLoading = ref(false)
    const forgotPasswordFormRef = ref(null)
    const forgotPasswordRules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== forgotPasswordForm.value.newPassword) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }
    
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
            // 直接使用userStore的login方法
            const success = await userStore.login(loginForm.value.username, loginForm.value.password)
            
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

    // 处理忘记密码
    const handleForgotPassword = async () => {
      forgotPasswordFormRef.value.validate(async (valid) => {
        if (valid) {
          forgotPasswordLoading.value = true
          try {
            // 调用重置密码方法
            const success = await userStore.resetPassword(
              forgotPasswordForm.value.username,
              forgotPasswordForm.value.newPassword
            )
            
            if (success) {
              ElMessage.success('密码重置成功，请使用新密码登录')
              showForgotPasswordDialog.value = false
              // 清空忘记密码表单
              forgotPasswordForm.value.username = ''
              forgotPasswordForm.value.newPassword = ''
              forgotPasswordForm.value.confirmPassword = ''
            } else {
              ElMessage.error(userStore.error || '密码重置失败')
            }
          } catch (error) {
            console.error('密码重置过程中出错:', error)
            ElMessage.error('密码重置失败，请稍后重试')
          } finally {
            forgotPasswordLoading.value = false
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
      goToRegister,
      // 忘记密码相关
      showForgotPasswordDialog,
      forgotPasswordForm,
      forgotPasswordRules,
      forgotPasswordFormRef,
      forgotPasswordLoading,
      handleForgotPassword
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  background: #f5f7fa;
  margin-top: 0;
  padding: 20px 0;
}

.login-form {
  width: 400px;
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  box-sizing: border-box;
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

/* 表单样式调整 - 移除label后 */
.el-form-item--label-right .el-form-item__content {
  margin-left: 0 !important;
}

/* 输入框样式 */
.full-width-input {
  width: 100%;
}

.submit-button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.submit-button-wrapper .el-button {
  width: 100%;
  max-width: 100%;
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

/* 服务条款复选框样式 */
.terms-checkbox-wrapper {
  margin-top: 15px;
  text-align: left;
}

.terms-checkbox-wrapper a {
  color: #409eff;
  text-decoration: none;
}

.terms-checkbox-wrapper a:hover {
  color: #66b1ff;
  text-decoration: underline;
}

/* 保持复选框默认颜色，不修改选中状态 */
.terms-checkbox-wrapper .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #409eff !important;
  border-color: #409eff !important;
}

/* 确保复选框标签文字始终为黑色，不受选中状态影响 */
.terms-checkbox-wrapper .el-checkbox__label {
  color: #303133 !important;
  display: block;
}

/* 确保复选框选中状态下文字保持黑色 */
.terms-checkbox-wrapper .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #303133 !important;
}

/* 确保链接文字保持蓝色，不受复选框状态影响 */
.terms-checkbox-wrapper .el-checkbox__label a {
  color: #409eff !important;
  display: inline;
}

/* 强制覆盖Element Plus的选中状态文字颜色 */
.terms-checkbox-wrapper .el-checkbox.is-checked .el-checkbox__label {
  color: #303133 !important;
}

/* 确保.black-text类始终保持黑色 */
.terms-checkbox-wrapper .black-text {
  color: #303133 !important;
  display: inline;
}

/* 确保所有状态下.black-text都不受影响 */
.terms-checkbox-wrapper .el-checkbox__input.is-checked + .el-checkbox__label .black-text {
  color: #303133 !important;
}

.terms-checkbox-wrapper .el-checkbox.is-checked .black-text {
  color: #303133 !important;
}

/* 操作链接容器样式 */
.action-links-container {
  width: 100%;
  margin-top: 15px;
}

.action-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 14px;
}

/* 忘记密码链接样式 */
.forgot-password-link a {
  color: #409eff;
  text-decoration: none;
}

.forgot-password-link a:hover {
  color: #66b1ff;
}

/* 注册链接样式 */
.register-link a {
  color: #409eff;
  text-decoration: none;
}

.register-link a:hover {
  color: #66b1ff;
}
</style>