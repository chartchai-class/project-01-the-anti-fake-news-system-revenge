# 🔧 配置文件详解

本文档详细说明所有影响项目启动和运行的配置文件。

---

## 📋 **配置文件清单**

### ✅ **核心配置文件**（影响启动）

| 文件 | 作用 | 是否提交到 Git | 说明 |
|-----|------|---------------|------|
| `.env.example` | 环境变量模板 | ✅ 提交 | 团队成员复制此文件创建自己的配置 |
| `.env.development` | 开发环境变量 | ❌ 不提交 | 包含敏感信息，每个人独立配置 |
| `.env.production` | 生产环境变量 | ❌ 不提交 | 部署时使用 |
| `.env.local` | 本地覆盖配置 | ❌ 不提交 | 可选，用于个人定制 |
| `package.json` | 项目依赖和脚本 | ✅ 提交 | NPM 包管理 |
| `vite.config.ts` | Vite 构建配置 | ✅ 提交 | 构建工具设置 |
| `tsconfig.json` | TypeScript 配置 | ✅ 提交 | TS 编译选项 |
| `.gitignore` | Git 忽略规则 | ✅ 提交 | 防止敏感文件被提交 |

### ⚙️ **部署配置文件**（部署时使用）

| 文件 | 作用 | 用于 | 说明 |
|-----|------|------|------|
| `firebase.json` | Firebase Hosting 配置 | Firebase 部署 | 单页应用路由重写 |
| `vercel.json` | Vercel 部署配置 | Vercel 部署 | 构建和路由设置 |

### 📝 **开发辅助文件**

| 文件 | 作用 | 说明 |
|-----|------|------|
| `README.md` | 项目文档 | 完整的项目说明 |
| `QUICKSTART.md` | 快速启动指南 | 新成员 5 分钟启动教程 |
| `CONFIGURATION.md` | 配置详解 | 本文件 |
| `scripts/check-env.mjs` | 环境检查脚本 | 验证配置是否正确 |
| `.env.local.example` | 本地配置模板 | 个人定制配置示例 |

---

## 🔐 **环境变量详解**

### 1. `.env.development`（开发环境 - 必需）

```bash
# ====================================
# 后端 API 配置
# ====================================
VITE_API_BASE_URL=http://localhost:8080
# 说明：后端 Spring Boot 服务的地址
# 开发环境：通常是 http://localhost:8080
# 如果后端运行在其他端口，修改此值

# ====================================
# Firebase 配置（8 个必需变量）
# ====================================
VITE_FIREBASE_API_KEY=AIzaSyAYDpN4qVb9PL-nP3hHzLWeSvU8RhORTjM
# 说明：Firebase 项目的 API Key
# 获取：Firebase Console > 项目设置 > Web 应用

VITE_FIREBASE_AUTH_DOMAIN=se331project.firebaseapp.com
# 说明：Firebase 认证域名
# 格式：<project-id>.firebaseapp.com

VITE_FIREBASE_PROJECT_ID=se331project
# 说明：Firebase 项目 ID
# 位置：Firebase Console > 项目设置 > 常规

VITE_FIREBASE_STORAGE_BUCKET=se331project.firebasestorage.app
# 说明：Firebase Storage 存储桶地址
# 格式：<project-id>.firebasestorage.app

VITE_FIREBASE_MESSAGING_SENDER_ID=1063821145347
# 说明：Firebase 消息发送者 ID
# 用途：推送通知（本项目未使用但必需）

VITE_FIREBASE_APP_ID=1:1063821145347:web:5ec4e3ad5cd83366f2a536
# 说明：Firebase 应用 ID
# 格式：1:<sender-id>:web:<app-hash>

VITE_FIREBASE_MEASUREMENT_ID=G-34629W63FC
# 说明：Google Analytics 测量 ID
# 用途：分析统计（可选）
```

---

### 2. `.env.production`（生产环境 - 部署时必需）

```bash
# 生产环境后端地址（必须修改为实际部署的后端 URL）
VITE_API_BASE_URL=https://your-backend.herokuapp.com

# 生产环境 Firebase 配置
# 建议：生产环境使用独立的 Firebase 项目
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
# ... 其他 Firebase 配置
```

---

### 3. `.env.local`（本地覆盖配置 - 可选）

```bash
# 用途：覆盖 .env.development 中的部分配置
# 优先级：.env.local > .env.development

# 示例：使用不同的本地后端端口
VITE_API_BASE_URL=http://localhost:3000

# 示例：使用个人测试 Firebase 项目
VITE_FIREBASE_PROJECT_ID=my-test-project
```

**使用场景**：
- 团队成员使用不同的后端端口
- 个人测试时使用独立的 Firebase 项目
- 调试特定配置而不影响团队其他成员

---

## 🔧 **Vite 配置说明**

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwind from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    plugins: [
        vue(),              // Vue 3 支持
        tailwind()          // Tailwind CSS 集成
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
            // 允许使用 @/ 代替 src/
            // 例如：import { api } from '@/services/api'
        }
    }
})
```

**说明**：
- **无需修改**：适用于所有团队成员
- **@ 别名**：简化导入路径
- **插件**：Vue 3 + Tailwind CSS 自动配置

---

## 📦 **package.json 脚本说明**

```json
{
  "scripts": {
    "dev": "vite",
    // 启动开发服务器，端口 5173，热更新
    
    "build": "vue-tsc -b && vite build",
    // 类型检查 + 构建生产版本（输出到 dist/）
    
    "preview": "vite preview",
    // 预览生产构建（本地测试）
    
    "api": "json-server --watch db.json --port 4000",
    // 启动模拟后端（JSON Server），端口 4000
    
    "gen:db": "node scripts/generate-db.mjs",
    // 生成模拟数据（db.json）
    
    "start:all": "npm run gen:db && concurrently \"npm run api\" \"npm run dev\"",
    // 同时启动 JSON Server + 前端（用于快速演示）
    
    "deploy": "npm run build && firebase deploy --only hosting",
    // 构建 + 部署到 Firebase Hosting
    
    "check:env": "node scripts/check-env.mjs",
    // 检查环境变量配置是否正确（新增）
    
    "setup": "npm install && npm run check:env"
    // 一键安装依赖 + 检查配置（新增）
  }
}
```

---

## 🚫 **Git 忽略规则**

### `.gitignore` 关键内容

```gitignore
# 环境变量文件（包含敏感信息）
.env
.env.local
.env.development
.env.production
.env.*.local

# 构建输出
node_modules
dist
dist-ssr

# Firebase
.firebase
.firebaserc
firebase-debug.log*
```

**为什么排除环境变量文件？**
- 包含敏感信息（API Keys, Firebase 配置）
- 不同团队成员可能有不同配置
- 避免意外泄露密钥到公共仓库

**只提交模板文件**：
- ✅ `.env.example` - 提交（不含真实密钥）
- ❌ `.env.development` - 不提交（包含真实密钥）

---

## 🔍 **环境变量读取机制**

### Vite 环境变量规则

1. **命名规则**：必须以 `VITE_` 开头才能在前端代码中访问
   ```typescript
   // ✅ 可以访问
   const apiUrl = import.meta.env.VITE_API_BASE_URL
   
   // ❌ 无法访问（不以 VITE_ 开头）
   const secret = import.meta.env.SECRET_KEY  // undefined
   ```

2. **加载优先级**（从高到低）：
   ```
   .env.local          (最高优先级，本地覆盖)
   .env.development    (开发环境)
   .env.production     (生产环境)
   .env                (通用默认值)
   ```

3. **构建时行为**：
   - 环境变量在构建时**硬编码**到代码中
   - 修改 `.env` 后必须重启 Vite
   - 生产构建使用 `.env.production`

---

## 🛡️ **安全最佳实践**

### ✅ **推荐做法**

1. **提交前检查**：
   ```bash
   git status  # 确保没有 .env.development 或 .env.production
   ```

2. **团队协作**：
   - 将 Firebase 配置存放在团队加密文档中
   - 新成员从加密文档获取配置
   - 不要通过聊天工具直接发送密钥

3. **环境分离**：
   - 开发环境使用测试 Firebase 项目
   - 生产环境使用独立的 Firebase 项目
   - 不要在生产环境使用开发密钥

4. **定期轮换密钥**：
   - 定期更新 Firebase API Key
   - 离职成员后重新生成密钥

### ❌ **禁止做法**

1. ❌ 将 `.env.development` 提交到 Git
2. ❌ 在代码中硬编码 API Key
3. ❌ 在公共聊天频道分享配置文件
4. ❌ 在公共仓库暴露真实密钥

---

## 🔧 **验证配置**

### 方式 1：使用验证脚本（推荐）

```bash
npm run check:env
```

**输出示例**：
```
✅ 配置检查通过！项目可以启动
🚀 运行以下命令启动项目：
   npm run dev
```

### 方式 2：手动检查

```bash
# 1. 检查文件是否存在
ls -la .env.development

# 2. 查看内容（Windows）
type .env.development

# 3. 查看内容（macOS/Linux）
cat .env.development

# 4. 检查是否有必需变量
grep VITE_ .env.development
```

---

## 📞 **遇到问题？**

### 配置相关问题

| 问题 | 解决方法 |
|-----|---------|
| 缺少 `.env.development` | `cp .env.example .env.development` |
| Firebase 配置错误 | 运行 `npm run check:env` 检查 |
| 修改后不生效 | 重启 Vite (`Ctrl+C` 后 `npm run dev`) |
| Git 提示提交 `.env` | 检查 `.gitignore` 是否正确 |

### 获取帮助

- 📖 完整文档：`README.md`
- 🚀 快速启动：`QUICKSTART.md`
- 🔧 配置详解：本文件
- 💬 团队支持：[团队沟通渠道]

---

## 📚 **相关文档**

- [README.md](./README.md) - 完整项目文档
- [QUICKSTART.md](./QUICKSTART.md) - 5 分钟快速启动
- [.env.example](./.env.example) - 环境变量模板
- [scripts/check-env.mjs](./scripts/check-env.mjs) - 配置验证脚本

---

**最后更新**：2025-10-31
