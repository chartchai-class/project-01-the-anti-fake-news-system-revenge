// src/services/api.ts
import type { 
    User, RegisterRequest, LoginRequest, AuthResponse, Role,
    NewsItem, NewsCreateRequest, NewsStatus,
    Comment, CommentCreateRequest,
    VoteRequest, VoteResponse
} from '@/types'

// 从环境变量读取后端 API 地址（支持开发和生产环境）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// ==================== Axios 拦截器配置 ====================
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem('token')
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
    }

    const response = await fetch(url, {
        ...options,
        headers
    })

    // 处理 401 错误
    if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('currentUser')
        window.location.href = '/login'
        throw new Error('Unauthorized - Token expired or invalid')
    }

    // 处理 403 错误
    if (response.status === 403) {
        alert('您没有权限执行此操作')
        throw new Error('Forbidden - Insufficient permissions')
    }

    return response
}

// ==================== 认证 API ====================
export const authService = {
    /**
     * 用户注册
     * 后端端点：POST /auth/register
     * @param data 注册信息 (email, name, password, imageUrl?)
     * @returns { success: boolean, data: { token: string } }
     */
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(error || 'Registration failed')
        }

        const result = await response.json()
        // 后端返回 { success: true, data: { token: "..." } }
        return result.data || result
    },

    /**
     * 用户登录
     * 后端端点：POST /auth/login
     * @param data 登录信息 (email, password)
     * @returns { success: boolean, data: { token: string } }
     */
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(error || 'Login failed')
        }

        const result = await response.json()
        // 后端返回 { success: true, data: { token: "..." } }
        return result.data || result
    },

    /**
     * 获取当前用户信息 (需要认证)
     * 后端端点：GET /auth/me
     * @returns User对象 (不包含password)
     */
    async getCurrentUser(): Promise<User> {
        const response = await fetchWithAuth(`${API_BASE_URL}/auth/me`)

        if (!response.ok) {
            throw new Error('Failed to get current user')
        }

        const result = await response.json()
        // 后端返回 { success: true, data: User对象 }
        return result.data || result
    },

    /**
     * 登出 (清除本地 token)
     */
    logout(): void {
        localStorage.removeItem('token')
        localStorage.removeItem('currentUser')
    }
}

// ==================== 管理员 API ====================
export const adminService = {
    /**
     * 获取所有用户列表 (需要 ADMIN 角色)
     * 后端端点：GET /admin/users
     * @returns User列表
     */
    async getAllUsers(): Promise<User[]> {
        const response = await fetchWithAuth(`${API_BASE_URL}/admin/users`)

        if (!response.ok) {
            throw new Error('Failed to get users')
        }

        const result = await response.json()
        return result.data || result
    },

    /**
     * 更新用户角色 (需要 ADMIN 角色)
     * 后端端点：PUT /admin/users/{id}/role?role={role}
     * @param userId 用户 ID
     * @param role 目标角色 (READER | MEMBER | ADMIN)
     * @returns 更新结果消息
     */
    async updateUserRole(userId: number, role: Role): Promise<string> {
        const response = await fetchWithAuth(
            `${API_BASE_URL}/admin/users/${userId}/role?role=${role}`,
            { method: 'PUT' }
        )

        if (!response.ok) {
            throw new Error('Failed to update user role')
        }

        return response.text()
    },

    /**
     * 获取所有新闻（包括已删除）- ADMIN专用
     * 后端端点：GET /admin/news
     */
    async getAllNews(): Promise<NewsItem[]> {
        const response = await fetchWithAuth(`${API_BASE_URL}/admin/news`)

        if (!response.ok) {
            throw new Error('Failed to get all news')
        }

        const result = await response.json()
        return result.data || result
    }
}

// ==================== 工具函数 ====================
export const roleUtils = {
    /**
     * 检查用户是否拥有指定角色
     */
    hasRole(user: User | null, role: Role): boolean {
        return user?.roles.includes(role) ?? false
    },

    /**
     * 检查用户是否为管理员
     */
    isAdmin(user: User | null): boolean {
        return this.hasRole(user, 'ADMIN')
    },

    /**
     * 检查用户是否为会员
     */
    isMember(user: User | null): boolean {
        return this.hasRole(user, 'MEMBER')
    },

    /**
     * 检查用户是否已登录
     */
    isAuthenticated(user: User | null): boolean {
        return user !== null && user.roles.length > 0
    }
}

// ==================== 新闻 API ====================
export const newsService = {
    /**
     * 获取新闻列表（支持搜索、分页、过滤）
     * 后端端点：GET /news
     * @param params { page?, size?, search?, status? }
     */
    async getAll(params?: {
        page?: number
        size?: number
        search?: string          // 搜索关键词（搜索标题/简介/报料人）
        status?: NewsStatus
    }): Promise<{ content: NewsItem[], totalElements: number, totalPages: number }> {
        const searchParams = new URLSearchParams()
        if (params?.page !== undefined) searchParams.set('page', String(params.page))
        if (params?.size) searchParams.set('size', String(params.size))
        if (params?.search) searchParams.set('search', params.search)
        if (params?.status) searchParams.set('status', params.status)
        
        const response = await fetchWithAuth(`${API_BASE_URL}/news?${searchParams}`)
        if (!response.ok) throw new Error('Failed to get news list')
        
        // 后端响应格式：{ success: boolean, data: NewsItem[], message?: string }
        // 响应头 X-Total-Count 包含总数
        const totalCount = response.headers.get('X-Total-Count')
        const data = await response.json()
        
        return {
            content: data.data || [],
            totalElements: totalCount ? parseInt(totalCount) : 0,
            totalPages: Math.ceil((totalCount ? parseInt(totalCount) : 0) / (params?.size || 10))
        }
    },

    /**
     * 获取新闻详情
     * 后端端点：GET /news/{id}
     */
    async getById(id: number): Promise<NewsItem> {
        const response = await fetchWithAuth(`${API_BASE_URL}/news/${id}`)
        if (!response.ok) throw new Error('Failed to get news')
        const result = await response.json()
        return result.data || result
    },

    /**
     * 创建新闻（MEMBER/ADMIN）
     * 后端端点：POST /news
     */
    async create(data: NewsCreateRequest): Promise<NewsItem> {
        const response = await fetchWithAuth(`${API_BASE_URL}/news`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to create news')
        const result = await response.json()
        return result.data || result
    }
}

// ==================== 评论 API ====================
export const commentService = {
    /**
     * 获取新闻的评论列表
     * 后端端点：GET /news/{newsId}/comments
     * @param params { page?, size?, includeDeleted? }
     */
    async getByNewsId(
        newsId: number, 
        params?: { page?: number, size?: number, includeDeleted?: boolean }
    ): Promise<{ content: Comment[], totalElements: number }> {
        const searchParams = new URLSearchParams()
        if (params?.page !== undefined) searchParams.set('page', String(params.page))
        if (params?.size) searchParams.set('size', String(params.size))
        if (params?.includeDeleted) searchParams.set('includeDeleted', 'true')
        
        const response = await fetchWithAuth(`${API_BASE_URL}/news/${newsId}/comments?${searchParams}`)
        if (!response.ok) throw new Error('Failed to get comments')
        
        const result = await response.json()
        const totalCount = response.headers.get('X-Total-Count')
        
        return {
            content: result.data || [],
            totalElements: totalCount ? parseInt(totalCount) : 0
        }
    },

    /**
     * 发表评论（登录用户）
     * 后端端点：POST /news/{newsId}/comments
     */
    async create(newsId: number, data: CommentCreateRequest): Promise<Comment> {
        const response = await fetchWithAuth(`${API_BASE_URL}/news/${newsId}/comments`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to create comment')
        const result = await response.json()
        return result.data || result
    },

    /**
     * 删除评论（作者或ADMIN）
     * 后端端点：DELETE /news/{newsId}/comments/{commentId}
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
     * 投票（登录用户）
     * 后端端点：POST /news/{newsId}/votes
     */
    async submit(newsId: number, data: VoteRequest): Promise<void> {
        const response = await fetchWithAuth(`${API_BASE_URL}/news/${newsId}/votes`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to submit vote')
    },

    /**
     * 获取投票统计
     * 后端端点：GET /news/{newsId}/votes
     * 响应格式：{ newsId, fakeCount, notFakeCount, myVote? }
     */
    async getStats(newsId: number): Promise<VoteResponse> {
        const response = await fetchWithAuth(`${API_BASE_URL}/news/${newsId}/votes`)
        if (!response.ok) throw new Error('Failed to get vote stats')
        const result = await response.json()
        return result.data || result
    },

    /**
     * 撤销投票（作者或ADMIN）
     * 后端端点：DELETE /news/{newsId}/votes/{voteId}
     */
    async delete(newsId: number, voteId: number): Promise<void> {
        const response = await fetchWithAuth(`${API_BASE_URL}/news/${newsId}/votes/${voteId}`, {
            method: 'DELETE'
        })
        if (!response.ok) throw new Error('Failed to delete vote')
    }
}
