<template>
  <div class="article-detail-container">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="article" class="article-detail">
      <h1>{{ article.title }}</h1>
      <p class="article-meta">
        {{ article.category }} | {{ article.date }} | 阅读 {{ article.views }}
      </p>
      <div class="article-tags">
        <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <div class="article-content" v-html="article.content"></div>
      
      <div class="comments-section">
        <h3>评论 ({{ comments.length }})</h3>
        <div class="comment-form">
          <textarea v-model="newComment.content" placeholder="写下你的评论..." rows="4"></textarea>
          <button @click="submitComment" class="submit-btn">提交评论</button>
        </div>
        <div class="comment-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <p class="comment-author">{{ comment.author }} <span class="comment-time">{{ comment.time }}</span></p>
            <p class="comment-content">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="error">文章不存在</div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { marked } from 'marked'
import { getArticle, updateArticleViews } from '../../api/article'
import { getArticleComments, createComment } from '../../api/comment'
import { useUserStore } from '../../stores/userStore'
import { useCategoryStore } from '../../stores/categoryStore'
import { useTagStore } from '../../stores/tagStore'

// 配置axios基础URL（确保正确的API路径）
// 暂时注释掉，让每个请求使用完整URL
// axios.defaults.baseURL = 'http://localhost:3000/api'

export default {
  name: 'ArticleDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const article = ref(null)
    const comments = ref([])
    const loading = ref(true)
    const newComment = ref({ content: '' })
    const userStore = useUserStore()
    const categoryStore = useCategoryStore()
    const tagStore = useTagStore()

    onMounted(async () => {
      const articleId = route.params.id
      try {
        // 确保分类和标签数据已加载
        await categoryStore.fetchCategories()
        await tagStore.fetchTags()
        
        // 获取文章详情
        const articleData = await getArticle(articleId)
        
        // 检查文章数据是否存在
        if (!articleData) {
          throw new Error('文章不存在')
        }
        
        // 获取分类名称
        const category = categoryStore.categories.find(c => c.id === articleData.categoryId)
        // 获取标签名称
        const tagNames = articleData.tagIds ? articleData.tagIds.map(tagId => {
          const tag = tagStore.tags.find(t => t.id === tagId)
          return tag ? tag.name : ''
        }).filter(name => name) : [] // 过滤掉空字符串
        
        article.value = {
          ...articleData,
          category: category?.name || '',
          date: new Date(articleData.createTime).toLocaleDateString('zh-CN'),
          tags: tagNames,
          content: marked(articleData.content.replace(/^# .+$/gm, '')) // 删除文章内容中的一级标题
        }
        
        // 更新浏览量
        await updateArticleViews(articleId)
        
        // 获取评论列表
        const commentsData = await getArticleComments(articleId)
        comments.value = commentsData.map(comment => ({
          id: comment.id,
          author: comment.author || '匿名用户',
          content: comment.content,
          time: new Date(comment.createTime).toLocaleString('zh-CN')
        }))
      } catch (error) {
        console.error('获取文章详情失败:', error)
        ElMessage.error('加载失败，请稍后重试')
        // 使用模拟数据作为备用
        article.value = {
          id: articleId,
          title: 'Vue 3 新特性介绍',
          category: '技术',
          date: '2024-01-02',
          views: 50,
          tags: ['Vue', 'JavaScript', '前端'],
          content: '<p>Vue 3 是 Vue.js 的最新主要版本，它带来了许多令人兴奋的新特性：</p><ul><li>Composition API - 提供了更好的代码组织和逻辑复用方式</li><li>Teleport - 允许将组件渲染到 DOM 中的其他位置</li><li>Fragments - 支持多根节点</li><li>Performance Improvements - 更小的包体积和更快的渲染</li><li>Multiple v-models - 支持多个双向绑定</li></ul><p>这些新特性让 Vue 3 变得更加强大和灵活。</p>'
        }
        comments.value = [
          { id: 1, author: '张三', content: '很棒的文章！', time: '2024-01-03 10:00' }
        ]
      } finally {
        loading.value = false
      }
    })

    const submitComment = async () => {
      // 检查用户是否登录
      if (!userStore.isAuthenticated) {
        ElMessage.warning('请先登录后再进行评论')
        // 跳转到登录页面
        router.push({
          path: '/login',
          query: { redirect: route.path } // 记录重定向路径
        })
        return
      }
      
      if (!newComment.value.content.trim()) {
        ElMessage.warning('请输入评论内容')
        return
      }
      
      const authorName = userStore.currentUser.username
      const articleId = route.params.id
      try {
        // 构建评论数据
        const commentData = {
          articleId: articleId,
          content: newComment.value.content,
          author: authorName,
          articleTitle: article.value.title // 添加文章标题信息
        }
        
        const response = await createComment(commentData)
        
        // 添加新评论到列表，使用后端返回的创建时间
        const newCommentData = response.data || response;
        comments.value.push({
          id: newCommentData.id || Date.now(),
          author: authorName,
          content: newComment.value.content,
          time: newCommentData.createdAt ? new Date(newCommentData.createdAt).toLocaleString('zh-CN') : new Date().toLocaleString('zh-CN')
        })
        
        newComment.value.content = ''
        ElMessage.success('评论提交成功')
      } catch (error) {
        console.error('提交评论失败:', error)
        ElMessage.error('评论提交失败，请稍后重试')
      }
    }

    return {
      article,
      comments,
      loading,
      newComment,
      submitComment
    }
  }
}
</script>

<style scoped>
.article-detail-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.article-detail {
  padding: 30px;
  width: 100%;
  box-sizing: border-box;
}

.article-detail h1 {
  color: #333;
  margin-bottom: 20px;
}

.article-meta {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
}

.article-tags {
  margin-bottom: 20px;
}

.tag {
  display: inline-block;
  background: #f0f0f0;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  margin-right: 10px;
  color: #666;
}

.article-content {
  color: #333;
  line-height: 1.8;
  margin-bottom: 40px;
}

/* 代码块样式 */
.article-content pre {
  background-color: #f6f8fa;
  border-radius: 6px;
  padding: 16px;
  overflow: auto;
  margin: 16px 0;
}

.article-content code {
  background-color: rgba(175, 184, 193, 0.2);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 85%;
}

.article-content pre code {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  font-size: 100%;
}

/* 行内代码样式 */
.article-content p code {
  background-color: #f1f1f1;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.article-content h2, .article-content h3 {
  margin-top: 30px;
  margin-bottom: 15px;
}

.article-content p {
  margin-bottom: 15px;
}

.article-content ul, .article-content ol {
  margin-bottom: 15px;
  padding-left: 30px;
}

/* 移除列表项前面的小圆点 */
.article-content ul li {
  list-style-type: none !important;
}

/* 更强的选择器，确保移除所有列表项的小圆点 */
.article-content >>> ul li,
.article-content ::v-deep ul li,
.article-content ul li {
  list-style: none !important;
  list-style-type: none !important;
}

.comments-section {
  margin-top: 40px;
  border-top: 1px solid #eee;
  padding-top: 30px;
}

.comment-form {
  margin-bottom: 30px;
}

.comment-form textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
}

.submit-btn {
  margin-top: 10px;
  padding: 8px 20px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover {
  background: #66b1ff;
}

.comment-list {
  margin-top: 20px;
}

.comment-item {
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.comment-author {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.comment-time {
  font-weight: normal;
  color: #999;
  font-size: 12px;
  margin-left: 10px;
}

.comment-content {
  color: #666;
  line-height: 1.6;
}

.loading, .error {
  text-align: center;
  padding: 50px;
  color: #666;
}
</style>