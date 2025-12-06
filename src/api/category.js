import { useCategoryStore } from '../stores/categoryStore';

// 获取分类列表
export const getCategories = async () => {
  const categoryStore = useCategoryStore();
  return await categoryStore.fetchCategories();
};

// 获取单个分类
export const getCategory = async (id) => {
  const categoryStore = useCategoryStore();
  return await categoryStore.fetchCategory(id);
};

// 创建分类
export const createCategory = async (name) => {
  const categoryStore = useCategoryStore();
  return await categoryStore.createCategory(name);
};

// 更新分类
export const updateCategory = async (id, name) => {
  const categoryStore = useCategoryStore();
  return await categoryStore.updateCategory(id, name);
};

// 删除分类
export const deleteCategory = async (id) => {
  const categoryStore = useCategoryStore();
  return await categoryStore.deleteCategory(id);
};
