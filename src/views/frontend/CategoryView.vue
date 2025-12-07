<template>
  <div class="category-container">
    <h1>分类列表</h1>
    
    <!-- 分类列表 -->
    <div class="article-list">
      <div 
        v-for="category in categories" 
        :key="category.id" 
        class="article-item"
        :class="{ active: selectedCategoryId === category.id }"
        @click="selectCategory(category.id)"
      >
        <h3>{{ category.name }}</h3>
        <p class="article-meta">
          分类 | 共 {{ category.articleCount || 0 }} 篇文章
        </p>
        <p class="article-excerpt">
          {{ category.description || '包含该分类下的所有文章，涵盖相关主题的最新内容。' }}
        </p>
      </div>
    </div>
    
    <!-- 文章列表 -->
    <div v-if="selectedCategoryId" class="article-section">
      <h2>{{ selectedCategoryName }} 分类</h2>
      <div class="article-list">
        <div v-for="article in articles" :key="article.id" class="article-item">
          <router-link :to="{ name: 'article-detail', params: { id: article.id } }">
            <h3>{{ article.title }}</h3>
            <p class="article-meta">{{ article.date }} | 阅读 {{ article.views }}</p>
            <p class="article-excerpt">{{ article.summary }}</p>
          </router-link>
        </div>
        <div v-if="articles.length === 0" class="empty">该分类下暂无文章</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { getArticles } from '../../api/article'
import { getCategories } from '../../api/category'

export default {
  name: 'CategoryView',
  setup() {
    // 响应式变量
    const categories = ref([])
    const articles = ref([])
    const selectedCategoryId = ref(null)
    const loading = ref(false)
    
    // 计算属性：当前选中的分类名称
    const selectedCategoryName = computed(() => {
      const category = categories.value.find(cat => cat.id === selectedCategoryId.value)
      return category ? category.name : ''
    })
    
    // 获取所有分类
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories()
        // 获取所有文章，用于计算每个分类的文章数量
        const articlesResponse = await getArticles()
        const allArticles = articlesResponse.data || articlesResponse
        
        // 计算每个分类的文章数量
        categories.value = categoriesData.map(category => {
          const articleCount = allArticles.filter(article => article.categoryId === category.id).length
          return {
            ...category,
            articleCount
          }
        })
      } catch (error) {
        console.error('获取分类失败:', error)
      }
    }
    
    // 选择分类
    const selectCategory = async (categoryId) => {
      selectedCategoryId.value = categoryId
      
      try {
        loading.value = true
        // 获取选中分类的文章
        const response = await getArticles({ categoryId })
        articles.value = response.data.map(article => ({
          ...article,
          date: new Date(article.createTime).toLocaleDateString('zh-CN'),
          views: article.viewCount,
          summary: article.content.length > 150 ? article.content.substring(0, 150) + '...' : article.content
        }))
        loading.value = false
      } catch (error) {
        console.error('获取分类文章失败:', error)
        loading.value = false
        articles.value = []
      }
    }
    
    // 初始化
    onMounted(async () => {
      await fetchCategories()
    })

    return {
      categories,
      articles,
      selectedCategoryId,
      selectedCategoryName,
      selectCategory
    }
  }
}
</script>

<style scoped>
.category-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
}

h1 {
  text-align: center;
}

/* 确保分类列表和文章列表也固定宽度 */
.category-list,
.article-section {
  width: 100%;
  box-sizing: border-box;
}

/* 确保文章列表中的文章项也固定宽度 */
.article-item {
  width: 100%;
  box-sizing: border-box;
}

/* 分类项激活状态样式 */
.article-item.active {
  border-left: 4px solid #409eff;
  background: #ecf5ff;
}

.article-item.active h3 {
  color: #409eff;
}

.article-item:hover {
  transform: translateY(-2px);
}

/* 文章列表样式 */
.article-list {
  margin-top: 30px;
}

/* 文章部分样式 */
.article-section {
  margin-top: 20px;
}

.article-section h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

/* 文章列表样式 */
.article-list {
  margin-top: 20px;
}

.article-item {
  padding: 20px;
  margin-bottom: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.article-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.article-item a {
  text-decoration: none;
  color: inherit;
}

.article-item h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.article-meta {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

.article-excerpt {
  color: #555;
  line-height: 1.6;
}

.empty {
  text-align: center;
  padding: 50px;
  color: #999;
  background: #f9f9f9;
  border-radius: 8px;
}
</style>