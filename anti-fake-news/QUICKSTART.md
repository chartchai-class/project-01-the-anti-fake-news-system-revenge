# 🚀 新成员快速启动指南

欢迎加入 Anti-Fake News System 项目！本指南帮助你在 **5 分钟内**完成环境配置并启动项目。

---

## ⏱️ **5 分钟快速启动**

### 第 1 步：克隆项目（1 分钟）

```bash
# 克隆仓库
git clone <repository-url>

# 进入项目目录
cd anti-fake-news
```

---

### 第 2 步：安装依赖（2 分钟）

```bash
npm install
```

**等待安装完成**（根据网速，大约 1-3 分钟）

---

### 第 3 步：配置环境变量（2 分钟）

#### 3.1 复制环境变量模板

```bash
# Windows (PowerShell)
copy .env.example .env.development

# macOS/Linux
cp .env.example .env.development
```

#### 3.2 获取 Firebase 配置

**方式 1：从团队共享文档获取**（推荐）

联系项目负责人获取团队共享的 Firebase 配置，复制粘贴到 `.env.development`

**方式 2：创建自己的 Firebase 项目**（用于个人测试）

1. 访问：https://console.firebase.google.com/
2. 创建新项目
3. 项目设置 → Web 应用 → 复制配置
4. 粘贴到 `.env.development`

#### 3.3 配置后端地址

编辑 `.env.development`，确认后端地址：

```bash
# 如果后端运行在本地 8080 端口（默认）
VITE_API_BASE_URL=http://localhost:8080

# 如果后端运行在其他地址，修改为实际 URL
# VITE_API_BASE_URL=https://your-backend.herokuapp.com
```

---

### 第 4 步：验证配置（可选但推荐）

```bash
npm run check:env
```

**看到 ✅ 配置检查通过** 说明环境配置正确！

---

### 第 5 步：启动项目（10 秒）

```bash
npm run dev
```

**成功启动后**，浏览器自动打开：http://localhost:5173

---

## 🎉 **完成！**

你现在应该看到：

- ✅ 终端显示：`VITE v7.x.x  ready in xxx ms`
- ✅ 浏览器打开：http://localhost:5173
- ✅ 页面正常显示（可能会有 API 错误，确保后端已启动）

---

## ⚠️ **常见问题排查**

### 问题 1：`npm install` 失败

**可能原因**：
- Node.js 版本过低（需要 >= 18）
- 网络连接问题

**解决方法**：
```bash
# 检查 Node.js 版本
node -v  # 应该 >= 18.0.0

# 如果版本过低，安装最新 LTS 版本
# 访问：https://nodejs.org/

# 网络问题可尝试切换 npm 镜像
npm config set registry https://registry.npmmirror.com
```

---

### 问题 2：启动报错 "Firebase configuration is incomplete"

**原因**：未正确配置 Firebase 环境变量

**解决方法**：
```bash
# 1. 运行配置检查脚本
npm run check:env

# 2. 根据提示修复缺少的环境变量
# 3. 编辑 .env.development 文件

# 4. 重新启动
npm run dev
```

---

### 问题 3：页面显示 API 错误

**原因**：后端服务未启动

**解决方法**：

**选项 A：启动真实后端**（Spring Boot 项目）
```bash
# 在后端项目目录运行
./mvnw spring-boot:run  # macOS/Linux
mvnw.cmd spring-boot:run  # Windows
```

**选项 B：使用模拟后端**（JSON Server）
```bash
# 在前端项目目录运行
npm run start:all
# 这会同时启动 JSON Server (端口 4000) 和前端 (端口 5173)

# 然后修改 .env.development
VITE_API_BASE_URL=http://localhost:4000
```

---

### 问题 4：修改 `.env` 后不生效

**原因**：Vite 需要重启才能读取新的环境变量

**解决方法**：
```bash
# 停止开发服务器（Ctrl + C 或 Cmd + C）
# 重新启动
npm run dev
```

---

## 📋 **完整启动清单**

在启动前确保：

- [ ] Node.js >= 18 已安装
- [ ] Git 已安装
- [ ] 项目已克隆
- [ ] 依赖已安装（`npm install`）
- [ ] `.env.development` 文件已创建
- [ ] Firebase 配置已填写（8 个环境变量）
- [ ] 后端 API 地址已配置
- [ ] 后端服务已启动（或使用 JSON Server）
- [ ] 运行 `npm run check:env` 通过检查

---

## 🔧 **开发工具推荐**

- **VS Code**：推荐的代码编辑器
- **插件**：
  - Volar (Vue 3 官方插件)
  - TypeScript Vue Plugin
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier

---

## 📞 **需要帮助？**

- 💬 团队聊天：[Slack/Discord 频道链接]
- 📧 项目负责人：[联系方式]
- 📖 完整文档：查看项目根目录的 `README.md`

---

## 📝 **下一步**

成功启动后，建议：

1. 阅读完整的 `README.md` 了解项目架构
2. 查看 `src/` 目录了解代码结构
3. 尝试创建账号并登录
4. 浏览新闻列表和投票功能
5. 开始你的第一个任务！

---

祝你开发愉快！🎉
