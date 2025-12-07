import { defineStore } from 'pinia';
import { mockCategories } from './mockData';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [...mockCategories],
    loading: false,
    error: null
  }),
  persist: true,

  getters: {
    // 获取所有分类
    allCategories: (state) => 
      state.categories.sort((a, b) => a.id - b.id)
  },

  actions: {
    // 初始化函数，将旧的时间戳ID转换为顺序ID
    initCategories() {
      // 检查是否需要转换ID
      const needsConversion = this.categories.some(category => category.id > 1000000000000); // 大于2001年1月1日的时间戳
      
      if (needsConversion) {
        // 将分类按创建时间排序
        const sortedCategories = this.categories.sort((a, b) => new Date(a.createTime) - new Date(b.createTime));
        
        // 重新分配顺序ID
        sortedCategories.forEach((category, index) => {
          category.id = index + 1;
        });
        
        // 更新状态并保存到localStorage
        this.categories = sortedCategories;
      }
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
    async createCategory(name, description = '') {
      this.loading = true;
      this.error = null;
      
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 检查分类名是否已存在
        if (this.categories.some(c => c.name === name)) {
          throw new Error('分类名已存在');
        }
        
        // 计算新分类ID，基于当前最大ID + 1
        const maxId = this.categories.length > 0 ? Math.max(...this.categories.map(c => c.id)) : 0;
        const newId = maxId + 1;
        
        const newCategory = {
          id: newId,
          name,
          description,
          createTime: new Date().toISOString()
        };
        
        this.categories.push(newCategory);
        return newCategory;
      } catch (error) {
        this.error = error.message;
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 更新分类
    async updateCategory(id, name, description = '') {
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
        this.categories[index].description = description;
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
