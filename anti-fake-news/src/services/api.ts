// src/services/api.ts
import type { User, RegisterRequest, LoginRequest, AuthResponse, Role } from '@/types'

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
     * @param data 注册信息 (email, name, password, imageUrl?)
     * @returns JWT token
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

        return response.json()
    },

    /**
     * 用户登录
     * @param data 登录信息 (email, password)
     * @returns JWT token
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

        return response.json()
    },

    /**
     * 获取当前用户信息 (需要认证)
     * @returns 当前用户完整信息
     */
    async getCurrentUser(): Promise<User> {
        const response = await fetchWithAuth(`${API_BASE_URL}/auth/me`)

        if (!response.ok) {
            throw new Error('Failed to get current user')
        }

        return response.json()
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
     * @returns 用户列表
     */
    async getAllUsers(): Promise<User[]> {
        const response = await fetchWithAuth(`${API_BASE_URL}/admin/users`)

        if (!response.ok) {
            throw new Error('Failed to get users')
        }

        return response.json()
    },

    /**
     * 更新用户角色 (需要 ADMIN 角色)
     * @param userId 用户 ID
     * @param role 目标角色 (READER | MEMBER | ADMIN)
     * @returns 更新结果消息
     */
    async updateUserRole(userId: number, role: Role): Promise<string> {
        const response = await fetchWithAuth(
            `${API_BASE_URL}/admin/users/${userId}/role?role=${role}`,
            { method: 'PATCH' }
        )

        if (!response.ok) {
            throw new Error('Failed to update user role')
        }

        return response.text()
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
