import { defineStore } from 'pinia';
import { mockArticles } from './mockData';
import StorageUtil from '../utils/storage';

// 存储键名
const ARTICLES_STORAGE_KEY = 'blog_articles';

export const useArticleStore = defineStore('article', {
  state: () => ({
    // 从localStorage获取文章数据，如果没有则使用mock数据
    articles: StorageUtil.getData(ARTICLES_STORAGE_KEY, [...mockArticles]),
    currentArticle: null,
    loading: false,
    error: null
  }),

  getters: {
    // 获取已发布的文章列表
    publishedArticles: (state) => 
      state.articles.filter(article => article.status === 'published')
        .sort((a, b) => new Date(b.createTime) - new Date(a.createTime)),
    
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
    // 保存文章数据到localStorage
    saveArticlesToStorage() {
      StorageUtil.saveData(ARTICLES_STORAGE_KEY, this.articles);
    },
    
    // 从localStorage重新加载文章数据
    reloadArticles() {
      this.articles = StorageUtil.getData(ARTICLES_STORAGE_KEY, [...mockArticles]);
    },

    // 获取文章列表
    async fetchArticles() {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 重新从localStorage加载数据，确保获取最新的文章
        this.reloadArticles();
        
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
        
        // 重新从localStorage加载数据，确保获取最新的文章
        this.reloadArticles();
        
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
    async createArticle(articleData) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newArticle = {
          id: Date.now(),
          ...articleData,
          author: 'admin',
          viewCount: 0,
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
          status: 'published' // 默认设置为已发布状态
        };
        
        this.articles.unshift(newArticle);
        this.saveArticlesToStorage(); // 保存到localStorage
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
        
        this.saveArticlesToStorage(); // 保存到localStorage
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
        this.saveArticlesToStorage(); // 保存到localStorage
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
          this.saveArticlesToStorage(); // 保存到localStorage
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
