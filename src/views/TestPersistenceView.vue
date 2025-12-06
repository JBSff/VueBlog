<template>
  <div class="test-container">
    <div class="test-section">
      <h2>用户登录状态测试</h2>
      <p>当前用户: {{ userStore.currentUser ? userStore.currentUser.username : '未登录' }}</p>
      <p>登录状态: {{ userStore.isAuthenticated ? '已登录' : '未登录' }}</p>
      <el-button v-if="!userStore.isAuthenticated" @click="testLogin" type="primary">测试登录</el-button>
      <el-button v-else @click="testLogout" type="danger">测试登出</el-button>
    </div>
    
    <div class="test-section">
      <h2>文章数据测试</h2>
      <p>文章数量: {{ articleStore.articles.length }}</p>
      <el-button @click="testAddArticle" type="primary">添加测试文章</el-button>
      <el-button @click="testDeleteArticle" type="danger" :disabled="articleStore.articles.length === 0">删除最后一篇文章</el-button>
    </div>
    
    <div class="test-section">
      <h2>分类数据测试</h2>
      <p>分类数量: {{ categoryStore.categories.length }}</p>
      <el-button @click="testAddCategory" type="primary">添加测试分类</el-button>
      <el-button @click="testDeleteCategory" type="danger" :disabled="categoryStore.categories.length === 0">删除最后一个分类</el-button>
    </div>
    
    <div class="test-section">
      <h2>标签数据测试</h2>
      <p>标签数量: {{ tagStore.tags.length }}</p>
      <el-button @click="testAddTag" type="primary">添加测试标签</el-button>
      <el-button @click="testDeleteTag" type="danger" :disabled="tagStore.tags.length === 0">删除最后一个标签</el-button>
    </div>
    
    <div class="test-section">
      <h2>评论数据测试</h2>
      <p>评论数量: {{ commentStore.comments.length }}</p>
      <el-button @click="testAddComment" type="primary">添加测试评论</el-button>
      <el-button @click="testDeleteComment" type="danger" :disabled="commentStore.comments.length === 0">删除最后一条评论</el-button>
    </div>
    
    <div class="test-section">
      <h2>localStorage 数据检查</h2>
      <el-button @click="showLocalStorageData" type="info">显示localStorage数据</el-button>
      <el-button @click="clearLocalStorageData" type="warning">清空localStorage数据</el-button>
      <div v-if="localStorageData" class="localStorage-display">
        <pre>{{ localStorageData }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useArticleStore } from '../stores/articleStore'
import { useCategoryStore } from '../stores/categoryStore'
import { useTagStore } from '../stores/tagStore'
import { useCommentStore } from '../stores/commentStore'
import { ElMessage } from 'element-plus'

export default {
  name: 'TestPersistenceView',
  setup() {
    const userStore = useUserStore()
    const articleStore = useArticleStore()
    const categoryStore = useCategoryStore()
    const tagStore = useTagStore()
    const commentStore = useCommentStore()
    const localStorageData = ref('')
    
    // 测试登录
    const testLogin = async () => {
      const success = await userStore.login('admin', 'admin')
      if (success) {
        ElMessage.success('登录成功，数据已保存到localStorage')
      } else {
        ElMessage.error('登录失败')
      }
    }
    
    // 测试登出
    const testLogout = () => {
      userStore.logout()
      ElMessage.success('已登出，localStorage数据已清除')
    }
    
    // 测试添加文章
    const testAddArticle = () => {
      const newArticle = {
        title: `测试文章 ${Date.now()}`,
        content: '这是一篇测试文章，用于验证数据持久化功能。',
        summary: '测试文章摘要',
        categoryId: 1,
        tagIds: [1],
        author: 'admin',
        viewCount: 0,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        status: 'published'
      }
      articleStore.createArticle(newArticle)
      ElMessage.success('文章已添加，数据已保存到localStorage')
    }
    
    // 测试删除文章
    const testDeleteArticle = () => {
      if (articleStore.articles.length > 0) {
        const lastArticle = articleStore.articles[articleStore.articles.length - 1]
        articleStore.deleteArticle(lastArticle.id)
        ElMessage.success('文章已删除，localStorage数据已更新')
      }
    }
    
    // 测试添加分类
    const testAddCategory = () => {
      const newCategory = {
        name: `测试分类 ${Date.now()}`,
        createTime: new Date().toISOString()
      }
      categoryStore.createCategory(newCategory)
      ElMessage.success('分类已添加，数据已保存到localStorage')
    }
    
    // 测试删除分类
    const testDeleteCategory = () => {
      if (categoryStore.categories.length > 0) {
        const lastCategory = categoryStore.categories[categoryStore.categories.length - 1]
        categoryStore.deleteCategory(lastCategory.id)
        ElMessage.success('分类已删除，localStorage数据已更新')
      }
    }
    
    // 测试添加标签
    const testAddTag = () => {
      const newTag = {
        name: `测试标签 ${Date.now()}`,
        createTime: new Date().toISOString()
      }
      tagStore.createTag(newTag)
      ElMessage.success('标签已添加，数据已保存到localStorage')
    }
    
    // 测试删除标签
    const testDeleteTag = () => {
      if (tagStore.tags.length > 0) {
        const lastTag = tagStore.tags[tagStore.tags.length - 1]
        tagStore.deleteTag(lastTag.id)
        ElMessage.success('标签已删除，localStorage数据已更新')
      }
    }
    
    // 测试添加评论
    const testAddComment = () => {
      const newComment = {
        articleId: 1,
        content: `测试评论 ${Date.now()}`,
        author: '测试用户',
        email: 'test@example.com',
        createTime: new Date().toISOString(),
        status: 'approved'
      }
      commentStore.createComment(newComment)
      ElMessage.success('评论已添加，数据已保存到localStorage')
    }
    
    // 测试删除评论
    const testDeleteComment = () => {
      if (commentStore.comments.length > 0) {
        const lastComment = commentStore.comments[commentStore.comments.length - 1]
        commentStore.deleteComment(lastComment.id)
        ElMessage.success('评论已删除，localStorage数据已更新')
      }
    }
    
    // 显示localStorage数据
    const showLocalStorageData = () => {
      const data = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith('blog_')) {
          data[key] = localStorage.getItem(key)
        }
      }
      localStorageData.value = JSON.stringify(data, null, 2)
    }
    
    // 清空localStorage数据
    const clearLocalStorageData = () => {
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith('blog_')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
      localStorageData.value = ''
      ElMessage.success('localStorage数据已清空')
    }
    
    return {
      userStore,
      articleStore,
      categoryStore,
      tagStore,
      commentStore,
      localStorageData,
      testLogin,
      testLogout,
      testAddArticle,
      testDeleteArticle,
      testAddCategory,
      testDeleteCategory,
      testAddTag,
      testDeleteTag,
      testAddComment,
      testDeleteComment,
      showLocalStorageData,
      clearLocalStorageData
    }
  }
}
</script>

<style scoped>
.test-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.test-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.test-section h2 {
  margin-top: 0;
  color: #409eff;
}

.localStorage-display {
  margin-top: 15px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.localStorage-display pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>