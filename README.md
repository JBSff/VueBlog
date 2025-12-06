# v1.3 更新内容

相对于 v1.2 版本，本项目包含以下更新：

## 1. GitHub Pages 部署支持
- `vite.config.js` 根据构建模式动态设置 `base`，生产环境会输出 `/VueBlog/` 路径，匹配 GitHub Pages 项目站点。
- `package.json` 新增 `deploy` 脚本：

```bash
npm run deploy
```

该脚本会执行 `vite build`，并通过 `gh-pages` 将 `dist` 目录推送到 `gh-pages` 分支。

## 2. 尝试对用户权限持久化修复
- 依旧存在问题，为管理账户单独添加了后台入口来暂时解决问题
