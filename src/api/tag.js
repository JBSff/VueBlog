import { useTagStore } from '../stores/tagStore';

// 获取标签列表
export const getTags = async () => {
  const tagStore = useTagStore();
  return await tagStore.fetchTags();
};

// 获取单个标签
export const getTag = async (id) => {
  const tagStore = useTagStore();
  return await tagStore.fetchTag(id);
};

// 创建标签
export const createTag = async (name) => {
  const tagStore = useTagStore();
  return await tagStore.createTag(name);
};

// 更新标签
export const updateTag = async (id, name) => {
  const tagStore = useTagStore();
  return await tagStore.updateTag(id, name);
};

// 删除标签
export const deleteTag = async (id) => {
  const tagStore = useTagStore();
  return await tagStore.deleteTag(id);
};
