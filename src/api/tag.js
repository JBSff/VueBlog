import { useTagStore } from '../stores/tagStore';

// 获取标签列表
export const getTags = async () => {
  const tagStore = useTagStore();
  // 初始化标签，将旧的时间戳ID转换为顺序ID
  try {
    if (typeof tagStore.initTags === 'function') {
      tagStore.initTags();
    }
  } catch (error) {
    console.error('初始化标签ID失败:', error);
  }
  return await tagStore.fetchTags();
};

// 获取单个标签
export const getTag = async (id) => {
  const tagStore = useTagStore();
  return await tagStore.fetchTag(id);
};

// 创建标签
export const createTag = async (tagData) => {
  const tagStore = useTagStore();
  return await tagStore.createTag(tagData.name);
};

// 更新标签
export const updateTag = async (id, tagData) => {
  const tagStore = useTagStore();
  return await tagStore.updateTag(id, tagData.name);
};

// 删除标签
export const deleteTag = async (id) => {
  const tagStore = useTagStore();
  return await tagStore.deleteTag(id);
};
