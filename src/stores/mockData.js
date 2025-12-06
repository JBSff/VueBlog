// 模拟数据

// 模拟用户数据
export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin', // 实际项目中应该使用加密密码
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    id: 2,
    username: '123',
    password: '123456', // 实际项目中应该使用加密密码
    email: '123@example.com',
    role: 'user'
  }
];

// 模拟文章数据
export const mockArticles = [
  {
    id: 1,
    title: 'Vue 3 组合式 API 入门指南',
    content: '# Vue 3 组合式 API 入门指南\n\nVue 3 引入了组合式 API，这是一种新的 API 风格，它允许我们以更灵活的方式组织组件逻辑。\n\n## 什么是组合式 API？\n\n组合式 API 提供了一组函数，使我们能够更好地组织和重用组件逻辑。它是基于函数的 API，而不是基于对象的 API。\n\n## 基本用法\n\n使用组合式 API，我们需要在 `setup()` 函数中编写组件逻辑。\n\n```js\nimport { ref, computed } from \'vue\'\n\nexport default {\n  setup() {\n    const count = ref(0)\n    const doubleCount = computed(() => count.value * 2)\n    \n    function increment() {\n      count.value++\n    }\n    \n    return { count, doubleCount, increment }\n  }\n}\n```',
    summary: 'Vue 3 引入了组合式 API，这是一种新的 API 风格，它允许我们以更灵活的方式组织组件逻辑。',
    categoryId: 1,
    tagIds: [1, 2],
    author: 'admin',
    viewCount: 1234,
    createTime: '2023-01-15T08:30:00Z',
    updateTime: '2023-01-15T08:30:00Z',
    status: 'published'
  },
  {
    id: 2,
    title: 'Pinia 状态管理完全指南',
    content: '# Pinia 状态管理完全指南\n\nPinia 是 Vue 官方推荐的状态管理库，它是 Vuex 的替代品，提供了更简洁的 API 和更好的 TypeScript 支持。\n\n## 为什么选择 Pinia？\n\n- 更简单的 API\n- 更好的 TypeScript 支持\n- 模块化设计\n- 无 mutations\n\n## 基本用法\n\n```js\nimport { defineStore } from \'pinia\'\n\nexport const useCounterStore = defineStore(\'counter\', {\n  state: () => ({ count: 0 }),\n  getters: {\n    doubleCount: (state) => state.count * 2\n  },\n  actions: {\n    increment() {\n      this.count++\n    }\n  }\n})\n```',
    summary: 'Pinia 是 Vue 官方推荐的状态管理库，它是 Vuex 的替代品，提供了更简洁的 API 和更好的 TypeScript 支持。',
    categoryId: 1,
    tagIds: [1, 3],
    author: 'admin',
    viewCount: 876,
    createTime: '2023-01-10T10:20:00Z',
    updateTime: '2023-01-10T10:20:00Z',
    status: 'published'
  },
  {
    id: 3,
    title: 'Element Plus UI 组件库使用教程',
    content: '# Element Plus UI 组件库使用教程\n\nElement Plus 是一个基于 Vue 3 的桌面端组件库，它提供了丰富的组件，用于构建美观的用户界面。\n\n## 安装\n\n```bash\nnpm install element-plus\n```\n\n## 基本用法\n\n```js\nimport { createApp } from \'vue\'\nimport ElementPlus from \'element-plus\'\nimport \'element-plus/dist/index.css\'\nimport App from \'./App.vue\'\n\nconst app = createApp(App)\napp.use(ElementPlus)\napp.mount(\'#app\')\n```',
    summary: 'Element Plus 是一个基于 Vue 3 的桌面端组件库，它提供了丰富的组件，用于构建美观的用户界面。',
    categoryId: 2,
    tagIds: [2, 4],
    author: 'admin',
    viewCount: 543,
    createTime: '2023-01-05T14:10:00Z',
    updateTime: '2023-01-05T14:10:00Z',
    status: 'published'
  }
];

// 模拟分类数据
export const mockCategories = [
  {
    id: 1,
    name: '前端开发',
    description: '前端开发相关技术，包括HTML、CSS、JavaScript、Vue、React等框架和库的使用和最佳实践。',
    createTime: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'UI/UX',
    description: '用户界面设计和用户体验相关内容，包括设计原则、工具使用、交互设计等。',
    createTime: '2023-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: '后端开发',
    description: '后端开发技术，包括服务器端语言、数据库、API设计、架构模式等内容。',
    createTime: '2023-01-01T00:00:00Z'
  }
];

// 模拟标签数据
export const mockTags = [
  {
    id: 1,
    name: 'Vue',
    createTime: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'JavaScript',
    createTime: '2023-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: '状态管理',
    createTime: '2023-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'UI组件',
    createTime: '2023-01-01T00:00:00Z'
  }
];

// 模拟评论数据
export const mockComments = [
  {
    id: 1,
    articleId: 1,
    content: '这篇文章写得真好，对我很有帮助！',
    author: 'user1',
    email: 'user1@example.com',
    createTime: '2023-01-16T09:45:00Z',
    status: 'approved'
  },
  {
    id: 2,
    articleId: 1,
    content: '感谢分享，学习了很多新知识。',
    author: 'user2',
    email: 'user2@example.com',
    createTime: '2023-01-17T11:20:00Z',
    status: 'approved'
  },
  {
    id: 3,
    articleId: 2,
    content: 'Pinia确实比Vuex简单多了！',
    author: 'user3',
    email: 'user3@example.com',
    createTime: '2023-01-12T15:30:00Z',
    status: 'approved'
  }
];
