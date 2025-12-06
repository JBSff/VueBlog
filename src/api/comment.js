import { useCommentStore } from '../stores/commentStore';

// 获取文章的评论列表
export const getArticleComments = async (articleId) => {
  const commentStore = useCommentStore();
  return await commentStore.fetchCommentsByArticle(articleId);
};

// 获取所有评论（管理后台）
export const getAllComments = async () => {
  const commentStore = useCommentStore();
  return await commentStore.fetchAllComments();
};

// 创建评论
export const createComment = async (commentData) => {
  const commentStore = useCommentStore();
  return await commentStore.createComment(
    commentData.articleId, 
    commentData.content, 
    commentData.author, 
    commentData.email
  );
};

// 批准评论
export const approveComment = async (id) => {
  const commentStore = useCommentStore();
  return await commentStore.approveComment(id);
};

// 删除评论
export const deleteComment = async (id) => {
  const commentStore = useCommentStore();
  return await commentStore.deleteComment(id);
};
