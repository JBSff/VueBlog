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
        this.saveArticlesToStorage();
      }
    },
    // 保存文章数据到localStorage
    saveArticlesToStorage() {
      StorageUtil.saveData(ARTICLES_STORAGE_KEY, this.articles);
    },
    
    // 从localStorage重新加载文章数据
    reloadArticles() {
      this.articles = StorageUtil.getData(ARTICLES_STORAGE_KEY, [...mockArticles]);
      // 确保所有文章都有viewCount字段
      this.articles = this.articles.map(article => ({
        ...article,
        viewCount: article.viewCount || 0
      }));
      // 保存更新后的数据回localStorage
      this.saveArticlesToStorage();
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
