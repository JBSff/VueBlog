import { useCategoryStore } from '../stores/categoryStore';

// 获取分类列表
export const getCategories = async () => {
  const categoryStore = useCategoryStore();
  // 初始化分类，将旧的时间戳ID转换为顺序ID
  try {
    if (typeof categoryStore.initCategories === 'function') {
      categoryStore.initCategories();
    }
  } catch (error) {
    console.error('初始化分类ID失败:', error);
  }
  return await categoryStore.fetchCategories();
};

// 获取单个分类
export const getCategory = async (id) => {
  const categoryStore = useCategoryStore();
  return await categoryStore.fetchCategory(id);
};

// 创建分类
export const createCategory = async (categoryData) => {
  const categoryStore = useCategoryStore();
  return await categoryStore.createCategory(categoryData.name, categoryData.description);
};

// 更新分类
export const updateCategory = async (id, categoryData) => {
  const categoryStore = useCategoryStore();
  return await categoryStore.updateCategory(id, categoryData.name, categoryData.description);
};

// 删除分类
export const deleteCategory = async (id) => {
  const categoryStore = useCategoryStore();
  return await categoryStore.deleteCategory(id);
};
