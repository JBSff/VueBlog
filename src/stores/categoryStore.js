import { defineStore } from 'pinia';
import { mockCategories } from './mockData';
import StorageUtil from '../utils/storage';

// 存储键名
const CATEGORIES_STORAGE_KEY = 'blog_categories';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    // 从localStorage获取分类数据，如果没有则使用mock数据
    categories: StorageUtil.getData(CATEGORIES_STORAGE_KEY, [...mockCategories]),
    loading: false,
    error: null
  }),

  getters: {
    // 获取所有分类
    allCategories: (state) => 
      state.categories.sort((a, b) => a.id - b.id)
  },

  actions: {
    // 保存分类数据到localStorage
    saveCategoriesToStorage() {
      StorageUtil.saveData(CATEGORIES_STORAGE_KEY, this.categories);
    },

    // 获取分类列表
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 200));
        
        return this.categories;
      } catch (error) {
        this.error = error.message;
        return [];
      } finally {
        this.loading = false;
      }
    },

    // 获取单个分类
    async fetchCategory(id) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const category = this.categories.find(c => c.id === parseInt(id));
        
        if (!category) {
          throw new Error('分类不存在');
        }
        
        return category;
      } catch (error) {
        this.error = error.message;
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 创建分类
    async createCategory(name) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 检查分类名是否已存在
        if (this.categories.some(c => c.name === name)) {
          throw new Error('分类名已存在');
        }
        
        const newCategory = {
          id: Date.now(),
          name,
          createTime: new Date().toISOString()
        };
        
        this.categories.push(newCategory);
        this.saveCategoriesToStorage(); // 保存到localStorage
        return newCategory;
      } catch (error) {
        this.error = error.message;
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 更新分类
    async updateCategory(id, name) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const index = this.categories.findIndex(c => c.id === parseInt(id));
        
        if (index === -1) {
          throw new Error('分类不存在');
        }
        
        // 检查新名称是否与其他分类重复
        if (this.categories.some((c, i) => i !== index && c.name === name)) {
          throw new Error('分类名已存在');
        }
        
        this.categories[index].name = name;
        this.saveCategoriesToStorage(); // 保存到localStorage
        return this.categories[index];
      } catch (error) {
        this.error = error.message;
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 删除分类
    async deleteCategory(id) {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const index = this.categories.findIndex(c => c.id === parseInt(id));
        
        if (index === -1) {
          throw new Error('分类不存在');
        }
        
        this.categories.splice(index, 1);
        this.saveCategoriesToStorage(); // 保存到localStorage
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
