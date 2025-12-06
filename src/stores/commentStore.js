import { defineStore } from 'pinia';
import { mockComments } from './mockData';
import StorageUtil from '../utils/storage';

// 存储键名
const COMMENTS_STORAGE_KEY = 'blog_comments';

export const useCommentStore = defineStore('comment', {
  state: () => ({
    // 从localStorage获取评论数据，如果没有则使用mock数据
    comments: StorageUtil.getData(COMMENTS_STORAGE_KEY, [...mockComments]),
    loading: false,
    error: null
  }),

  getters: {
    // 根据文章ID获取已批准的评论
    getApprovedCommentsByArticle: (state) => (articleId) =>
      state.comments
        .filter(comment => comment.articleId === parseInt(articleId) && comment.status === 'approved')
        .sort((a, b) => new Date(a.createTime) - new Date(b.createTime)),
    
    // 获取所有评论（管理后台用）
    allComments: (state) =>
      state.comments.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
  },

  actions: {
    // 保存评论数据到localStorage
    saveCommentsToStorage() {
      StorageUtil.saveData(COMMENTS_STORAGE_KEY, this.comments);
    },

    // 获取文章的评论
    async fetchCommentsByArticle(articleId) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const comments = this.getApprovedCommentsByArticle(articleId);
        return comments;
      } catch (error) {
        this.error = error.message;
        return [];
      } finally {
        this.loading = false;
      }
    },

    // 获取所有评论（管理后台）
    async fetchAllComments() {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return this.allComments;
      } catch (error) {
        this.error = error.message;
        return [];
      } finally {
        this.loading = false;
      }
    },

    // 创建评论
    async createComment(articleId, content, author, email) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newComment = {
          id: Date.now(),
          articleId: parseInt(articleId),
          content,
          author,
          email,
          createTime: new Date().toISOString(),
          status: 'approved' // 模拟自动批准，实际项目中可能需要审核
        };
        
        this.comments.unshift(newComment);
        this.saveCommentsToStorage(); // 保存到localStorage
        return newComment;
      } catch (error) {
        this.error = error.message;
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 批准评论
    async approveComment(id) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const comment = this.comments.find(c => c.id === parseInt(id));
        
        if (!comment) {
          throw new Error('评论不存在');
        }
        
        comment.status = 'approved';
        this.saveCommentsToStorage(); // 保存到localStorage
        return comment;
      } catch (error) {
        this.error = error.message;
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 删除评论
    async deleteComment(id) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const index = this.comments.findIndex(c => c.id === parseInt(id));
        
        if (index === -1) {
          throw new Error('评论不存在');
        }
        
        this.comments.splice(index, 1);
        this.saveCommentsToStorage(); // 保存到localStorage
        return true;
      } catch (error) {
        this.error = error.message;
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
});
