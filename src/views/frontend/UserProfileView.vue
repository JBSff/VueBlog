<template>
  <div class="user-container">
    <div class="sidebar">
      <div class="logo">用户中心</div>
      <el-menu :default-active="activeMenu" class="el-menu-vertical" @select="handleMenuSelect">
        <el-menu-item index="profile">
          <i class="el-icon-user"></i>
          <span slot="title">个人资料</span>
        </el-menu-item>
        <el-menu-item index="articles">
          <i class="el-icon-document"></i>
          <span slot="title">我的文章</span>
        </el-menu-item>
        <el-menu-item index="comments">
          <i class="el-icon-chat-line-square"></i>
          <span slot="title">我的评论</span>
        </el-menu-item>
      </el-menu>
      <div class="logout" @click="logout">退出登录</div>
    </div>
    
    <div class="main-content">
      <h1 class="page-title">{{ pageTitle }}</h1>
      
      <!-- 个人资料 -->
      <el-card v-if="activeMenu === 'profile'" shadow="never" class="content-card">
        <template #header>
          <div class="card-header">
            <span>修改个人资料</span>
          </div>
        </template>
        <el-form :model="userForm" label-width="120px" class="user-form">
          <el-form-item label="用户名">
            <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="当前密码">
            <el-input type="password" v-model="userForm.currentPassword" placeholder="请输入当前密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input type="password" v-model="userForm.newPassword" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input type="password" v-model="userForm.confirmPassword" placeholder="请确认新密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateProfile">保存修改</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- 我的文章 -->
      <el-card v-if="activeMenu === 'articles'" shadow="never" class="content-card">
        <template #header>
          <div class="card-header">
            <span>我的文章</span>
            <el-button type="primary" @click="openCreateArticleDialog">创建文章</el-button>
          </div>
        </template>
        <el-table :data="userArticles" style="width: 100%;" fit>
          <el-table-column prop="id" label="ID" width="50"></el-table-column>
          <el-table-column prop="title" label="标题" show-overflow-tooltip width="200"></el-table-column>
          <el-table-column prop="category" label="分类" width="70"></el-table-column>
          <el-table-column prop="date" label="发布日期" width="100"></el-table-column>
          <el-table-column prop="views" label="阅读量" width="60"></el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button size="small" type="primary" @click="viewArticle(scope.row.id)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      
      <!-- 我的评论 -->
      <el-card v-if="activeMenu === 'comments'" shadow="never" class="content-card">
        <template #header>
          <div class="card-header">
            <span>我的评论</span>
          </div>
        </template>
        <el-table :data="userComments" style="width: 100%;" fit>
          <el-table-column prop="id" label="ID" width="60"></el-table-column>
          <el-table-column prop="articleTitle" label="文章标题" show-overflow-tooltip width="190"></el-table-column>
          <el-table-column prop="content" label="评论内容" show-overflow-tooltip width="280"></el-table-column>
          <el-table-column prop="time" label="评论时间" width="130"></el-table-column>
        </el-table>
      </el-card>
    </div>
    
    <!-- 创建文章对话框 -->
    <el-dialog
      v-model="showCreateArticleDialog"
      title="创建文章"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="currentArticle.title" placeholder="请输入文章标题" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="currentArticle.categoryId" placeholder="请选择分类" style="width: 100%;">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id.toString()"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="currentArticle.tagIds"
            placeholder="请选择标签"
            style="width: 100%;"
            multiple
            collapse-tags
          >
            <el-option
              v-for="tag in tags"
              :key="tag.id"
              :label="tag.name"
              :value="tag.id.toString()"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="currentArticle.content"
            type="textarea"
            placeholder="请输入文章内容"
            rows="15"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateArticleDialog = false">取消</el-button>
          <el-button type="primary" @click="saveArticle">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../../stores/userStore'
import { getArticles, createArticle } from '../../api/article'
import { getAllComments } from '../../api/comment'
import { getCategories } from '../../api/category'
import { getTags } from '../../api/tag'
import StorageUtil from '../../utils/storage'

export default {
  name: 'UserProfileView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    // 检查用户是否登录
    if (!userStore.isAuthenticated) {
      router.push('/login')
      return {}
    }
    
    const activeMenu = ref('profile')
    const userArticles = ref([])
    const userComments = ref([])
    
    // 创建文章相关
    const showCreateArticleDialog = ref(false)
    const categories = ref([])
    const tags = ref([])
    const currentArticle = ref({
      title: '',
      categoryId: '',
      tagIds: [],
      content: ''
    })
    
    // 用户表单数据
    const userForm = ref({
      username: userStore.currentUser?.username || '',
      email: userStore.currentUser?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    // 页面标题
    const pageTitle = computed(() => {
      const titles = {
        'profile': '个人资料',
        'articles': '我的文章',
        'comments': '我的评论'
      }
      return titles[activeMenu.value] || '个人资料'
    })
    
    // 菜单选择处理
    const handleMenuSelect = (index) => {
      activeMenu.value = index
      if (index === 'articles') {
        fetchUserArticles()
      } else if (index === 'comments') {
        fetchUserComments()
      }
    }
    
    // 获取用户文章
    const fetchUserArticles = async () => {
      try {
        const response = await getArticles()
        
        // 获取分类列表，用于根据categoryId获取分类名称
        const categories = await getCategories()
        
        // 过滤出当前用户的文章（使用author字段匹配，因为模拟数据中没有authorId字段）
        const filteredArticles = response.data.filter(article => {
          return article.author === userStore.currentUser.username
        }).map(article => {
          // 获取分类名称
          const category = categories.find(c => c.id === article.categoryId)
          
          // 格式化日期
          const date = new Date(article.createTime).toLocaleDateString('zh-CN')
          
          // 返回处理后的文章数据
          return {
            ...article,
            category: category?.name || '', // 添加分类名称
            date: date // 添加格式化后的日期
          }
        })
        
        // 按id从小到大排序
        userArticles.value = filteredArticles.sort((a, b) => a.id - b.id)
      } catch (error) {
        console.error('获取用户文章失败:', error)
        ElMessage.error('获取文章失败，请稍后重试')
      }
    }
    
    // 获取用户评论
    const fetchUserComments = async () => {
      try {
        const comments = await getAllComments()
        const articles = await getArticles()
        
        // 过滤出当前用户的评论并转换格式
        userComments.value = comments
          .filter(comment => comment.author === userStore.currentUser.username)
          .map(comment => {
            // 根据articleId获取文章标题
            const article = articles.data.find(article => article.id === comment.articleId)
            return {
              ...comment,
              articleTitle: article?.title || '未知文章',
              time: new Date(comment.createTime).toLocaleString('zh-CN')
            }
          })
      } catch (error) {
        console.error('获取用户评论失败:', error)
        ElMessage.error('获取评论失败，请稍后重试')
      }
    }
    
    // 查看文章
    const viewArticle = (id) => {
      router.push(`/article/${id}`)
    }
    
    // 加载分类和标签
    const loadCategoriesAndTags = async () => {
      try {
        categories.value = await getCategories()
        tags.value = await getTags()
      } catch (error) {
        console.error('加载分类和标签失败:', error)
        ElMessage.error('加载分类和标签失败')
      }
    }
    
    // 打开创建文章对话框
    const openCreateArticleDialog = () => {
      loadCategoriesAndTags()
      currentArticle.value = {
        title: '',
        categoryId: '',
        tagIds: [],
        content: ''
      }
      showCreateArticleDialog.value = true
    }
    
    // 保存文章
    const saveArticle = async () => {
      try {
        // 表单验证
        if (!currentArticle.value.title.trim()) {
          ElMessage.warning('请输入文章标题')
          return
        }
        
        if (!currentArticle.value.categoryId) {
          ElMessage.warning('请选择文章分类')
          return
        }
        
        if (!currentArticle.value.content.trim()) {
          ElMessage.warning('请输入文章内容')
          return
        }
        
        // 调用API创建文章
        const articleData = {
          title: currentArticle.value.title,
          categoryId: parseInt(currentArticle.value.categoryId),
          tagIds: currentArticle.value.tagIds.map(id => parseInt(id)),
          content: currentArticle.value.content
        }
        
        // 传入当前登录用户的用户名作为作者
        await createArticle(articleData, userStore.currentUser.username)
        ElMessage.success('文章创建成功')
        
        // 关闭对话框
        showCreateArticleDialog.value = false
        
        // 刷新文章列表
        fetchUserArticles()
      } catch (error) {
        console.error('创建文章失败:', error)
        ElMessage.error('创建文章失败，请稍后重试')
      }
    }
    
    // 更新个人资料
    const updateProfile = async () => {
      try {
        // 验证表单
        if (!userForm.value.username.trim()) {
          ElMessage.warning('请输入用户名')
          return
        }
        
        if (userForm.value.newPassword && userForm.value.newPassword !== userForm.value.confirmPassword) {
          ElMessage.warning('两次输入的密码不一致')
          return
        }
        
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 更新用户信息
        const updatedUser = {
          ...userStore.currentUser,
          username: userForm.value.username,
          email: userForm.value.email
        }
        
        // 更新状态
        userStore.currentUser = updatedUser
        userStore.saveUserToStorage()
        
        ElMessage.success('个人资料更新成功')
      } catch (error) {
        console.error('更新个人资料失败:', error)
        ElMessage.error('更新失败，请稍后重试')
      }
    }
    
    // 退出登录
    const logout = () => {
      userStore.logout()
      router.push('/login')
      ElMessage.success('退出登录成功')
    }
    
    onMounted(() => {
      // 初始加载用户文章
      fetchUserArticles()
      // 初始加载用户评论
      fetchUserComments()
    })
    
    // 确保userStore.currentUser是最新的
    if (!userStore.currentUser) {
      const storedUser = StorageUtil.getData('blog_user', null)
      // 确保admin用户的role始终是admin
      if (storedUser && storedUser.username === 'admin') {
        storedUser.role = 'admin'
      }
      userStore.currentUser = storedUser
      userStore.token = StorageUtil.getData('blog_token', null)
    }
    
    return {
      activeMenu,
      pageTitle,
      userForm,
      userArticles,
      userComments,
      handleMenuSelect,
      fetchUserArticles,
      fetchUserComments,
      viewArticle,
      updateProfile,
      logout,
      // 创建文章相关
      showCreateArticleDialog,
      categories,
      tags,
      currentArticle,
      openCreateArticleDialog,
      saveArticle
    }
  }
}
</script>

<style scoped>
.user-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
  width: 950px;
  margin: 0 auto;
  overflow-x: hidden;
  box-sizing: border-box;
}

.sidebar {
  width: 200px;
  background-color: #304156;
  color: white;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  background-color: #233446;
}

.el-menu-vertical {
  background-color: #304156;
  border-right: none;
}

.el-menu-vertical .el-menu-item {
  color: white;
  height: 50px;
  line-height: 50px;
}

.el-menu-vertical .el-menu-item:hover,
.el-menu-vertical .el-menu-item.is-active {
  background-color: #1890ff;
  color: white;
}

.el-menu-vertical .el-menu-item i {
  color: white;
}

.logout {
  margin-top: auto;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #233446;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout:hover {
  background-color: #1890ff;
}

.main-content {
  width: 750px;
  padding: 20px;
  margin: 0;
  overflow-x: hidden;
  box-sizing: border-box;
  min-height: 600px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 20px 0;
}

.content-card {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 15px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-form {
  max-width: 100%;
  width: 100%;
}

.el-card {
  width: 100% !important;
  box-sizing: border-box;
}

.el-table {
  width: 100% !important;
  box-sizing: border-box;
  table-layout: fixed;
  overflow: hidden;
}

.operation-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

/* 彻底重置表格样式，确保内容与标题完全对齐 */
/* 重置表格容器 */
:deep(.el-table) {
  border-collapse: collapse !important;
  border-spacing: 0 !important;
  table-layout: fixed !important;
}

/* 重置表格单元格 */
:deep(.el-table__header-wrapper .el-table__cell),
:deep(.el-table__body-wrapper .el-table__cell) {
  text-align: center !important;
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
}

/* 重置表格单元格内容容器 */
:deep(.el-table__header-wrapper .el-table__cell .cell),
:deep(.el-table__body-wrapper .el-table__cell .cell) {
  text-align: center !important;
  justify-content: center !important;
  align-items: center !important;
  display: inline-block !important;
  width: 100% !important;
  padding: 10px 8px !important;
  margin: 0 !important;
  box-sizing: border-box !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  line-height: 1.5 !important;
  vertical-align: middle !important;
}

/* 确保所有列的对齐方式完全一致 */
:deep(.el-table__header),
:deep(.el-table__body) {
  width: 100% !important;
}

:deep(.el-table__header-wrapper),
:deep(.el-table__body-wrapper) {
  width: 100% !important;
  overflow: hidden !important;
}

:deep(.el-table__header-row),
:deep(.el-table__body-row) {
  width: 100% !important;
  display: flex !important;
}

:deep(.el-table__header-row > .el-table__cell),
:deep(.el-table__body-row > .el-table__cell) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  max-width: none !important;
  width: auto !important;
}

/* 确保表单项内容区域不会溢出 */
:deep(.el-form-item__content) {
  width: auto !important;
  min-width: 0 !important;
}

/* 确保输入框不会超出容器 */
:deep(.el-input),
:deep(.el-select),
:deep(.el-textarea) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: auto !important;
  box-sizing: border-box !important;
}

/* 隐藏所有滚动条 */
.main-content,
.content-card,
.el-table__body-wrapper,
.el-table__header-wrapper,
.el-table {
  overflow: hidden !important;
}

/* 确保表格不会产生滚动条 */
:deep(.el-table__body-wrapper) {
  overflow: hidden !important;
  max-height: none !important;
}

:deep(.el-table__header-wrapper) {
  overflow: hidden !important;
}

:deep(.el-table) {
  overflow: hidden !important;
}

/* 确保操作栏按钮完全显示，不出现省略号 */
:deep(.el-table__body-wrapper .el-table__cell:last-child .cell) {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  min-width: 100px !important;
  justify-content: center !important;
  display: flex;
}

/* 确保表格单元格内容正确显示，不堆砌 */
:deep(.el-table__body-wrapper .el-table__cell .cell) {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  justify-content: center !important;
  align-items: center;
  display: flex;
  min-height: 30px;
}

/* 确保表格行高统一，不堆砌 */
:deep(.el-table__row) {
  height: auto !important;
  min-height: 50px !important;
  line-height: 1.5 !important;
}

/* 确保表格单元格有足够的高度，不堆砌 */
:deep(.el-table__cell) {
  padding: 10px 8px !important;
  height: auto !important;
  min-height: 50px !important;
  line-height: 1.5 !important;
  vertical-align: middle !important;
}

/* 移除卡片的默认阴影和边框 */
:deep(.el-card) {
  box-shadow: none !important;
  border: none !important;
}

/* 确保卡片header没有阴影 */
:deep(.el-card__header) {
  box-shadow: none !important;
  border-bottom: 1px solid #ebeef5 !important;
}
</style>