import { defineStore } from 'pinia';
import { mockArticles } from './mockData';

export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: [...mockArticles],
    currentArticle: null,
    loading: false,
    error: null
  }),
  persist: true,

  getters: {
    // 获取已发布的文章列表，按id从小到大排序
    publishedArticles: (state) => 
      state.articles.filter(article => article.status === 'published')
        .sort((a, b) => a.id - b.id),
    
    // 根据分类获取文章
    getArticlesByCategory: (state) => (categoryId) =>
      state.articles.filter(article => article.categoryId === categoryId && article.status === 'published'),
    
    // 根据标签获取文章
    getArticlesByTag: (state) => (tagId) =>
      state.articles.filter(article => 
        article.tagIds.includes(tagId) && article.status === 'published'
      )
  },

  actions: {
    // 初始化函数，将旧的时间戳ID转换为顺序ID
    initArticles() {
      // 检查是否需要转换ID
      const needsConversion = this.articles.some(article => article.id > 1000000000000); // 大于2001年1月1日的时间戳
      
      if (needsConversion) {
        // 将文章按创建时间排序
        const sortedArticles = this.articles.sort((a, b) => new Date(a.createTime) - new Date(b.createTime));
        
        // 重新分配顺序ID
        sortedArticles.forEach((article, index) => {
          article.id = index + 1;
        });
        
        // 更新状态并保存到localStorage
        this.articles = sortedArticles;
      }
    },

    // 获取文章列表
    async fetchArticles() {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return this.articles;
      } catch (error) {
        this.error = error.message;
        return [];
      } finally {
        this.loading = false;
      }
    },

    // 获取单篇文章
    async fetchArticle(id) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const article = this.articles.find(a => a.id === parseInt(id));
        
        if (!article) {
          throw new Error('文章不存在');
        }
        
        this.currentArticle = article;
        
        // 增加浏览次数
        if (article.status === 'published') {
          article.viewCount++;
        }
        
        return article;
      } catch (error) {
        this.error = error.message;
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 创建文章
    async createArticle(articleData, author) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 计算新文章ID，基于当前最大ID + 1
        const maxId = this.articles.length > 0 ? Math.max(...this.articles.map(a => a.id)) : 0;
        const newId = maxId + 1;
        
        const newArticle = {
          id: newId,
          ...articleData,
          author: author || 'admin', // 使用传入的作者，默认为admin
          viewCount: 0,
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
          status: 'published' // 默认设置为已发布状态
        };
        
        this.articles.unshift(newArticle);
        return newArticle;
      } catch (error) {
        this.error = error.message;
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 更新文章
    async updateArticle(id, articleData) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const index = this.articles.findIndex(a => a.id === parseInt(id));
        
        if (index === -1) {
          throw new Error('文章不存在');
        }
        
        this.articles[index] = {
          ...this.articles[index],
          ...articleData,
          updateTime: new Date().toISOString()
        };
        
        return this.articles[index];
      } catch (error) {
        this.error = error.message;
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 删除文章
    async deleteArticle(id) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const index = this.articles.findIndex(a => a.id === parseInt(id));
        
        if (index === -1) {
          throw new Error('文章不存在');
        }
        
        this.articles.splice(index, 1);
        return true;
      } catch (error) {
        this.error = error.message;
        return false;
      } finally {
        this.loading = false;
      }
    },

    // 更新文章浏览量
    async updateArticleViews(id) {
      try {
        const article = this.articles.find(a => a.id === parseInt(id));
        
        if (article) {
          article.viewCount++;
          return true;
        }
        
        return false;
      } catch (error) {
        this.error = error.message;
        return false;
      }
    }
  }
});
