# 🔄 前后端对齐核对报告（基于 Spring Boot 后端）

**更新时间**: 2025-10-30  
**后端端口**: `http://localhost:8080`  
**前端端口**: `http://localhost:5173` (Vite)

---

## ✅ 已完成且前后端完全对齐的功能

### 1. **用户认证系统** - 100% 完成 ✅

#### 后端接口（Spring Boot）
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `GET /auth/me` - 获取当前用户信息

#### 前端实现
- ✅ `src/services/api.ts` - authService 完全对齐
- ✅ `src/stores/auth.ts` - 状态管理完整
- ✅ `src/pages/Login.vue` - 登录页面
- ✅ `src/pages/Register.vue` - 注册页面
- ✅ JWT Token 管理（localStorage）
- ✅ 401/403 错误处理

#### 字段对齐检查
```typescript
// 前端 RegisterRequest ✅
interface RegisterRequest {
  email: string      // ✅ 对齐
  name: string       // ✅ 对齐
  password: string   // ✅ 对齐
  imageUrl?: string  // ✅ 对齐（可选）
}

// 前端 LoginRequest ✅
interface LoginRequest {
  email: string      // ✅ 对齐
  password: string   // ✅ 对齐
}

// 前端 User ✅
interface User {
  id: number         // ✅ 对齐（后端 Long → 前端 number）
  email: string      // ✅ 对齐
  name: string       // ✅ 对齐
  imageUrl?: string  // ✅ 对齐
  roles: Role[]      // ✅ 对齐（Set<Role> → Role[]）
}

// 前端 AuthResponse ✅
interface AuthResponse {
  token: string      // ✅ 对齐
}
```

### 2. **管理员功能** - 100% 完成 ✅

#### 后端接口（Spring Boot）
- `GET /admin/users` - 获取所有用户
- `PATCH /admin/users/{id}/role?role=MEMBER` - 更新用户角色

#### 前端实现
- ✅ `src/services/api.ts` - adminService 完全对齐
- ✅ `src/pages/AdminUsers.vue` - 用户管理页面
- ✅ 角色更新功能（READER/MEMBER/ADMIN）
- ✅ 权限验证（requiresAdmin 路由守卫）

### 3. **路由守卫与权限控制** - 100% 完成 ✅

#### 前端路由配置（src/router/index.ts）
```typescript
// ✅ 需要登录的路由
{ path: '/vote/:id', meta: { requiresAuth: true } }

// ✅ 需要管理员权限的路由
{ path: '/admin/users', meta: { requiresAuth: true, requiresAdmin: true } }

// ✅ 仅游客访问的路由
{ path: '/login', meta: { guestOnly: true } }
{ path: '/register', meta: { guestOnly: true } }
```

#### 路由守卫逻辑
- ✅ 401 跳转到登录页（保留 redirect 参数）
- ✅ 登录后自动跳回原页面
- ✅ 管理员权限验证
- ✅ 会话恢复（刷新页面保持登录）

### 4. **默认管理员账号** - 100% 对齐 ✅

#### 后端自动创建
```java
email: admin@local
password: admin123
role: ADMIN
```

#### 前端测试账号提示
- ✅ Login.vue 显示测试账号
- ✅ 可直接使用 admin@local / admin123 登录

---

## ⚠️ 后端已实现但前端未对接的功能

### 1. **新闻管理（假设后端已实现）** - ❌ 0%

#### 后端接口（预期）
```
GET /news - 获取新闻列表
GET /news/{id} - 获取新闻详情
POST /news - 创建新闻（需要 MEMBER 或 ADMIN）
PUT /news/{id} - 更新新闻
DELETE /news/{id} - 删除新闻（需要 ADMIN）
```

#### 前端现状
- ⚠️ 当前使用 Mock 数据（`db.json` + `json-server`）
- ⚠️ `src/pages/Home.vue` 从 `http://localhost:4000/news` 获取数据
- ❌ 未连接后端 `http://localhost:8080/news`

#### 需要做的工作
1. 在 `src/services/api.ts` 添加 `newsService`
2. 更新 `Home.vue` 使用真实后端
3. 实现新闻创建/编辑/删除功能（如果后端提供）

### 2. **评论管理（假设后端已实现）** - ❌ 0%

#### 后端接口（预期）
```
GET /news/{id}/comments - 获取评论列表
POST /news/{id}/comments - 创建评论
DELETE /comments/{id} - 删除评论（需要 ADMIN）
```

#### 前端现状
- ⚠️ 当前使用 localStorage + Pinia 存储评论
- ❌ 未连接后端评论 API

#### 需要做的工作
1. 在 `src/services/api.ts` 添加 `commentService`
2. 更新 `src/stores/comments.ts` 连接后端
3. 实现评论删除功能（管理员）

### 3. **投票功能（假设后端已实现）** - ❌ 0%

#### 后端接口（预期）
```
POST /news/{id}/vote - 提交投票
  { "vote": "FAKE" | "REAL", "comment": "...", "imageUrl": "..." }
GET /news/{id}/votes - 获取投票统计
```

#### 前端现状
- ⚠️ `src/pages/VotePage.vue` 仅更新本地数据
- ❌ 未保存到后端

#### 需要做的工作
1. 在 `src/services/api.ts` 添加 `voteService`
2. 更新 `VotePage.vue` 提交到后端
3. 实时同步投票计数

---

## 🔴 项目要求未完成的核心功能

### 1. **新闻搜索** (评分项 16) - ❌ 0%
- [ ] 按新闻详情搜索（topic, shortDetail, reporter）
- [ ] 按新闻状态搜索（fake/real/pending）
- [ ] 搜索结果页面

### 2. **管理员删除新闻** (评分项 12) - ❌ 0%
- [ ] 删除新闻功能
- [ ] 软删除（普通用户不可见，管理员可见）
- [ ] 或硬删除（完全删除）

### 3. **管理员删除评论** (评分项 14) - ❌ 0%
- [ ] 删除不当评论
- [ ] 重新计算投票分数

### 4. **Yup 表单验证** (评分项 18) - ❌ 30%
- ⚠️ 当前仅基础验证（required, email 格式）
- [ ] 引入 Yup 库
- [ ] 所有表单添加完整验证规则
- [ ] 统一错误提示样式

### 5. **会员发布新闻** (评分项 10) - ❌ 0%
- [ ] MEMBER 角色可发布新闻
- [ ] 新闻创建表单
- [ ] 图片上传功能

### 6. **部署** (评分项 21) - ❌ 0%
- [ ] 后端部署（Vercel/Railway/Render）
- [ ] 前端部署（Firebase Hosting）
- [ ] 环境变量配置

---

## 📊 完成度统计

### 认证相关（100% 完成）
- ✅ 用户注册/登录/登出
- ✅ JWT Token 管理
- ✅ 会话持久化
- ✅ 管理员用户管理
- ✅ 角色权限控制

### 新闻展示（90% 完成）
- ✅ 新闻列表展示
- ✅ 分页功能
- ✅ 筛选功能（全部/假/真/未知）
- ✅ 新闻详情页
- ✅ 评论列表展示
- ✅ 投票结果展示
- ❌ 连接后端 API（当前使用 Mock）

### 核心功能缺失（0% 完成）
- ❌ 新闻搜索
- ❌ 管理员删除新闻
- ❌ 管理员删除评论
- ❌ Yup 表单验证
- ❌ 会员发布新闻
- ❌ 投票保存到后端
- ❌ 评论保存到后端

### 总体完成度：**约 60%**

---

## 🔧 立即需要做的工作（按优先级）

### 优先级 1：连接后端 API（假设后端已实现）

#### 1.1 创建新闻服务
```typescript
// src/services/api.ts 添加
export const newsService = {
  async getAll(page?: number, size?: number, filter?: string): Promise<NewsItem[]> {
    const params = new URLSearchParams()
    if (page) params.set('page', String(page))
    if (size) params.set('size', String(size))
    if (filter && filter !== 'all') params.set('status', filter)
    
    const response = await fetchWithAuth(`${API_BASE_URL}/news?${params}`)
    if (!response.ok) throw new Error('Failed to get news')
    return response.json()
  },
  
  async getById(id: string): Promise<NewsItem> {
    const response = await fetchWithAuth(`${API_BASE_URL}/news/${id}`)
    if (!response.ok) throw new Error('Failed to get news')
    return response.json()
  },
  
  async create(data: CreateNewsRequest): Promise<NewsItem> {
    const response = await fetchWithAuth(`${API_BASE_URL}/news`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create news')
    return response.json()
  },
  
  async delete(id: string): Promise<void> {
    const response = await fetchWithAuth(`${API_BASE_URL}/news/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete news')
  }
}
```

#### 1.2 创建投票服务
```typescript
export const voteService = {
  async submit(newsId: string, data: VoteRequest): Promise<void> {
    const response = await fetchWithAuth(`${API_BASE_URL}/news/${newsId}/vote`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to submit vote')
  },
  
  async getStats(newsId: string): Promise<VoteStats> {
    const response = await fetchWithAuth(`${API_BASE_URL}/news/${newsId}/votes`)
    if (!response.ok) throw new Error('Failed to get vote stats')
    return response.json()
  }
}
```

#### 1.3 创建评论服务
```typescript
export const commentService = {
  async getByNewsId(newsId: string): Promise<Comment[]> {
    const response = await fetchWithAuth(`${API_BASE_URL}/news/${newsId}/comments`)
    if (!response.ok) throw new Error('Failed to get comments')
    return response.json()
  },
  
  async create(newsId: string, data: CreateCommentRequest): Promise<Comment> {
    const response = await fetchWithAuth(`${API_BASE_URL}/news/${newsId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create comment')
    return response.json()
  },
  
  async delete(commentId: string): Promise<void> {
    const response = await fetchWithAuth(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete comment')
  }
}
```

### 优先级 2：实现搜索功能

1. 创建搜索页面 `src/pages/SearchNews.vue`
2. 添加搜索服务到 `api.ts`
3. 在 NavBar 添加搜索框
4. 实现搜索结果展示

### 优先级 3：添加 Yup 验证

1. 安装 Yup：`npm install yup`
2. 创建验证 schemas：`src/utils/validation.ts`
3. 更新所有表单使用 Yup

### 优先级 4：管理员删除功能

1. 在 AdminUsers.vue 添加删除新闻入口
2. 在 NewsDetails.vue 添加删除按钮（仅管理员可见）
3. 在 CommentList.vue 添加删除按钮（仅管理员可见）

### 优先级 5：部署

1. 后端部署到 Vercel/Railway
2. 前端构建：`npm run build`
3. 部署到 Firebase Hosting：`firebase deploy --only hosting`

---

## 🚨 关键对齐点检查清单

- [x] API 端口：`http://localhost:8080` ✅
- [x] 认证接口：`/auth/register`, `/auth/login`, `/auth/me` ✅
- [x] 管理员接口：`/admin/users`, `/admin/users/{id}/role` ✅
- [x] 字段名称：email, name, password, imageUrl, roles ✅
- [x] JWT Token：Bearer 格式 ✅
- [x] 角色枚举：READER, MEMBER, ADMIN ✅
- [x] 401/403 错误处理 ✅
- [ ] 新闻接口：`/news`, `/news/{id}` ⏳ 待对接
- [ ] 评论接口：`/news/{id}/comments` ⏳ 待对接
- [ ] 投票接口：`/news/{id}/vote` ⏳ 待对接

---

## 📝 下一步行动计划

### 立即执行（今天）
1. **确认后端新闻接口是否已实现**
   - 如果是：对接前端
   - 如果否：继续使用 Mock 数据

2. **测试现有功能**
   - 启动后端：`./mvnw spring-boot:run`（或 `java -jar backend.jar`）
   - 启动前端：`npm run dev`
   - 测试登录/注册/管理员功能

### 短期目标（1-2 天）
1. 实现新闻搜索功能
2. 添加 Yup 表单验证
3. 实现管理员删除功能

### 中期目标（3-5 天）
1. 会员发布新闻功能
2. 完善 UI/UX
3. 准备部署

---

**总结**：认证系统已 100% 完成且前后端完全对齐。主要缺失的是新闻/评论/投票的后端集成和搜索/删除等高级功能。
