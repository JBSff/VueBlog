import { defineStore } from 'pinia';
import { mockTags } from './mockData';
import StorageUtil from '../utils/storage';

// 存储键名
const TAGS_STORAGE_KEY = 'blog_tags';

export const useTagStore = defineStore('tag', {
  state: () => ({
    // 从localStorage获取标签数据，如果没有则使用mock数据
    tags: StorageUtil.getData(TAGS_STORAGE_KEY, [...mockTags]),
    loading: false,
    error: null
  }),

  getters: {
    // 获取所有标签
    allTags: (state) => 
      state.tags.sort((a, b) => a.id - b.id)
  },

  actions: {
    // 初始化函数，将旧的时间戳ID转换为顺序ID
    initTags() {
      // 检查是否需要转换ID
      const needsConversion = this.tags.some(tag => tag.id > 1000000000000); // 大于2001年1月1日的时间戳
      
      if (needsConversion) {
        // 将标签按创建时间排序
        const sortedTags = this.tags.sort((a, b) => new Date(a.createTime) - new Date(b.createTime));
        
        // 重新分配顺序ID
        sortedTags.forEach((tag, index) => {
          tag.id = index + 1;
        });
        
        // 更新状态并保存到localStorage
        this.tags = sortedTags;
        this.saveTagsToStorage();
      }
    },
    // 保存标签数据到localStorage
    saveTagsToStorage() {
      StorageUtil.saveData(TAGS_STORAGE_KEY, this.tags);
    },

    // 获取标签列表
    async fetchTags() {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 200));
        
        return this.tags;
      } catch (error) {
        this.error = error.message;
        return [];
      } finally {
        this.loading = false;
      }
    },

    // 获取单个标签
    async fetchTag(id) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const tag = this.tags.find(t => t.id === parseInt(id));
        
        if (!tag) {
          throw new Error('标签不存在');
        }
        
        return tag;
      } catch (error) {
        this.error = error.message;
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 创建标签
    async createTag(name) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 检查标签名是否已存在
        if (this.tags.some(t => t.name === name)) {
          throw new Error('标签名已存在');
        }
        
        // 计算新标签ID，基于当前最大ID + 1
        const maxId = this.tags.length > 0 ? Math.max(...this.tags.map(t => t.id)) : 0;
        const newId = maxId + 1;
        
        const newTag = {
          id: newId,
          name,
          createTime: new Date().toISOString()
        };
        
        this.tags.push(newTag);
        this.saveTagsToStorage(); // 保存到localStorage
        return newTag;
      } catch (error) {
        this.error = error.message;
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 更新标签
    async updateTag(id, name) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const index = this.tags.findIndex(t => t.id === parseInt(id));
        
        if (index === -1) {
          throw new Error('标签不存在');
        }
        
        // 检查新名称是否与其他标签重复
        if (this.tags.some((t, i) => i !== index && t.name === name)) {
          throw new Error('标签名已存在');
        }
        
        this.tags[index].name = name;
        this.saveTagsToStorage(); // 保存到localStorage
        return this.tags[index];
      } catch (error) {
        this.error = error.message;
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 删除标签
    async deleteTag(id) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const index = this.tags.findIndex(t => t.id === parseInt(id));
        
        if (index === -1) {
          throw new Error('标签不存在');
        }
        
        this.tags.splice(index, 1);
        this.saveTagsToStorage(); // 保存到localStorage
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
