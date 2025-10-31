# ✅ 环境配置检查清单

使用此清单确保项目配置正确，避免启动错误。

---

## 📋 配置前检查

### 系统要求
- [ ] Node.js >= 18.0.0（运行 `node -v` 检查）
- [ ] npm 或 yarn 已安装
- [ ] Git 已安装（用于克隆项目）

---

## 🔧 配置步骤检查

### 第 1 步：项目安装
- [ ] 已克隆项目到本地
- [ ] 已进入项目目录 `cd anti-fake-news`
- [ ] 已运行 `npm install` 安装依赖
- [ ] 安装成功，无错误提示

### 第 2 步：环境变量文件
- [ ] 已创建 `.env.development` 文件（从 `.env.example` 复制）
- [ ] `.env.development` 文件位于项目根目录
- [ ] 文件编码为 UTF-8

### 第 3 步：后端 API 配置
- [ ] 已设置 `VITE_API_BASE_URL`
- [ ] 后端地址格式正确（以 `http://` 或 `https://` 开头）
- [ ] 后端服务已启动（或使用 JSON Server）
- [ ] 可以在浏览器访问后端地址

### 第 4 步：Firebase 配置（8 个必需变量）
- [ ] `VITE_FIREBASE_API_KEY` 已填写（不包含 `your-api-key-here`）
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` 已填写（格式：`xxx.firebaseapp.com`）
- [ ] `VITE_FIREBASE_PROJECT_ID` 已填写（不包含 `your-project-id`）
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` 已填写（格式：`xxx.firebasestorage.app`）
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` 已填写（纯数字）
- [ ] `VITE_FIREBASE_APP_ID` 已填写（格式：`1:xxx:web:xxx`）
- [ ] `VITE_FIREBASE_MEASUREMENT_ID` 已填写（格式：`G-XXXXXXXXXX`）
- [ ] 所有 Firebase 配置来自同一个 Firebase 项目

### 第 5 步：验证配置
- [ ] 已运行 `npm run check:env`
- [ ] 验证脚本显示 ✅ 配置检查通过
- [ ] 没有红色错误提示

---

## 🚀 启动检查

### 开发服务器
- [ ] 运行 `npm run dev` 成功
- [ ] 终端显示 `VITE v7.x.x  ready in xxx ms`
- [ ] 显示本地地址：`Local: http://localhost:5173/`
- [ ] 浏览器自动打开或手动访问成功
- [ ] 页面正常显示，无白屏或空白

### 功能测试
- [ ] 导航栏正常显示
- [ ] 可以访问新闻列表页面
- [ ] 可以打开注册/登录页面
- [ ] 控制台无 Firebase 配置错误
- [ ] 控制台无 API 连接错误（如果后端未启动，此项可能有警告）

---

## ⚠️ 常见问题排查

### 问题：`npm install` 失败

**检查项**：
- [ ] Node.js 版本 >= 18
- [ ] 网络连接正常
- [ ] 尝试清除缓存：`npm cache clean --force`
- [ ] 删除 `node_modules` 和 `package-lock.json`，重新安装

### 问题：Firebase 配置错误

**检查项**：
- [ ] `.env.development` 文件存在
- [ ] 所有 Firebase 变量都已填写
- [ ] 变量值不包含占位符（`your-xxx-here`）
- [ ] 变量名拼写正确（区分大小写）
- [ ] 重启开发服务器（`Ctrl+C` 后 `npm run dev`）

### 问题：API 请求失败

**检查项**：
- [ ] `VITE_API_BASE_URL` 配置正确
- [ ] 后端服务已启动
- [ ] 后端地址可以在浏览器访问
- [ ] 检查控制台 Network 标签页的错误信息
- [ ] 尝试使用 JSON Server：`npm run api`

### 问题：页面空白或白屏

**检查项**：
- [ ] 浏览器控制台是否有错误信息
- [ ] 检查是否有 JavaScript 错误
- [ ] 清除浏览器缓存
- [ ] 尝试无痕模式打开
- [ ] 检查浏览器版本是否过旧

---

## 🎯 全部完成标志

当你看到以下所有标志时，配置完成：

✅ `npm run check:env` 显示通过
✅ `npm run dev` 启动成功
✅ 浏览器显示页面
✅ 控制台无致命错误
✅ 可以导航到不同页面

---

## 📞 仍然遇到问题？

如果完成以上所有检查项仍无法启动，请：

1. 📖 查看详细文档：
   - [ENV_SETUP.md](./ENV_SETUP.md) - 环境变量配置详解
   - [QUICKSTART.md](./QUICKSTART.md) - 快速启动指南
   - [README.md](./README.md) - 完整项目文档

2. 🔍 收集错误信息：
   - 终端的完整错误日志
   - 浏览器控制台的错误信息
   - `.env.development` 配置（隐藏敏感信息）

3. 💬 寻求帮助：
   - 联系项目负责人
   - 在团队频道提问
   - 提交 GitHub Issue

---

**检查完成日期**：_____________

**检查人**：_____________

**备注**：_____________
