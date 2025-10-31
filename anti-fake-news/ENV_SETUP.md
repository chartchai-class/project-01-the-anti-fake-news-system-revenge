# ⚙️ 环境变量配置说明

> **重要提示**：首次运行项目前，必须配置环境变量！本文档列出所有需要手动配置的环境变量。

---

## 📋 快速配置步骤

### 1️⃣ 创建配置文件

```bash
# Windows (PowerShell)
copy .env.example .env.development

# macOS/Linux
cp .env.example .env.development
```

### 2️⃣ 编辑配置文件

使用文本编辑器打开 `.env.development`，按照下方说明修改配置。

### 3️⃣ 验证配置

```bash
npm run check:env
```

---

## 🔴 必须修改的环境变量

以下变量包含占位符或示例值，**必须替换为实际值**：

### 1. Firebase 配置（8 个变量）

> 📍 **获取方式**：访问 [Firebase Console](https://console.firebase.google.com/) → 选择项目 → 项目设置 ⚙️ → 滚动到 "您的应用" → 选择 Web 应用 → 复制配置

#### ❌ 需要修改（如果使用默认模板）

打开 `.env.development`，找到以下变量并替换为你的 Firebase 配置：

```bash
# ⚠️ 替换为你的 Firebase API Key
VITE_FIREBASE_API_KEY=AIzaSyAYDpN4qVb9PL-nP3hHzLWeSvU8RhORTjM

# ⚠️ 替换为你的 Firebase Auth Domain
VITE_FIREBASE_AUTH_DOMAIN=se331project.firebaseapp.com

# ⚠️ 替换为你的 Firebase Project ID
VITE_FIREBASE_PROJECT_ID=se331project

# ⚠️ 替换为你的 Firebase Storage Bucket
VITE_FIREBASE_STORAGE_BUCKET=se331project.firebasestorage.app

# ⚠️ 替换为你的 Firebase Messaging Sender ID
VITE_FIREBASE_MESSAGING_SENDER_ID=1063821145347

# ⚠️ 替换为你的 Firebase App ID
VITE_FIREBASE_APP_ID=1:1063821145347:web:5ec4e3ad5cd83366f2a536

# ⚠️ 替换为你的 Firebase Measurement ID
VITE_FIREBASE_MEASUREMENT_ID=G-34629W63FC
```

#### 🔍 如何获取 Firebase 配置

**选项 A：使用团队共享配置**（推荐）

联系项目负责人获取团队的 Firebase 配置，直接复制粘贴到 `.env.development`。

**选项 B：创建自己的 Firebase 项目**

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击 "添加项目" 或选择现有项目
3. 进入项目后，点击左上角设置图标 ⚙️ → "项目设置"
4. 滚动到 "您的应用" 部分
5. 如果没有 Web 应用，点击 "添加应用" → 选择 Web 图标 `</>`
6. 复制显示的配置代码，填入 `.env.development`

**Firebase 配置示例**：
```javascript
// Firebase Console 显示的配置
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXX",           // 复制这个值
  authDomain: "your-project.firebaseapp.com",       // 复制这个值
  projectId: "your-project",                        // 复制这个值
  storageBucket: "your-project.firebasestorage.app", // 复制这个值
  messagingSenderId: "123456789",                   // 复制这个值
  appId: "1:123456789:web:abcdefg",                 // 复制这个值
  measurementId: "G-XXXXXXXXXX"                     // 复制这个值
};
```

---

## 🟡 可能需要修改的环境变量

### 2. 后端 API 地址

```bash
# 默认值（本地开发）
VITE_API_BASE_URL=http://localhost:8080
```

#### 何时需要修改？

| 情况 | 修改为 |
|-----|--------|
| 后端运行在不同端口 | `http://localhost:其他端口` |
| 后端已部署到远程服务器 | `https://your-backend.herokuapp.com` |
| 使用 JSON Server 模拟后端 | `http://localhost:4000` |

#### 示例

```bash
# 示例 1：后端运行在 3000 端口
VITE_API_BASE_URL=http://localhost:3000

# 示例 2：后端部署在 Heroku
VITE_API_BASE_URL=https://anti-fake-news-api.herokuapp.com

# 示例 3：使用 JSON Server（npm run api）
VITE_API_BASE_URL=http://localhost:4000
```

---

## ✅ 不需要修改的配置

以下配置通常不需要修改，保持默认值即可：

- `vite.config.ts` - Vite 构建配置
- `tsconfig.json` - TypeScript 配置
- `package.json` - 依赖和脚本（除非需要添加新依赖）
- `firebase.json` - Firebase 部署配置
- `vercel.json` - Vercel 部署配置

---

## 🔍 配置验证清单

完成配置后，请逐项检查：

- [ ] 已创建 `.env.development` 文件
- [ ] 已填写所有 8 个 Firebase 环境变量（`VITE_FIREBASE_*`）
- [ ] Firebase 配置不包含占位符（如 `your-api-key-here`）
- [ ] 后端 API 地址（`VITE_API_BASE_URL`）正确
- [ ] 运行 `npm run check:env` 通过验证
- [ ] `.env.development` 未被提交到 Git（应在 `.gitignore` 中）

---

## ⚠️ 常见错误

### 错误 1：启动时报错 "Firebase configuration is incomplete"

**原因**：Firebase 环境变量缺失或使用了占位符

**解决**：
1. 打开 `.env.development`
2. 确保所有 `VITE_FIREBASE_*` 变量都有实际值
3. 确保没有 `your-api-key-here` 这样的占位符
4. 重启开发服务器

---

### 错误 2：API 请求失败 "Network Error"

**原因**：后端 API 地址错误或后端未启动

**解决**：
1. 检查 `.env.development` 中的 `VITE_API_BASE_URL`
2. 确认后端服务已启动
3. 在浏览器访问后端地址测试连接
4. 重启开发服务器

---

### 错误 3：修改 `.env` 后不生效

**原因**：Vite 只在启动时读取环境变量

**解决**：
1. 停止开发服务器（`Ctrl + C`）
2. 重新启动：`npm run dev`

---

## 📝 配置文件示例

### 完整的 `.env.development` 示例

```bash
# ====================================
# 开发环境配置
# ====================================

# 后端 API 地址
VITE_API_BASE_URL=http://localhost:8080

# Firebase 配置（请替换为实际值）
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdefg
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 🔐 安全提醒

### ✅ 安全做法

- ✅ 从 `.env.example` 复制创建 `.env.development`
- ✅ 将 Firebase 配置保存在团队加密文档中
- ✅ 定期检查 Git 状态，确保 `.env.development` 未被提交
- ✅ 开发环境和生产环境使用不同的 Firebase 项目

### ❌ 危险做法

- ❌ 直接提交 `.env.development` 到 Git
- ❌ 在公共聊天频道分享完整配置文件
- ❌ 将 API Key 硬编码在源代码中
- ❌ 在公共仓库暴露真实的 Firebase 配置

---

## 🆘 需要帮助？

### 获取 Firebase 配置

如果你是团队新成员，请联系：

- 📧 项目负责人：[联系邮箱]
- 💬 团队频道：[Slack/Discord 链接]

### 技术支持

- 🔧 配置问题：查看 [CONFIGURATION.md](./CONFIGURATION.md)
- 🚀 快速启动：查看 [QUICKSTART.md](./QUICKSTART.md)
- 📖 完整文档：查看 [README.md](./README.md)

---

## ✅ 验证配置成功

完成配置后，运行以下命令验证：

```bash
# 1. 检查配置
npm run check:env

# 2. 如果通过，启动项目
npm run dev
```

**成功标志**：
- ✅ 终端显示：`VITE v7.x.x  ready in xxx ms`
- ✅ 浏览器自动打开：http://localhost:5173
- ✅ 页面正常加载，无 Firebase 错误

---

**配置完成后，请删除此提醒并开始开发！** 🎉
