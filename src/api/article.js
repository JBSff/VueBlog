import { useArticleStore } from '../stores/articleStore';

// 获取文章列表
export const getArticles = async (params = {}) => {
  const articleStore = useArticleStore();
  const articles = await articleStore.fetchArticles();
  
  // 处理查询参数
  let filteredArticles = [...articles];
  
  // 根据分类筛选
  if (params.categoryId) {
    filteredArticles = filteredArticles.filter(a => a.categoryId === parseInt(params.categoryId));
  }
  
  // 根据标签筛选
  if (params.tagId) {
    filteredArticles = filteredArticles.filter(a => a.tagIds.includes(parseInt(params.tagId)));
  }
  
  // 根据状态筛选
  if (params.status) {
    filteredArticles = filteredArticles.filter(a => a.status === params.status);
  } else if (!params.includeAllStatuses) {
    // 默认只返回已发布的文章
    filteredArticles = filteredArticles.filter(a => a.status === 'published');
  }
  
  // 排序
  filteredArticles.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
  
  // 分页
  const page = parseInt(params.page) || 1;
  const pageSize = parseInt(params.pageSize) || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    data: filteredArticles.slice(start, end),
    total: filteredArticles.length,
    page,
    pageSize
  };
};

// 获取单篇文章
export const getArticle = async (id) => {
  const articleStore = useArticleStore();
  return await articleStore.fetchArticle(id);
};

// 创建文章
export const createArticle = async (articleData) => {
  const articleStore = useArticleStore();
  return await articleStore.createArticle(articleData);
};

// 更新文章
export const updateArticle = async (id, articleData) => {
  const articleStore = useArticleStore();
  return await articleStore.updateArticle(id, articleData);
};

// 删除文章
export const deleteArticle = async (id) => {
  const articleStore = useArticleStore();
  return await articleStore.deleteArticle(id);
};

// 更新文章浏览量
export const updateArticleViews = async (id) => {
  const articleStore = useArticleStore();
  return await articleStore.updateArticleViews(id);
};
