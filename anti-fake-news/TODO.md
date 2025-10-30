# ✅ TODO 清单 - 反假新闻系统

## 🎯 已完成（前后端对齐）

- [x] 用户注册/登录/登出
- [x] JWT Token 认证
- [x] 管理员用户管理（查看/修改角色）
- [x] 新闻列表展示（带分页、筛选）
- [x] 新闻详情页
- [x] 评论列表展示
- [x] 投票界面
- [x] 路由守卫（权限控制）
- [x] Firebase SDK 集成
- [x] 环境变量配置

---

## 🔴 高优先级（核心功能缺失）

### 1. 连接后端 API（如果后端已实现）
- [ ] 新闻列表从后端获取（替换 Mock）
- [ ] 新闻详情从后端获取
- [ ] 投票提交到后端
- [ ] 评论提交到后端

**实施步骤**：
```bash
# 1. 确认后端是否有 /news, /news/{id}/vote 等接口
# 2. 更新 src/services/api.ts 添加 newsService
# 3. 更新 src/pages/Home.vue 使用 newsService.getAll()
# 4. 更新 src/pages/VotePage.vue 使用 voteService.submit()
```

### 2. 新闻搜索功能
- [ ] 搜索页面 UI（src/pages/SearchNews.vue）
- [ ] 搜索服务（api.ts）
- [ ] 导航栏添加搜索框
- [ ] 搜索结果展示（按状态、关键词筛选）

### 3. 管理员删除功能
- [ ] 删除新闻按钮（仅管理员可见）
- [ ] 删除评论按钮（仅管理员可见）
- [ ] 删除确认对话框
- [ ] 软删除/硬删除逻辑

### 4. 会员发布新闻
- [ ] 新闻创建表单页面
- [ ] 图片上传功能
- [ ] 表单验证
- [ ] 提交到后端 POST /news

---

## 🟡 中优先级（完善体验）

### 5. Yup 表单验证
- [ ] 安装 Yup：`npm install yup`
- [ ] 创建验证 schemas（src/utils/validation.ts）
- [ ] 更新 Login.vue 使用 Yup
- [ ] 更新 Register.vue 使用 Yup
- [ ] 更新 VotePage.vue 使用 Yup

### 6. 错误处理优化
- [ ] 统一错误提示组件
- [ ] 网络错误重试机制
- [ ] 加载状态优化

### 7. UI/UX 完善
- [ ] 响应式设计检查
- [ ] 暗色模式支持
- [ ] 无障碍访问（A11y）
- [ ] 动画过渡效果

---

## 🟢 低优先级（锦上添花）

### 8. 性能优化
- [ ] 图片懒加载
- [ ] 虚拟滚动（大列表）
- [ ] 缓存策略

### 9. 测试
- [ ] 单元测试（Vitest）
- [ ] E2E 测试（Playwright）
- [ ] API Mock 测试

---

## 🚀 部署清单

### 后端部署
- [ ] 选择云平台（Vercel/Railway/Render）
- [ ] 配置数据库连接（环境变量）
- [ ] 配置 CORS 允许前端域名
- [ ] 部署成功测试

### 前端部署
- [ ] 构建：`npm run build`
- [ ] 更新 `.env.production`：`VITE_API_BASE_URL=你的后端URL`
- [ ] Firebase 部署：`firebase deploy --only hosting`
- [ ] 测试生产环境

---

## 📋 后端需求清单（供后端开发者）

如果后端还没有以下接口，请实现：

```java
// NewsController
GET    /news                     // 获取新闻列表（分页、筛选）
GET    /news/{id}                // 获取新闻详情
POST   /news                     // 创建新闻（MEMBER/ADMIN）
PUT    /news/{id}                // 更新新闻
DELETE /news/{id}                // 删除新闻（ADMIN）

// VoteController
POST   /news/{id}/vote           // 提交投票
GET    /news/{id}/votes          // 获取投票统计

// CommentController
GET    /news/{id}/comments       // 获取评论列表
POST   /news/{id}/comments       // 创建评论
DELETE /comments/{id}            // 删除评论（ADMIN）

// SearchController
GET    /news/search?q=关键词&status=FAKE  // 搜索新闻
```

---

## 📊 进度追踪

**总体完成度：60%**

- 认证系统：100% ✅
- 新闻展示：90% ⚠️（UI 完成，API 待对接）
- 核心功能：0% ❌（搜索、删除、发布）
- 部署：0% ❌

**预计完成时间**：
- 高优先级：1-2 天
- 中优先级：2-3 天
- 低优先级：1-2 天
- **总计：4-7 天**

---

## 🔧 快速启动指南

### 启动开发环境
```powershell
# 终端 1 - 后端（如果已实现）
cd backend
./mvnw spring-boot:run  # 或 java -jar target/app.jar

# 终端 2 - Mock 服务器（如果后端未实现）
cd anti-fake-news
npm run json-server  # 启动 http://localhost:4000

# 终端 3 - 前端
cd anti-fake-news
npm run dev  # 启动 http://localhost:5173
```

### 测试账号
```
管理员：admin@local / admin123
普通用户：自行注册
```

---

**最后更新：2025-10-30**
