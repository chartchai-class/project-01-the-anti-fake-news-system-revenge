# 🔄 后端集成核对清单

根据后端 Copilot 提供的完整实现，本文档核对前后端字段对齐情况。

---

## ✅ 第一部分：后端已实现的接口

### 1️⃣ **News 模块（6个端点）**

```java
GET    /news                      // 获取新闻列表（公开，支持搜索、分页、过滤）
GET    /news/{id}                 // 获取新闻详情（公开）
POST   /news                      // 发布新闻（MEMBER/ADMIN）
PATCH  /news/{id}                 // 更新新闻（作者/ADMIN）
DELETE /news/{id}                 // 删除新闻（ADMIN，软删除）
PATCH  /news/{id}/status          // 审核新闻（ADMIN）
```

### 2️⃣ **Comment 模块（3个端点）**

```java
GET    /news/{newsId}/comments              // 获取评论列表（公开）
POST   /news/{newsId}/comments              // 发表评论（登录用户）
DELETE /news/{newsId}/comments/{commentId}  // 删除评论（作者/ADMIN）
```

### 3️⃣ **Vote 模块（2个端点）**

```java
POST   /news/{newsId}/vote         // 投票（登录用户，唯一约束）
GET    /news/{newsId}/vote         // 获取投票统计（公开）
```

---

## 📋 第二部分：字段对齐核对表

### 🔴 **关键字段差异（需要修改）**

#### 1. NewsItem / News Entity

| 字段 | 前端当前 | 后端实际 | 状态 | 操作 |
|------|---------|---------|------|------|
| `id` | `string` | `Long` (number) | ⚠️ | 改为 `number` |
| `topic` | ✅ | `title` | ❌ | 改为 `title` |
| `shortDetail` | ✅ | `summary` | ❌ | 改为 `summary` |
| `fullDetail` | ✅ | `content` | ❌ | 改为 `content` |
| `reporter` | `string` | `author` (User对象) | ❌ | 改为 `author: { id, name, email, imageUrl }` |
| `reportedAt` | ✅ | `createdAt` | ⚠️ | 改为 `createdAt` |
| `imageUrl` | ✅ | ✅ | ✅ | 无需修改 |
| `fakeVotes` | ✅ | `fakeVotes` | ✅ | 无需修改 |
| `nonFakeVotes` | ✅ | `trueVotes` | ❌ | 改为 `trueVotes` |
| - | - | `status` (PENDING/APPROVED/REJECTED) | ❌ | **新增字段** |
| - | - | `isDeleted` (boolean) | ❌ | **新增字段** |
| - | - | `updatedAt` | ❌ | **新增字段** |

#### 2. Comment Entity

| 字段 | 前端当前 | 后端实际 | 状态 | 操作 |
|------|---------|---------|------|------|
| `id` | `string` | `Long` (number) | ⚠️ | 改为 `number` |
| `username` | `string` | `author` (User对象) | ❌ | 改为 `author: { id, name, imageUrl }` |
| `comment` | ✅ | `content` | ❌ | 改为 `content` |
| `imageUrl` | ✅ | ❌ | ⚠️ | 后端无此字段，需从 `author.imageUrl` 获取 |
| `createdAt` | ✅ | ✅ | ✅ | 无需修改 |
| `vote` | `'fake' \| 'real'` | ❌ | ❌ | **删除此字段**（评论不含投票类型） |
| - | - | `news` (News对象) | ❌ | **新增字段** |
| - | - | `isDeleted` | ❌ | **新增字段** |

#### 3. Vote Entity

| 字段 | 前端当前 | 后端实际 | 状态 | 操作 |
|------|---------|---------|------|------|
| `id` | `string` | `Long` (number) | ⚠️ | 改为 `number` |
| `newsId` | `string` | `news` (News对象) | ❌ | 改为 `news: { id }` 或仅 `newsId: number` |
| `userId` | `string` | `user` (User对象) | ❌ | 改为 `user: { id, name }` |
| `vote` | `'fake' \| 'real'` | `voteType` (TRUE_NEWS/FAKE_NEWS) | ❌ | 改为 `voteType: 'TRUE_NEWS' \| 'FAKE_NEWS'` |
| `comment` | ✅ | ❌ | ❌ | **删除此字段**（投票不含评论） |
| `imageUrl` | ✅ | ❌ | ❌ | **删除此字段** |
| `createdAt` | ✅ | ✅ | ✅ | 无需修改 |
| - | - | `updatedAt` | ❌ | **新增字段** |

#### 4. NewsStatus / Status Enum

| 前端当前 | 后端实际 | 状态 | 操作 |
|---------|---------|------|------|
| `'fake' \| 'non-fake' \| 'unknown'` | `'PENDING' \| 'APPROVED' \| 'REJECTED'` | ❌ | **完全重新定义** |

**说明**：
- 前端的 `NewsStatus` 是**投票结果状态**（从投票比例计算）
- 后端的 `Status` 是**审核状态**（管理员审核）
- 需要分离为两个不同的字段：`status`（审核）和动态计算的投票比例

---

## 🔧 第三部分：前端需要修改的文件

### 1. 更新 `src/types.ts`

需要重新定义所有类型以匹配后端：

```typescript
// ==================== 枚举类型 ====================
export type Role = 'READER' | 'MEMBER' | 'ADMIN'
export type NewsStatus = 'PENDING' | 'APPROVED' | 'REJECTED'  // 审核状态
export type VoteType = 'TRUE_NEWS' | 'FAKE_NEWS'

// ==================== 认证相关（已对齐）====================
export interface User {
    id: number          // ✅
    email: string       // ✅
    name: string        // ✅
    imageUrl?: string   // ✅
    roles: Role[]       // ✅
}

// ==================== 新闻相关（需修改）====================
export interface NewsItem {
    id: number                    // ✅ 改为 number
    title: string                 // ❌ 改为 title（原 topic）
    summary: string               // ❌ 改为 summary（原 shortDetail）
    content: string               // ❌ 改为 content（原 fullDetail）
    imageUrl?: string             // ✅
    author: {                     // ❌ 改为对象（原 reporter）
        id: number
        name: string
        email: string
        imageUrl?: string
    }
    status: NewsStatus            // ❌ 新增：审核状态
    fakeVotes: number             // ✅
    trueVotes: number             // ❌ 改为 trueVotes（原 nonFakeVotes）
    isDeleted: boolean            // ❌ 新增：软删除标记
    createdAt: string             // ✅ 改为 createdAt（原 reportedAt）
    updatedAt: string             // ❌ 新增
}

export interface NewsCreateRequest {
    title: string                 // @NotBlank
    summary: string               // @NotBlank
    content: string               // @NotBlank
    imageUrl?: string             // 可选
}

export interface NewsUpdateRequest {
    title?: string
    summary?: string
    content?: string
    imageUrl?: string
}

// ==================== 评论相关（需修改）====================
export interface Comment {
    id: number                    // ✅ 改为 number
    content: string               // ❌ 改为 content（原 comment）
    author: {                     // ❌ 改为对象（原 username）
        id: number
        name: string
        imageUrl?: string
    }
    news: {                       // ❌ 新增
        id: number
        title: string
    }
    isDeleted: boolean            // ❌ 新增
    createdAt: string             // ✅
}

export interface CommentCreateRequest {
    content: string               // @NotBlank
}

// ==================== 投票相关（需修改）====================
export interface Vote {
    id: number                    // ✅ 改为 number
    voteType: VoteType            // ❌ 改为 voteType: 'TRUE_NEWS' | 'FAKE_NEWS'
    user: {                       // ❌ 改为对象
        id: number
        name: string
    }
    news: {                       // ❌ 改为对象
        id: number
        title: string
    }
    createdAt: string             // ✅
    updatedAt: string             // ❌ 新增
}

export interface VoteRequest {
    voteType: VoteType            // TRUE_NEWS 或 FAKE_NEWS
}

export interface VoteResponse {
    trueVotes: number             // 真实新闻票数
    fakeVotes: number             // 假新闻票数
    totalVotes: number            // 总票数
}
```

### 2. 更新 `src/services/api.ts`

需要添加完整的 `newsService`, `commentService`, `voteService`：

```typescript
// ==================== 新闻 API ====================
export const newsService = {
    /**
     * 获取新闻列表（支持搜索、分页、过滤）
     * @param params { page?, size?, keyword?, status? }
     */
    async getAll(params?: {
        page?: number
        size?: number
        keyword?: string
        status?: NewsStatus
    }): Promise<{ content: NewsItem[], totalElements: number, totalPages: number }> {
        const searchParams = new URLSearchParams()
        if (params?.page) searchParams.set('page', String(params.page))
        if (params?.size) searchParams.set('size', String(params.size))
        if (params?.keyword) searchParams.set('keyword', params.keyword)
        if (params?.status) searchParams.set('status', params.status)
        
        const response = await fetchWithAuth(`${API_BASE_URL}/news?${searchParams}`)
        if (!response.ok) throw new Error('Failed to get news list')
        return response.json()
    },

    /**
     * 获取新闻详情
     */
    async getById(id: number): Promise<NewsItem> {
        const response = await fetchWithAuth(`${API_BASE_URL}/news/${id}`)
        if (!response.ok) throw new Error('Failed to get news')
        return response.json()
    },

    /**
     * 创建新闻（MEMBER/ADMIN）
     */
    async create(data: NewsCreateRequest): Promise<NewsItem> {
        const response = await fetchWithAuth(`${API_BASE_URL}/news`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to create news')
        return response.json()
    },

    /**
     * 更新新闻（作者或ADMIN）
     */
    async update(id: number, data: NewsUpdateRequest): Promise<NewsItem> {
        const response = await fetchWithAuth(`${API_BASE_URL}/news/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to update news')
        return response.json()
    },

    /**
     * 删除新闻（ADMIN，软删除）
     */
    async delete(id: number): Promise<void> {
        const response = await fetchWithAuth(`${API_BASE_URL}/news/${id}`, {
            method: 'DELETE'
        })
        if (!response.ok) throw new Error('Failed to delete news')
    },

    /**
     * 审核新闻（ADMIN）
     */
    async updateStatus(id: number, status: NewsStatus): Promise<NewsItem> {
        const response = await fetchWithAuth(`${API_BASE_URL}/news/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        })
        if (!response.ok) throw new Error('Failed to update news status')
        return response.json()
    }
}

// ==================== 评论 API ====================
export const commentService = {
    /**
     * 获取新闻的评论列表
     */
    async getByNewsId(newsId: number): Promise<Comment[]> {
        const response = await fetchWithAuth(`${API_BASE_URL}/news/${newsId}/comments`)
        if (!response.ok) throw new Error('Failed to get comments')
        return response.json()
    },

    /**
     * 发表评论（登录用户）
     */
    async create(newsId: number, data: CommentCreateRequest): Promise<Comment> {
        const response = await fetchWithAuth(`${API_BASE_URL}/news/${newsId}/comments`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to create comment')
        return response.json()
    },

    /**
     * 删除评论（作者或ADMIN）
     */
    async delete(newsId: number, commentId: number): Promise<void> {
        const response = await fetchWithAuth(`${API_BASE_URL}/news/${newsId}/comments/${commentId}`, {
            method: 'DELETE'
        })
        if (!response.ok) throw new Error('Failed to delete comment')
    }
}

// ==================== 投票 API ====================
export const voteService = {
    /**
     * 投票（登录用户，每用户每新闻仅一票）
     */
    async submit(newsId: number, data: VoteRequest): Promise<void> {
        const response = await fetchWithAuth(`${API_BASE_URL}/news/${newsId}/vote`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to submit vote')
    },

    /**
     * 获取投票统计
     */
    async getStats(newsId: number): Promise<VoteResponse> {
        const response = await fetchWithAuth(`${API_BASE_URL}/news/${newsId}/vote`)
        if (!response.ok) throw new Error('Failed to get vote stats')
        return response.json()
    }
}
```

### 3. 更新 Vue 组件

需要更新以下组件：

- ✅ `src/pages/Home.vue` - 新闻列表（使用 `newsService.getAll()`）
- ✅ `src/pages/NewsDetails.vue` - 新闻详情（使用 `newsService.getById()`）
- ✅ `src/pages/VotePage.vue` - 投票页面（使用 `voteService.submit()`）
- ✅ `src/components/NewsCard.vue` - 新闻卡片（字段改为 `title`, `summary`, `author.name`）
- ✅ `src/components/CommentList.vue` - 评论列表（使用 `commentService.getByNewsId()`）
- ✅ `src/components/VoteSummary.vue` - 投票统计（使用 `voteService.getStats()`）

---

## 🚨 第四部分：关键差异说明

### 1. **新闻状态的双重含义**

**后端设计**：
- `status` 字段：`PENDING` | `APPROVED` | `REJECTED`（管理员审核状态）
- `fakeVotes` 和 `trueVotes`：投票计数

**前端需求**：
- 显示审核状态（PENDING/APPROVED/REJECTED）
- 动态计算投票比例：`trueVotes / (trueVotes + fakeVotes)` > 0.5 显示为"真实"

### 2. **评论不包含投票信息**

后端的 `Comment` 实体**不含** `vote` 字段。投票是独立的 `Vote` 实体。

**修正**：删除前端 `Comment` 接口中的 `vote` 字段。

### 3. **投票的唯一性约束**

后端数据库有唯一约束：`(news_id, user_id)`
- 用户首次投票：创建新记录
- 用户再次投票：更新 `voteType`（从 TRUE_NEWS 改为 FAKE_NEWS 或反之）
- 自动重新计算 `fakeVotes` 和 `trueVotes`

### 4. **软删除模式**

所有删除操作设置 `isDeleted = true`，**不是真删除**。
- 查询时自动过滤 `isDeleted = true` 的记录
- 前端无需特殊处理（后端已过滤）

---

## ✅ 第五部分：立即行动计划

### 步骤 1：更新类型定义 ⏳
```bash
# 修改 src/types.ts
- 所有 id 改为 number
- topic → title
- shortDetail → summary
- fullDetail → content
- reporter → author (对象)
- reportedAt → createdAt
- nonFakeVotes → trueVotes
- 添加 status, isDeleted, updatedAt
```

### 步骤 2：添加后端服务 ⏳
```bash
# 修改 src/services/api.ts
- 添加 newsService（6个方法）
- 添加 commentService（3个方法）
- 添加 voteService（2个方法）
```

### 步骤 3：更新组件 ⏳
```bash
# 修改所有使用 NewsItem 的组件
- Home.vue
- NewsDetails.vue
- NewsCard.vue
- VotePage.vue
- CommentList.vue
- VoteSummary.vue
```

### 步骤 4：测试集成 ⏳
```bash
# 启动后端（已完成）
cd backend
./mvnw spring-boot:run

# 启动前端
cd anti-fake-news
npm run dev

# 测试所有端点
```

---

## 📊 字段映射速查表

| 前端旧字段 | 后端字段 | 前端新字段 | 类型变化 |
|-----------|---------|-----------|---------|
| `id: string` | `id: Long` | `id: number` | ✅ |
| `topic` | `title` | `title` | ✅ |
| `shortDetail` | `summary` | `summary` | ✅ |
| `fullDetail` | `content` | `content` | ✅ |
| `reporter: string` | `author: User` | `author: { id, name, email, imageUrl }` | ✅ |
| `reportedAt` | `createdAt` | `createdAt` | ✅ |
| `nonFakeVotes` | `trueVotes` | `trueVotes` | ✅ |
| - | `status` | `status: NewsStatus` | ❌ 新增 |
| - | `isDeleted` | `isDeleted: boolean` | ❌ 新增 |

---

**总结**：前后端字段需要大幅调整，但后端 API 已完全实现，前端只需按此文档修改即可对接成功！
