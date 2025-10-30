# 🚀 部署指南 Firebase Hosting

## ✅ 已完成的配置

1. **Firebase SDK 已集成**
   - 配置文件：`src/config/firebase.ts`
   - 自动在 `main.ts` 中初始化

2. **Firebase 配置文件已更新**
   - `firebase.json` - 仅使用 Hosting（无需付费）
   - `.firebaserc` - 项目 ID: se331project

## 📝 部署步骤

### 1. 构建项目
```bash
npm run build
```

### 2. 部署到 Firebase Hosting
```bash
firebase deploy --only hosting
```

或使用快捷命令：
```bash
npm run deploy
```

### 3. 查看部署结果
部署成功后，您将看到类似输出：
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/se331project/overview
Hosting URL: https://se331project.web.app
```

## ⚠️ 常见问题

### 问题 1: "Error: To provision a CloudSQL Postgres instance..."
**原因：** 之前配置了 Data Connect（需要付费）

**解决方案：** 
已修复！现在 `firebase.json` 只包含 Hosting 配置，无需升级到 Blaze 计划。

### 问题 2: Firebase CLI 未登录
```bash
firebase login
```

### 问题 3: 构建失败
确保所有依赖已安装：
```bash
npm install
```

## 📦 部署检查清单

- [x] Firebase SDK 已安装 (`firebase` 包在 package.json)
- [x] Firebase 配置文件已创建 (`src/config/firebase.ts`)
- [x] `firebase.json` 配置正确（仅 Hosting）
- [x] `.firebaserc` 项目 ID 正确
- [ ] 运行 `npm run build` 确保构建成功
- [ ] 运行 `firebase deploy --only hosting` 部署

## 🔗 有用的链接

- Firebase Console: https://console.firebase.google.com/project/se331project
- 部署后的网站: https://se331project.web.app (部署后可用)
