<template>
  <div class="admin-container">
    
    <!-- 主要内容区域 - 包含侧边栏和内容 -->
    <div class="admin-main">
      <!-- 侧边栏 - 保留原有功能 -->
      <div class="sidebar">
        <div class="logo">管理后台</div>
        <el-menu :default-active="activeMenu" class="el-menu-vertical" @select="handleMenuSelect">
          <el-menu-item index="overview">
            <i class="el-icon-s-data"></i>
            <span slot="title">今日概览</span>
          </el-menu-item>
          <el-menu-item index="articles">
            <i class="el-icon-document"></i>
            <span slot="title">文章管理</span>
          </el-menu-item>
          <el-menu-item index="categories">
            <i class="el-icon-folder"></i>
            <span slot="title">分类管理</span>
          </el-menu-item>
          <el-menu-item index="tags">
            <i class="el-icon-tickets"></i>
            <span slot="title">标签管理</span>
          </el-menu-item>
          <el-menu-item index="comments">
            <i class="el-icon-chat-line-square"></i>
            <span slot="title">评论管理</span>
          </el-menu-item>
          <el-menu-item index="settings">
            <i class="el-icon-setting"></i>
            <span slot="title">系统设置</span>
          </el-menu-item>
        </el-menu>
        <div class="logout" @click="logout">退出登录</div>
      </div>
      
      <!-- 主内容区域 -->
      <div class="main-content">
        <h1 class="page-title">{{ pageTitle }}</h1>
      
        <!-- 今日概览 -->
        <div v-if="activeMenu === 'overview'">
          <el-row :gutter="20" class="overview-cards">
            <el-col :span="6">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-header">今日访问量</div>
                <div class="stat-value">{{ overviewData.todayViews }}</div>
                <div class="stat-footer">较昨日 +{{ Math.floor(Math.random() * 10) }}%</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-header">新增文章数</div>
                <div class="stat-value">{{ overviewData.newArticles }}</div>
                <div class="stat-footer">总文章数: {{ articles.length }}</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-header">新增注册数</div>
                <div class="stat-value">{{ overviewData.newUsers }}</div>
                <div class="stat-footer">总用户数: {{ totalUsers }}</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-header">待审核评论</div>
                <div class="stat-value">{{ overviewData.pendingComments }}</div>
                <div class="stat-footer">总评论数: {{ comments.length }}</div>
              </el-card>
            </el-col>
          </el-row>

          <el-card shadow="never" class="content-card" style="margin-top: 20px;">
            <template #header>
              <div class="card-header">
                <span>最近5条评论</span>
              </div>
            </template>
            <el-table :data="overviewData.recentComments" style="width: 100%;" fit>
              <el-table-column prop="content" label="评论内容" show-overflow-tooltip></el-table-column>
              <el-table-column prop="author" label="作者" width="120"></el-table-column>
              <el-table-column prop="articleTitle" label="所属文章" show-overflow-tooltip></el-table-column>
              <el-table-column prop="createTime" label="评论时间" width="180">
                <template #default="scope">
                  {{ new Date(scope.row.createTime).toLocaleString() }}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>

        <!-- 文章管理 -->
        <el-card v-if="activeMenu === 'articles'" shadow="never" class="content-card">
          <template #header>
            <div class="card-header">
              <span>文章管理</span>
              <el-button type="primary" @click="showArticleDialog = true">添加文章</el-button>
            </div>
          </template>
          <div class="operation-bar">
            <el-input
              v-model.trim="searchKeyword"
              clearable
              placeholder="搜索标题/内容/分类/作者"
              style="width: 240px;"
            ></el-input>
            <span style="margin-left: 10px; color: #999; font-size: 12px;">
              (搜索: {{ searchKeyword || '无' }}, 共 {{ filteredArticles.length }} 条结果)
            </span>
          </div>

          <el-table :data="filteredArticles" style="width: 100%;" fit>
            <el-table-column prop="id" label="ID" width="60"></el-table-column>
            <el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
            <el-table-column prop="category" label="分类" width="100"></el-table-column>
            <el-table-column prop="date" label="发布日期" width="120"></el-table-column>
            <el-table-column label="阅读量" width="80">
              <template #default="scope">
                {{ scope.row.views || 0 }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140">
              <template #default="scope">
                <el-button size="small" @click="editArticle(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteArticle(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        
        <!-- 分类管理 -->
        <el-card v-if="activeMenu === 'categories'" shadow="never" class="content-card">
          <template #header>
            <div class="card-header">
              <span>分类管理</span>
              <el-button type="primary" @click="showCategoryDialog = true">添加分类</el-button>
            </div>
          </template>
          <el-table :data="categories" style="width: 100%;" fit>
            <el-table-column prop="id" label="ID" width="60"></el-table-column>
            <el-table-column prop="name" label="分类名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="articleCount" label="文章数量" width="100"></el-table-column>
            <el-table-column label="操作" width="140">
              <template #default="scope">
                <el-button size="small" @click="editCategory(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteCategory(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        
        <!-- 标签管理 -->
        <el-card v-if="activeMenu === 'tags'" shadow="never" class="content-card">
          <template #header>
            <div class="card-header">
              <span>标签管理</span>
              <el-button type="primary" @click="showTagDialog = true">添加标签</el-button>
            </div>
          </template>
          <el-table :data="tags" style="width: 100%;" fit>
            <el-table-column prop="id" label="ID" width="60"></el-table-column>
            <el-table-column prop="name" label="标签名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="articleCount" label="使用次数" width="100"></el-table-column>
            <el-table-column label="操作" width="140">
              <template #default="scope">
                <el-button size="small" @click="editTag(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteTag(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        
        <!-- 评论管理 -->
        <el-card v-if="activeMenu === 'comments'" shadow="never" class="content-card">
          <template #header>
            <div class="card-header">
              <span>评论管理</span>
            </div>
          </template>
          <el-table :data="comments" style="width: 100%;" fit>
            <el-table-column prop="id" label="ID" width="60"></el-table-column>
            <el-table-column prop="articleTitle" label="文章标题" show-overflow-tooltip width="150"></el-table-column>
            <el-table-column prop="author" label="评论者" width="100"></el-table-column>
            <el-table-column prop="content" label="评论内容" show-overflow-tooltip></el-table-column>
            <el-table-column prop="time" label="评论时间" width="120"></el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button size="small" type="danger" @click="deleteComment(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        
        <!-- 系统设置 -->
        <el-card v-if="activeMenu === 'settings'" shadow="never" class="content-card">
          <template #header>
            <div class="card-header">
              <span>系统设置</span>
            </div>
          </template>
          <el-form label-width="120px" class="full-width-form">
            <el-form-item label="博客名称">
              <el-input v-model="settings.blogName" class="full-width-input"></el-input>
            </el-form-item>
            <el-form-item label="博客描述">
              <el-input v-model="settings.blogDescription" type="textarea" rows="3" class="full-width-input"></el-input>
            </el-form-item>
            <el-form-item class="center-button">
              <el-button type="primary" @click="saveSettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
    
    <!-- 文章对话框 -->
    <el-dialog v-model="showArticleDialog" title="文章编辑" width="80%">
      <el-form :model="currentArticle" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="currentArticle.title"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="currentArticle.categoryId" placeholder="选择分类">
            <el-option v-for="cat in categories" :key="cat._id || cat.id" :label="cat.name" :value="cat._id || cat.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="currentArticle.tagIds" placeholder="选择标签" multiple>
            <el-option v-for="tag in tags" :key="tag._id || tag.id" :label="tag.name" :value="tag._id || tag.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="currentArticle.content" type="textarea" rows="10"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showArticleDialog = false">取消</el-button>
        <el-button type="primary" @click="saveArticle">保存</el-button>
      </template>
    </el-dialog>
    
    <!-- 分类对话框 -->
    <el-dialog v-model="showCategoryDialog" title="分类编辑" width="50%">
      <el-form :model="currentCategory" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="currentCategory.name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCategoryDialog = false">取消</el-button>
        <el-button type="primary" @click="saveCategory">保存</el-button>
      </template>
    </el-dialog>
    
    <!-- 标签对话框 -->
    <el-dialog v-model="showTagDialog" title="标签编辑" width="50%">
      <el-form :model="currentTag" label-width="80px">
        <el-form-item label="标签名称">
          <el-input v-model="currentTag.name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showTagDialog = false">取消</el-button>
        <el-button type="primary" @click="saveTag">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getArticles, createArticle, updateArticle, deleteArticle as deleteArticleApi } from '../../api/article'
import { getCategories, createCategory, updateCategory, deleteCategory as deleteCategoryApi } from '../../api/category'
import { getTags, createTag, updateTag, deleteTag as deleteTagApi } from '../../api/tag'
import { getAllComments, deleteComment as deleteCommentApi } from '../../api/comment'
import { useUserStore } from '../../stores/userStore'

export default {
  name: 'AdminView',
  setup() {
    const router = useRouter()
    const activeMenu = ref('overview')
    const pageTitle = ref('今日概览')
    const userStore = useUserStore()
    
    // 数据状态
    const articles = ref([])
    const categories = ref([])
    const tags = ref([])
    const comments = ref([])
    const overviewData = ref({
      todayViews: 0,
      newArticles: 0,
      newUsers: 0,
      pendingComments: 0,
      recentComments: []
    })
    const totalUsers = ref(0)
    const settings = ref({
      blogName: 'Vue学习博客',
      blogDescription: '欢迎访问我的博客'
    })
    
    // 表单状态
    const showArticleDialog = ref(false)
    const showCategoryDialog = ref(false)
    const showTagDialog = ref(false)
    const searchKeyword = ref('')
    const filteredArticles = computed(() => {
      const keyword = (searchKeyword.value || '').trim().toLowerCase()
      console.log('Computed triggered. Keyword:', keyword, 'Articles count:', articles.value.length)
      if (!keyword) {
        return articles.value
      }
      const result = articles.value.filter(article => {
        if (!article) return false
        const title = (article.title || '').toLowerCase()
        const content = (article.content || '').toLowerCase()
        const category = (article.category || '').toLowerCase()
        const author = (article.author || '').toLowerCase()
        const match = title.includes(keyword) || 
               content.includes(keyword) || 
               category.includes(keyword) ||
               author.includes(keyword)
        return match
      })
      console.log('Filtered count:', result.length)
      return result
    })
    
    const currentArticle = ref({
      id: '',
      title: '',
      categoryId: '',
      tagIds: [],
      content: ''
    })
    const currentCategory = ref({
      id: '',
      name: ''
    })
    const currentTag = ref({
      id: '',
      name: ''
    })

    // 加载数据
    const loadData = async () => {
      try {
        // 获取分类列表
        const categoriesResponse = await getCategories()
        categories.value = categoriesResponse.data || categoriesResponse
        
        // 获取标签列表
        const tagsResponse = await getTags()
        tags.value = tagsResponse.data || tagsResponse
        
        // 获取文章列表 - 包含所有状态的文章，不分页
        const articlesResponse = await getArticles({ includeAllStatuses: true, pageSize: 100 })
        // 确保正确获取文章数据
        const articlesData = articlesResponse.data || []
        articles.value = articlesData.map(article => {
          // 根据categoryId查找分类名称
          const category = categories.value.find(cat => cat.id === article.categoryId)
          return {
            ...article,
            category: category?.name || '未分类',
            date: new Date(article.createTime || article.createdAt).toLocaleDateString('zh-CN'),
            views: article.viewCount || article.views || 0 // 确保阅读量字段存在，默认值为0
          }
        })
        
        // 计算每个分类的文章数量
        categories.value = categories.value.map(category => {
          const count = articles.value.filter(article => article.categoryId === category.id).length
          return {
            ...category,
            articleCount: count
          }
        })
        
        // 计算每个标签的使用次数
        tags.value = tags.value.map(tag => {
          const count = articles.value.filter(article => article.tagIds?.includes(tag.id)).length
          return {
            ...tag,
            articleCount: count
          }
        })
        
        // 获取评论列表
        const commentsResponse = await getAllComments()
        comments.value = (commentsResponse.data || commentsResponse).map(comment => {
          // 根据articleId查找文章标题
          const article = articles.value.find(a => a.id === comment.articleId)
          return {
            ...comment,
            author: comment.author || '匿名用户',
            articleTitle: article?.title || '未知文章',
            time: new Date(comment.createTime || comment.createdAt).toLocaleDateString('zh-CN')
          }
        })

        // 计算今日概览数据
        const today = new Date().toLocaleDateString()
        
        // 今日访问量 (模拟)
        overviewData.value.todayViews = Math.floor(Math.random() * 500) + 100
        
        // 新增文章数
        overviewData.value.newArticles = articles.value.filter(a => 
          new Date(a.createTime).toLocaleDateString() === today
        ).length
        
        // 新增注册数
        const allUsers = [...userStore.registeredUsers]
        overviewData.value.newUsers = allUsers.filter(u => {
          if (typeof u.id === 'number' && u.id > 1600000000000) {
             return new Date(u.id).toLocaleDateString() === today
          }
          return false
        }).length
        totalUsers.value = userStore.registeredUsers.length + 2 // +2 是 mockUsers 的数量
        
        // 待审核评论
        overviewData.value.pendingComments = comments.value.filter(c => c.status !== 'approved').length
        
        // 最近5条评论
        overviewData.value.recentComments = [...comments.value]
          .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
          .slice(0, 5)
          .map(c => {
            const article = articles.value.find(a => a.id === c.articleId)
            return {
              ...c,
              articleTitle: article ? article.title : '未知文章'
            }
          })

      } catch (error) {
        console.error('加载数据失败:', error)
      }
    }

    // 菜单切换
    const handleMenuSelect = (index) => {
      activeMenu.value = index
      switch (index) {
        case 'overview':
          pageTitle.value = '今日概览'
          break
        case 'articles':
          pageTitle.value = '文章管理'
          break
        case 'categories':
          pageTitle.value = '分类管理'
          break
        case 'tags':
          pageTitle.value = '标签管理'
          break
        case 'comments':
          pageTitle.value = '评论管理'
          break
        case 'settings':
          pageTitle.value = '系统设置'
          break
      }
    }

    // 文章相关操作
    const editArticle = (article) => {
      // 找到对应分类ID
      const category = categories.value.find(cat => cat.name === article.category)
      currentArticle.value = {
        id: article.id,
        title: article.title,
        categoryId: category ? (category._id || category.id) : '',
        tagIds: article.tagIds || article.tags || [],
        content: article.content || ''
      }
      showArticleDialog.value = true
    }

    const saveArticle = async () => {
      try {
        const articleData = {
          title: currentArticle.value.title,
          categoryId: currentArticle.value.categoryId,
          tagIds: currentArticle.value.tagIds,
          content: currentArticle.value.content
        }
        
        if (currentArticle.value.id) {
          // 更新文章
          await updateArticle(currentArticle.value.id, articleData)
          ElMessage.success('文章更新成功')
        } else {
          // 创建文章
          await createArticle(articleData)
          ElMessage.success('文章创建成功')
        }
        
        showArticleDialog.value = false
        // 重置表单
        currentArticle.value = {
          id: '',
          title: '',
          categoryId: '',
          tagIds: [],
          content: ''
        }
        loadData() // 重新加载数据
      } catch (error) {
        console.error('保存文章失败:', error)
        ElMessage.error('保存文章失败，请稍后重试')
      }
    }

    const deleteArticle = async (id) => {
      try {
        await deleteArticleApi(id)
        articles.value = articles.value.filter(item => item.id !== id)
        ElMessage.success('文章删除成功')
      } catch (error) {
        console.error('删除文章失败:', error)
        ElMessage.error('删除文章失败，请稍后重试')
      }
    }

    // 分类相关操作
    const editCategory = (category) => {
      currentCategory.value = { ...category }
      showCategoryDialog.value = true
    }

    const saveCategory = async () => {
      try {
        const categoryData = {
          name: currentCategory.value.name
        }
        
        if (currentCategory.value.id) {
          // 更新分类
          await updateCategory(currentCategory.value.id, categoryData)
          ElMessage.success('分类更新成功')
        } else {
          // 创建分类
          await createCategory(categoryData)
          ElMessage.success('分类创建成功')
        }
        
        showCategoryDialog.value = false
        // 重置表单
        currentCategory.value = {
          id: '',
          name: ''
        }
        loadData() // 重新加载数据
      } catch (error) {
        console.error('保存分类失败:', error)
        ElMessage.error('保存分类失败，请稍后重试')
      }
    }

    const deleteCategory = async (id) => {
      try {
        await deleteCategoryApi(id)
        categories.value = categories.value.filter(item => item.id !== id)
        ElMessage.success('分类删除成功')
      } catch (error) {
        console.error('删除分类失败:', error)
        ElMessage.error('删除分类失败，请稍后重试')
      }
    }

    // 标签相关操作
    const editTag = (tag) => {
      currentTag.value = { ...tag }
      showTagDialog.value = true
    }

    const saveTag = async () => {
      try {
        const tagData = {
          name: currentTag.value.name
        }
        
        if (currentTag.value.id) {
          // 更新标签
          await updateTag(currentTag.value.id, tagData)
          ElMessage.success('标签更新成功')
        } else {
          // 创建标签
          await createTag(tagData)
          ElMessage.success('标签创建成功')
        }
        
        showTagDialog.value = false
        // 重置表单
        currentTag.value = {
          id: '',
          name: ''
        }
        loadData() // 重新加载数据
      } catch (error) {
        console.error('保存标签失败:', error)
        ElMessage.error('保存标签失败，请稍后重试')
      }
    }

    const deleteTag = async (id) => {
      try {
        await deleteTagApi(id)
        tags.value = tags.value.filter(item => item.id !== id)
        ElMessage.success('标签删除成功')
      } catch (error) {
        console.error('删除标签失败:', error)
        ElMessage.error('删除标签失败，请稍后重试')
      }
    }

    // 评论相关操作
    const deleteComment = async (id) => {
      try {
        await deleteCommentApi(id)
        comments.value = comments.value.filter(item => item.id !== id)
        ElMessage.success('评论删除成功')
      } catch (error) {
        console.error('删除评论失败:', error)
        ElMessage.error('删除评论失败，请稍后重试')
      }
    }

    // 设置相关操作
    const saveSettings = () => {
      // 实际项目中这里应该调用API保存设置
      ElMessage.success('设置保存成功')
    }

    // 退出登录
    const logout = () => {
      userStore.logout()
      router.push('/login')
    }

    onMounted(() => {
      loadData()
    })

    return {
        activeMenu,
        pageTitle,
        articles,
        filteredArticles,
        categories,
        tags,
        comments,
        overviewData,
        totalUsers,
        settings,
        showArticleDialog,
        showCategoryDialog,
        showTagDialog,
        searchKeyword,
        currentArticle,
        currentCategory,
        currentTag,
        handleMenuSelect,
        editArticle,
        saveArticle,
        deleteArticle,
        editCategory,
        saveCategory,
        deleteCategory,
        editTag,
        saveTag,
        deleteTag,
        deleteComment,
        saveSettings,
        logout
      }
  }
}
</script>

<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 60px); /* 减去顶部导航栏高度 */
  background: #f0f2f5;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* 主要内容区域布局 - 与用户中心保持一致 */
.admin-main {
  display: flex;
  min-height: calc(100vh - 60px);
  width: 950px;
  margin: 0 auto;
  overflow: hidden;
  box-sizing: border-box;
}

.sidebar {
  width: 200px; /* 减小侧边栏宽度以适应950px总宽度 */
  background-color: #304156;
  color: white;
  display: flex;
  flex-direction: column;
  flex-shrink: 0; /* 防止被压缩 */
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
  width: 100%;
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
  white-space: nowrap;
  text-align: left;
}

/* 确保子菜单和嵌套选项也有一致的宽度 */
.el-menu-vertical .el-sub-menu {
  width: 100%;
}

.el-menu-vertical .el-sub-menu .el-menu-item {
  width: 100%;
  padding-left: 40px !important;
}

.el-menu-vertical .el-menu {
  width: 100%;
  background-color: #304156;
}

.el-menu-vertical .el-menu-item:hover,
.el-menu-vertical .el-menu-item.is-active {
  background: #1890ff;
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
  flex: 1;
  padding: 15px;
  width: calc(950px - 200px); /* 修改为固定宽度，确保内容区域宽度为950px减去侧边栏宽度 */
  margin: 0;
  overflow-x: hidden;
  box-sizing: border-box;
  min-height: 600px;
}

.page-title {
  color: #303133;
  margin: 0 0 20px 0;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
}

/* 卡片样式 - 与用户中心保持一致 */
.content-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  color: #303133;
}

.operation-bar {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 100%;
  flex-wrap: wrap;
  gap: 8px;
  box-sizing: border-box;
}

/* 为表格和表单组件添加统一的宽度控制 */
.el-table {
  width: 100% !important; /* 强制表格宽度100% */
  table-layout: fixed; /* 固定表格布局 */
  max-width: 100% !important; /* 确保不超出父容器 */
  word-break: break-all; /* 允许单词换行 */
  overflow: hidden; /* 隐藏溢出内容 */
}

/* 移除表单的最大宽度限制，让它占满容器 */
.el-form {
  width: 100%;
  min-width: auto; /* 移除最小宽度限制 */
  max-width: 100%; /* 确保不超出父容器 */
  box-sizing: border-box;
}

/* 确保系统设置中的输入框不会超出容器 */
.el-form .el-input {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* 确保操作按钮区域稳定，且输入框不会超出容器 */
.operation-bar .el-input {
  flex-shrink: 1;
  max-width: 100%; /* 确保操作栏中的输入框不会超出 */
  box-sizing: border-box;
}

/* 为操作栏中的按钮组添加适当的边距 */
.operation-bar .el-button-group {
  margin-right: 10px;
}

/* 确保任何输入组件都不会超出容器 */
.el-input-group,
.el-input-number,
.el-select {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* 系统设置页面特定样式 */
  .settings-container {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    display: block;
    box-sizing: border-box;
  }

  .full-width-form {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    display: block;
    box-sizing: border-box;
  }

  /* 为博客名称和描述输入框设置自适应宽度 */
  .settings-container .full-width-input {
    width: 100% !important;
    max-width: 100% !important;
    min-width: auto !important;
    box-sizing: border-box;
    display: block;
    margin: 0;
    padding: 0;
  }

  /* 确保Element Plus表单元素完全填充容器 */
  .el-form--label-left .el-form-item__label {
    text-align: left;
  }

  .el-form-item__content {
    width: auto !important;
    min-width: 0 !important;
    margin-left: 130px !important;
  }

  /* 为博客名称输入框和描述输入框设置自适应宽度 */
  .settings-container .el-input,
  .settings-container .el-textarea {
    width: 100% !important;
    max-width: 100% !important;
    min-width: auto !important;
    box-sizing: border-box;
    display: block;
    margin: 0;
    padding: 0;
  }

  /* 确保输入框和文本域的内部元素也具有自适应宽度 */
  .settings-container .el-input__wrapper,
  .settings-container .el-textarea__inner {
    width: 100% !important;
    max-width: 100% !important;
    min-width: auto !important;
    box-sizing: border-box;
    display: block;
    margin: 0;
    padding: 0;
  }

  /* 移除任何可能影响宽度的默认样式，使用自适应宽度 */
  :deep(.el-input),
  :deep(.el-textarea),
  :deep(.el-input__wrapper),
  :deep(.el-textarea__inner) {
    width: 100% !important;
    max-width: 100% !important;
    min-width: auto !important;
    box-sizing: border-box !important;
  }
  .center-button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 15px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    clear: both;
    text-align: center;
  }
  
  /* 确保保存设置按钮在系统设置区域完全居中 */
  .settings-container .center-button {
    display: flex;
    justify-content: center !important;
    align-items: center !important;
    margin-top: 20px !important;
    margin-bottom: 10px !important;
    width: 100% !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  
  /* 确保表单项内容区域不会影响按钮居中 */
  .settings-container .el-form-item__content {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 0 !important;
    padding-left: 120px !important;
    width: 100% !important;
    box-sizing: border-box;
  }

  /* 概览卡片样式 */
  .overview-cards {
    margin-bottom: 20px;
  }
  
  .stat-card {
    text-align: center;
    height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .stat-header {
    font-size: 14px;
    color: #909399;
    margin-bottom: 10px;
  }
  
  .stat-value {
    font-size: 28px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 10px;
  }
  
  .stat-footer {
    font-size: 12px;
    color: #67C23A;
  }

  /* 确保按钮本身居中 */
  .settings-container .el-button {
    margin-left: auto;
    margin-right: auto;
  }
  
  /* 修改对话框header样式 - 删除阴影 */
  :deep(.el-dialog__header) {
    box-shadow: none !important;
  }
  
  /* 修改对话框关闭按钮 - 减小范围 */
  :deep(.el-dialog__headerbtn) {
    width: 30px !important;
    height: 30px !important;
    padding: 0 !important;
    margin: 0 !important;
    line-height: 30px !important;
  }
  
  :deep(.el-dialog__close) {
    font-size: 18px !important;
  }
  /* 确保表格标题栏居中显示 - 使用:deep()穿透到组件内部 */
  :deep(.el-table__header-wrapper .el-table__cell .cell) {
    text-align: center !important;
    justify-content: center !important;
    display: flex;
  }
  
  /* 确保表格内容居中显示 */
  :deep(.el-table__body-wrapper .el-table__cell .cell) {
    text-align: center !important;
  }
  
  /* 特别处理ID列和操作列，确保它们的内容居中 */
  :deep(.el-table .el-table__row td) {
    vertical-align: middle;
  }
</style>