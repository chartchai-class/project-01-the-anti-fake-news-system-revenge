# 🛡️ Anti-Fake News System - 前端项目

反假新闻系统的 Vue 3 前端应用，支持新闻浏览、投票、评论等功能。

---

## ⚠️ **首次使用必读**

> **� 重要**：首次运行项目前，必须配置环境变量！
>
> 📖 **详细配置说明**：[ENV_SETUP.md](./ENV_SETUP.md) ← **请先阅读此文档**
>
> 🚀 **5分钟快速启动**：[QUICKSTART.md](./QUICKSTART.md)

### 最简启动流程

```bash
# 1. 安装依赖
npm install

# 2. 创建环境配置文件
cp .env.example .env.development  # macOS/Linux
copy .env.example .env.development  # Windows

# 3. 编辑 .env.development，填写 Firebase 配置
# 详见 ENV_SETUP.md

# 4. 验证配置
npm run check:env

# 5. 启动项目
npm run dev
```

---

## �📋 **目录**

- [首次使用必读](#首次使用必读)
- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [项目启动](#项目启动)
- [配置文件说明](#配置文件说明)
- [常见问题](#常见问题)

---

## 🚀 **快速开始**

### 1️⃣ **克隆项目后的第一步**

```bash
# 进入项目目录
cd anti-fake-news

# 安装依赖
npm install
```

### 2️⃣ **配置环境变量（必需）**

```bash
# 复制环境变量模板
cp .env.example .env.development
```

然后编辑 `.env.development` 文件，填写配置。

### 3️⃣ **启动开发服务器**

```bash
npm run dev
```

访问：http://localhost:5173

---

## ⚙️ **环境配置**

### 📌 **影响前端启动的关键配置文件**

| 文件 | 用途 | 是否必需 | 说明 |
|-----|------|---------|------|
| `.env.development` | 开发环境变量 | ✅ 必需 | 包含后端 API 地址和 Firebase 配置 |
| `.env.production` | 生产环境变量 | ⚠️ 部署时必需 | 生产环境的配置 |
| `.env.example` | 环境变量模板 | ✅ 必需 | 供团队成员复制使用 |
| `package.json` | 项目依赖 | ✅ 必需 | NPM 包管理 |
| `vite.config.ts` | Vite 配置 | ✅ 必需 | 构建工具配置 |
| `tsconfig.json` | TypeScript 配置 | ✅ 必需 | TS 编译选项 |
| `firebase.json` | Firebase 部署配置 | ⚠️ 部署时必需 | 用于 Firebase Hosting |
| `vercel.json` | Vercel 部署配置 | ⚠️ 部署时必需 | 用于 Vercel 部署 |

---

## 🔧 **环境变量详细说明**

### ✅ **必需的环境变量**

创建 `.env.development` 文件（从 `.env.example` 复制），配置以下变量：

#### 1. 后端 API 地址（必需）

```bash
# 开发环境：本地后端
VITE_API_BASE_URL=http://localhost:8080

# 如果后端部署在其他地址，修改为实际 URL
# VITE_API_BASE_URL=https://your-backend.herokuapp.com
```

#### 2. Firebase 配置（必需）

从 [Firebase Console](https://console.firebase.google.com/) 获取配置：

```bash
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**获取方式：**
1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 选择项目 → 项目设置 ⚙️
3. 滚动到 "您的应用" → Web 应用
4. 复制配置信息

---

## 🎯 **项目启动流程**

### 开发模式（推荐）

```bash
# 方式 1：只启动前端（需要后端已运行）
npm run dev

# 方式 2：同时生成模拟数据 + 启动 JSON Server + 前端
npm run start:all
```

### 生产构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 部署到 Firebase

```bash
# 构建 + 部署到 Firebase Hosting
npm run deploy
```

---

## 📂 **项目结构**

```
anti-fake-news/
├── .env.example              # 环境变量模板（提交到 Git）
├── .env.development          # 开发环境配置（不提交）
├── .env.production           # 生产环境配置（不提交）
├── .gitignore                # Git 忽略文件
├── package.json              # 项目依赖
├── vite.config.ts            # Vite 配置
├── tsconfig.json             # TypeScript 配置
├── firebase.json             # Firebase 部署配置
├── vercel.json               # Vercel 部署配置
├── README.md                 # 本文件
├── public/                   # 静态资源
├── src/
│   ├── config/
│   │   └── firebase.ts       # Firebase 初始化（读取环境变量）
│   ├── services/
│   │   └── api.ts            # API 服务（读取 VITE_API_BASE_URL）
│   ├── pages/                # 页面组件
│   ├── components/           # 通用组件
│   ├── stores/               # Pinia 状态管理
│   ├── router/               # 路由配置
│   └── main.ts               # 入口文件
└── scripts/
    └── generate-db.mjs       # 生成模拟数据
```

---

## 🔐 **安全注意事项**

### ✅ **已排除敏感文件（不会提交到 Git）**

根据 `.gitignore` 配置，以下文件不会被提交：

```gitignore
# 环境变量文件
.env
.env.local
.env.development
.env.production
.env.*.local

# Firebase 敏感文件
.firebase
.firebaserc
firebase-debug.log*
```

### ⚠️ **只提交模板文件**

- ✅ **提交到 Git**：`.env.example`（模板，不含真实密钥）
- ❌ **不要提交**：`.env.development`, `.env.production`（包含真实密钥）

---

## 🛠️ **常见问题**

### Q1: 启动报错 "Firebase configuration is incomplete"

**原因**：未配置 Firebase 环境变量

**解决**：
```bash
# 1. 检查是否有 .env.development 文件
ls -la .env*

# 2. 如果没有，从模板复制
cp .env.example .env.development

# 3. 编辑 .env.development，填写 Firebase 配置
```

---

### Q2: API 请求失败 "Failed to fetch"

**原因**：后端未启动或 `VITE_API_BASE_URL` 配置错误

**解决**：
```bash
# 1. 检查后端是否运行在 http://localhost:8080
# 2. 检查 .env.development 中的 VITE_API_BASE_URL
cat .env.development | grep VITE_API_BASE_URL

# 3. 确保后端地址正确
VITE_API_BASE_URL=http://localhost:8080  # 修改为实际后端地址
```

---

### Q3: 修改 `.env` 文件后不生效

**原因**：Vite 需要重启才能读取新的环境变量

**解决**：
```bash
# 停止开发服务器（Ctrl + C）
# 重新启动
npm run dev
```

---

### Q4: 同伴拿到代码后无法运行

**清单检查**：
- ✅ 是否运行了 `npm install`
- ✅ 是否创建了 `.env.development` 文件
- ✅ 是否配置了所有必需的环境变量（后端 API + Firebase）
- ✅ Node.js 版本是否 >= 18
- ✅ 后端服务是否已启动

**完整启动流程**：
```bash
# 1. 安装依赖
npm install

# 2. 创建环境变量文件
cp .env.example .env.development

# 3. 编辑配置（填写 Firebase 和后端 API）
# 使用文本编辑器打开 .env.development

# 4. 启动项目
npm run dev
```

---

### Q5: 如何给新同伴 Firebase 配置？

**推荐方式**：通过私密渠道（如加密文档、团队密码管理器）分享

**不推荐**：直接发送完整的 `.env.development` 文件（包含敏感密钥）

**安全做法**：
1. 将 Firebase 配置放在团队共享的加密文档中
2. 新成员复制 `.env.example` 创建自己的 `.env.development`
3. 从加密文档复制配置填入

---

## 📦 **NPM Scripts 说明**

| 命令 | 说明 |
|-----|------|
| `npm run dev` | 启动开发服务器（Vite HMR） |
| `npm run build` | 构建生产版本（输出到 `dist/`） |
| `npm run preview` | 预览生产构建 |
| `npm run api` | 启动 JSON Server（模拟后端） |
| `npm run gen:db` | 生成模拟数据（`db.json`） |
| `npm run start:all` | 生成数据 + 启动 JSON Server + Vite（并发） |
| `npm run deploy` | 构建 + 部署到 Firebase Hosting |

---

## 🌐 **部署指南**

### 部署到 Vercel

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署（首次）
vercel

# 4. 后续部署
vercel --prod
```

**重要**：在 Vercel Dashboard 设置环境变量：
- `VITE_API_BASE_URL`
- `VITE_FIREBASE_API_KEY`
- 其他 Firebase 配置...

---

### 部署到 Firebase Hosting

```bash
# 1. 登录 Firebase
firebase login

# 2. 初始化项目（首次）
firebase init hosting

# 3. 构建 + 部署
npm run deploy
```

---

## 🧑‍💻 **技术栈**

- **框架**：Vue 3 (Composition API)
- **语言**：TypeScript
- **构建工具**：Vite 7.1.2
- **状态管理**：Pinia 3.0
- **路由**：Vue Router 4.5
- **样式**：Tailwind CSS 4.1
- **表单验证**：Yup 1.7
- **后端服务**：Firebase + Spring Boot
- **HTTP 客户端**：Fetch API

---

## 👥 **团队协作建议**

1. **首次克隆项目时**：
   ```bash
   git clone <repo-url>
   cd anti-fake-news
   npm install
   cp .env.example .env.development
   # 从团队共享文档复制 Firebase 配置
   npm run dev
   ```

2. **提交代码前**：
   ```bash
   # 确保不提交敏感文件
   git status  # 检查是否有 .env.development 或 .env.production
   ```

3. **更新依赖时**：
   ```bash
   git pull
   npm install  # 确保同步最新依赖
   ```

---

## 📞 **获取帮助**

- 📧 项目问题：提交 Issue
- 💬 团队沟通：[团队 Slack/Discord 频道]
- 📖 后端文档：[后端 API 文档链接]

---

## 📄 **License**

MIT License - 详见 LICENSE 文件
