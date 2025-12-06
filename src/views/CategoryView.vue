<template>
  <div class="category-container">
    <h1>{{ categoryName }} 分类</h1>
    <div class="article-list">
      <div v-for="article in articles" :key="article.id" class="article-item">
        <router-link :to="{ name: 'article-detail', params: { id: article.id } }">
          <h3>{{ article.title }}</h3>
          <p class="article-meta">{{ article.date }} | 阅读 {{ article.views }}</p>
          <p class="article-excerpt">{{ article.excerpt }}</p>
        </router-link>
      </div>
      <div v-if="articles.length === 0" class="empty">该分类下暂无文章</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getArticles } from '../api/article'
import { useCategoryStore } from '../stores/categoryStore'

export default {
  name: 'CategoryView',
  setup() {
    const route = useRoute()
    const articles = ref([])
    const categoryName = ref('')
    const categoryStore = useCategoryStore()

    const loading = ref(false)
    onMounted(async () => {
      const categoryId = route.params.id
      try {
        loading.value = true
        // 获取分类文章
        const response = await getArticles({ categoryId })
        articles.value = response.data.map(article => ({
          ...article,
          date: new Date(article.createTime).toLocaleDateString('zh-CN'),
          summary: article.content.length > 150 ? article.content.substring(0, 150) + '...' : article.content
        }))
        
        // 从store获取分类名称
        const category = categoryStore.categories.find(cat => cat.id === parseInt(categoryId))
        if (category) {
          categoryName.value = category.name
        } else {
          categoryName.value = '未知分类'
        }
        loading.value = false
      } catch (error) {
        console.error('获取分类文章失败:', error)
        loading.value = false
        // 使用模拟数据
        categoryName.value = '技术'
        articles.value = [
          {
            id: 2,
            title: 'Vue 3 新特性介绍',
            date: '2024-01-02',
            views: 50,
            summary: 'Vue 3带来了许多令人兴奋的新特性，包括Composition API、Teleport、Fragments等。'
          }
        ]
      }
    })

    return {
      articles,
      categoryName
    }
  }
}
</script>

<style scoped>
.category-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.article-list {
  margin-top: 30px;
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