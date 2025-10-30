# 🔐 前端认证系统集成文档

## 📋 项目概述

本文档记录了前端与后端认证系统的完整集成，包括用户登录、注册、权限管理等功能。

---

## 🎯 完成的功能

### ✅ 1. 类型定义 (`src/types.ts`)
- **Role 类型**: `'READER' | 'MEMBER' | 'ADMIN'`
- **User 接口**: 包含 `id`, `email`, `name`, `imageUrl?`, `roles`
- **RegisterRequest**: 注册请求数据结构
- **LoginRequest**: 登录请求数据结构
- **AuthResponse**: 认证响应（包含 JWT token）
- **ApiError**: API 错误结构

### ✅ 2. API 服务 (`src/services/api.ts`)

#### 认证 API (`authService`)
```typescript
- register(data: RegisterRequest): Promise<AuthResponse>
  // 用户注册，返回 JWT token

- login(data: LoginRequest): Promise<AuthResponse>
  // 用户登录，返回 JWT token

- getCurrentUser(): Promise<User>
  // 获取当前登录用户信息（需要认证）

- logout(): void
  // 清除本地存储的 token 和用户信息
```

#### 管理员 API (`adminService`)
```typescript
- getAllUsers(): Promise<User[]>
  // 获取所有用户列表（需要 ADMIN 权限）

- updateUserRole(userId: number, role: Role): Promise<string>
  // 更新用户角色（需要 ADMIN 权限）
```

#### 工具函数 (`roleUtils`)
```typescript
- hasRole(user, role): boolean
  // 检查用户是否拥有指定角色

- isAdmin(user): boolean
  // 检查是否为管理员

- isMember(user): boolean
  // 检查是否为会员

- isAuthenticated(user): boolean
  // 检查是否已登录
```

### ✅ 3. 认证状态管理 (`src/stores/auth.ts`)

#### State
```typescript
{
  user: User | null,          // 当前用户信息
  token: string | null,       // JWT token
  loading: boolean,           // 加载状态
  error: string | null        // 错误信息
}
```

#### Getters
- `isAuthenticated`: 是否已登录
- `isAdmin`: 是否为管理员
- `isMember`: 是否为会员
- `isReader`: 是否为只读用户
- `displayName`: 用户显示名称
- `avatarUrl`: 用户头像 URL（带默认值）

#### Actions
- `register(data)`: 用户注册
- `login(data)`: 用户登录
- `fetchCurrentUser()`: 获取当前用户信息
- `logout()`: 用户登出
- `restoreSession()`: 从 localStorage 恢复会话
- `clearError()`: 清除错误信息

### ✅ 4. 页面组件

#### 登录页面 (`src/pages/Login.vue`)
- 📧 邮箱 + 密码登录
- ✅ 表单验证
- 🔄 加载状态提示
- ❌ 错误信息展示
- 🔗 跳转到注册页面
- 💡 测试账号提示

#### 注册页面 (`src/pages/Register.vue`)
- 📝 邮箱、名称、密码、确认密码、头像 URL（可选）
- ✅ 完整的表单验证（密码长度、密码一致性）
- 🔄 加载状态提示
- ❌ 错误信息展示
- 🔗 跳转到登录页面
- 💡 默认角色提示

#### 用户管理页面 (`src/pages/AdminUsers.vue`)
- 👥 显示所有用户列表
- 🏷️ 显示用户角色标签
- 🔄 更新用户角色（READER、MEMBER、ADMIN）
- 🔐 需要 ADMIN 权限才能访问
- 📊 用户信息表格（ID、头像、名称、邮箱、角色）
- 💡 角色说明文档

#### 投票页面更新 (`src/pages/VotePage.vue`)
- 👤 使用真实的登录用户名
- 🖼️ 使用用户头像作为默认图片
- 🔐 需要登录才能访问

### ✅ 5. 导航栏组件 (`src/components/NavBar.vue`)
- 🏠 Logo 和标题
- 👤 显示当前用户信息（头像、名称、角色）
- 🔐 登录/注册按钮（未登录状态）
- 🚪 退出登录按钮（已登录状态）
- 👥 用户管理按钮（仅管理员可见）
- 🎨 角色标签颜色区分

### ✅ 6. 路由配置 (`src/router/index.ts`)

#### 新增路由
```typescript
- /login          → Login.vue (仅访客)
- /register       → Register.vue (仅访客)
- /admin/users    → AdminUsers.vue (需要 ADMIN)
```

#### 路由守卫
- ✅ 自动恢复会话（从 localStorage）
- ✅ 检查登录状态（`requiresAuth`）
- ✅ 检查管理员权限（`requiresAdmin`）
- ✅ 访客页面重定向（`guestOnly`）
- ✅ 登录后跳转回原页面（`redirect` query）

### ✅ 7. 应用根组件 (`src/App.vue`)
- 🧭 集成导航栏组件
- 📱 响应式布局
- 🎨 保持原有样式系统

---

## 🔧 技术细节

### 认证流程

#### 1. 注册流程
```
用户填写表单 → 前端验证 → POST /auth/register
→ 后端返回 token → 保存 token 到 localStorage
→ 自动调用 GET /auth/me 获取用户信息
→ 跳转到首页
```

#### 2. 登录流程
```
用户填写表单 → 前端验证 → POST /auth/login
→ 后端返回 token → 保存 token 到 localStorage
→ 自动调用 GET /auth/me 获取用户信息
→ 跳转到首页
```

#### 3. 会话恢复流程
```
页面加载 → 路由守卫检查 localStorage 中的 token
→ 如果存在 token 但无用户信息
→ 调用 GET /auth/me 恢复用户信息
→ 如果失败则清除 token
```

#### 4. 权限验证流程
```
用户访问页面 → 路由守卫检查 meta 信息
→ requiresAuth: 检查是否登录
→ requiresAdmin: 检查是否为管理员
→ guestOnly: 已登录用户重定向到首页
```

### API 拦截器

#### 请求拦截
```typescript
// 自动添加 Authorization header
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
```

#### 响应拦截
```typescript
// 401: Token 过期/无效 → 清除 token → 跳转登录页
// 403: 权限不足 → 提示用户
```

---

## 🎨 UI/UX 特性

### 1. 角色颜色标识
- **ADMIN**: 🔴 红色（`bg-red-100 text-red-800`）
- **MEMBER**: 🔵 蓝色（`bg-blue-100 text-blue-800`）
- **READER**: ⚪ 灰色（`bg-gray-100 text-gray-800`）

### 2. 用户头像
- 优先使用用户上传的头像 URL
- 默认使用 UI Avatars API 生成头像
- 显示用户名首字母

### 3. 加载状态
- 表单提交时显示加载动画
- 禁用按钮防止重复提交
- 友好的加载文本提示

### 4. 错误处理
- 红色边框高亮错误字段
- 错误信息显示在表单上方
- 网络错误友好提示

---

## 📂 文件结构

```
src/
├── services/
│   └── api.ts                 # API 服务封装
├── stores/
│   ├── auth.ts                # 认证状态管理
│   └── comments.ts            # 评论状态管理（已存在）
├── pages/
│   ├── Login.vue              # 登录页面 ✨ 新增
│   ├── Register.vue           # 注册页面 ✨ 新增
│   ├── AdminUsers.vue         # 用户管理页面 ✨ 新增
│   ├── VotePage.vue           # 投票页面 ✅ 已更新
│   ├── Home.vue               # 首页（已存在）
│   └── NewsDetails.vue        # 新闻详情（已存在）
├── components/
│   └── NavBar.vue             # 导航栏组件 ✨ 新增
├── router/
│   └── index.ts               # 路由配置 ✅ 已更新
├── types.ts                   # 类型定义 ✅ 已更新
└── App.vue                    # 根组件 ✅ 已更新
```

---

## 🔑 关键代码示例

### 1. 如何检查用户角色

```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 检查是否已登录
if (authStore.isAuthenticated) {
  // 用户已登录
}

// 检查是否为管理员
if (authStore.isAdmin) {
  // 显示管理员功能
}

// 检查是否为会员
if (authStore.isMember) {
  // 允许发布内容
}
```

### 2. 如何获取当前用户信息

```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 获取用户对象
const user = authStore.user
// { id: 1, email: '...', name: '...', roles: [...] }

// 获取显示名称
const name = authStore.displayName

// 获取头像 URL
const avatar = authStore.avatarUrl
```

### 3. 如何调用 API

```typescript
import { authService, adminService } from '@/services/api'

// 登录
try {
  await authStore.login({ email, password })
  router.push('/')
} catch (error) {
  console.error(error.message)
}

// 获取所有用户（管理员）
try {
  const users = await adminService.getAllUsers()
  console.log(users)
} catch (error) {
  console.error(error.message)
}
```

---

## 🚀 使用说明

### 启动项目

```bash
# 启动前端开发服务器
npm run dev

# 启动 JSON Server (评论数据)
npm run api

# 同时启动两者
npm run start:all
```

### 测试账号

```
管理员:
邮箱: admin@local
密码: admin123
```

### 访问页面

- 首页: http://localhost:5173/
- 登录: http://localhost:5173/login
- 注册: http://localhost:5173/register
- 用户管理: http://localhost:5173/admin/users (需要 ADMIN)

---

## ⚠️ 注意事项

### 1. 后端服务
确保后端服务运行在 `http://localhost:8080`

### 2. Token 存储
- Token 存储在 `localStorage` 中
- 用户信息缓存在 `localStorage` 中
- 退出登录时自动清除

### 3. 会话恢复
- 刷新页面会自动恢复登录状态
- Token 有效期为 24 小时
- 过期后需要重新登录

### 4. 权限控制
- `/vote/:id` 需要登录才能访问
- `/admin/users` 需要 ADMIN 角色
- `/login` 和 `/register` 已登录用户无法访问

### 5. 代码优化
- ✅ 避免重复调用 `restoreSession()`
- ✅ 只在路由守卫中恢复会话
- ✅ 移除 App.vue 中的重复调用

---

## 🔄 与后端的字段对应

### User 实体
| 后端字段 | 前端字段 | 类型 | 说明 |
|---------|---------|------|------|
| `id` | `id` | `number` | 用户 ID |
| `email` | `email` | `string` | 邮箱（登录凭证） |
| `name` | `name` | `string` | 显示名称 |
| `imageUrl` | `imageUrl` | `string?` | 头像 URL（可选） |
| `roles` | `roles` | `Role[]` | 角色数组 |

### 认证响应
| 后端字段 | 前端字段 | 类型 | 说明 |
|---------|---------|------|------|
| `token` | `token` | `string` | JWT token |

### 注意
✅ **完全匹配**: 使用驼峰命名（`imageUrl`）而不是下划线（`image_url`）

---

## 📝 TODO（可选优化）

- [ ] 添加 Token 自动刷新机制
- [ ] 添加"记住我"功能
- [ ] 实现密码强度检测
- [ ] 添加"忘记密码"功能
- [ ] 添加邮箱验证功能
- [ ] 优化错误提示（多语言支持）
- [ ] 添加用户资料编辑页面
- [ ] 实现更细粒度的权限控制

---

## 🎉 总结

本次集成完成了以下核心功能：

1. ✅ 完整的用户认证系统（登录、注册、登出）
2. ✅ 基于角色的权限控制（READER、MEMBER、ADMIN）
3. ✅ 路由守卫和会话管理
4. ✅ 用户管理界面（管理员功能）
5. ✅ 响应式导航栏和用户信息展示
6. ✅ 与后端 API 完全对接
7. ✅ 优化代码，避免重复调用

所有代码都遵循 Vue 3 + TypeScript + Pinia 最佳实践，并与后端字段完全匹配！🚀
