<template>
  <div class="home-container">
    <h1>博客首页</h1>
    <div class="article-list">
      <div v-for="article in articles" :key="article.id" class="article-item">
        <router-link :to="{ name: 'article-detail', params: { id: article.id } }">
          <h3>{{ article.title }}</h3>
          <p v-if="article.category || article.date || article.views" class="article-meta">
            {{ article.category }} | {{ article.date }} | 阅读 {{ article.views }}
          </p>
          <p v-if="article.excerpt" class="article-excerpt">{{ article.excerpt }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getArticles } from '../../api/article'
import { getCategories } from '../../api/category'
import { useCategoryStore } from '../../stores/categoryStore'

export default {
  name: 'HomeView',
  setup() {
    const articles = ref([])
    const categoryStore = useCategoryStore()

    onMounted(async () => {
      try {
        // 确保分类数据已加载
        await categoryStore.fetchCategories()
        
        const response = await getArticles()
        articles.value = response.data.map(article => {
          // 获取分类名称
          const category = categoryStore.categories.find(c => c.id === article.categoryId)
          
          return {
            ...article,
            category: category?.name || '',
            date: new Date(article.createTime).toLocaleDateString('zh-CN'),
            views: article.viewCount,
            excerpt: article.content.replace(/[#*`]/g, '').substring(0, 100) + '...'
          }
        })
      } catch (error) {
        console.error('获取文章列表失败:', error)
        ElMessage.error('加载失败，请稍后重试')
      }
    })

    return {
      articles
    }
  }
}
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
}

.article-list {
  margin-top: 30px;
}

.article-item {
  padding: 20px;
  margin-bottom: 20px;
  background: #fff;
  border-radius: 8px;
  transition: transform 0.2s;
}

.article-item:hover {
  transform: translateY(-2px);
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
</style>