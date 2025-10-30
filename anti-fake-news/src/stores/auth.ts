// src/stores/auth.ts
import { defineStore } from 'pinia'
import type { User, RegisterRequest, LoginRequest } from '@/types'
import { authService, roleUtils } from '@/services/api'

interface AuthState {
    user: User | null
    token: string | null
    loading: boolean
    error: string | null
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        token: localStorage.getItem('token'),
        loading: false,
        error: null
    }),

    getters: {
        /**
         * 用户是否已登录
         */
        isAuthenticated: (state): boolean => {
            return !!state.token && !!state.user
        },

        /**
         * 当前用户是否为管理员
         */
        isAdmin: (state): boolean => {
            return roleUtils.isAdmin(state.user)
        },

        /**
         * 当前用户是否为会员 (可发布内容)
         */
        isMember: (state): boolean => {
            return roleUtils.isMember(state.user)
        },

        /**
         * 当前用户是否为只读用户
         */
        isReader: (state): boolean => {
            return roleUtils.hasRole(state.user, 'READER')
        },

        /**
         * 获取用户显示名称
         */
        displayName: (state): string => {
            return state.user?.name || 'Guest'
        },

        /**
         * 获取用户头像 URL (带默认值)
         */
        avatarUrl: (state): string => {
            return state.user?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(state.user?.name || 'U')}&background=random`
        }
    },

    actions: {
        /**
         * 用户注册
         */
        async register(data: RegisterRequest): Promise<void> {
            this.loading = true
            this.error = null

            try {
                const response = await authService.register(data)
                this.token = response.token
                localStorage.setItem('token', response.token)

                // 注册成功后自动获取用户信息
                await this.fetchCurrentUser()
            } catch (err) {
                this.error = err instanceof Error ? err.message : 'Registration failed'
                throw err
            } finally {
                this.loading = false
            }
        },

        /**
         * 用户登录
         */
        async login(data: LoginRequest): Promise<void> {
            this.loading = true
            this.error = null

            try {
                const response = await authService.login(data)
                this.token = response.token
                localStorage.setItem('token', response.token)

                // 登录成功后自动获取用户信息
                await this.fetchCurrentUser()
            } catch (err) {
                this.error = err instanceof Error ? err.message : 'Login failed'
                throw err
            } finally {
                this.loading = false
            }
        },

        /**
         * 获取当前用户信息
         */
        async fetchCurrentUser(): Promise<void> {
            if (!this.token) {
                return
            }

            this.loading = true
            this.error = null

            try {
                this.user = await authService.getCurrentUser()
                // 缓存用户信息
                localStorage.setItem('currentUser', JSON.stringify(this.user))
            } catch (err) {
                this.error = err instanceof Error ? err.message : 'Failed to fetch user'
                // 如果获取失败，清除 token
                this.logout()
                throw err
            } finally {
                this.loading = false
            }
        },

        /**
         * 用户登出
         */
        logout(): void {
            this.user = null
            this.token = null
            this.error = null
            authService.logout()
        },

        /**
         * 从 localStorage 恢复用户信息
         */
        async restoreSession(): Promise<void> {
            const token = localStorage.getItem('token')
            const cachedUser = localStorage.getItem('currentUser')

            if (token) {
                this.token = token

                // 先使用缓存的用户信息
                if (cachedUser) {
                    try {
                        this.user = JSON.parse(cachedUser)
                    } catch {
                        // 忽略解析错误
                    }
                }

                // 然后尝试刷新用户信息
                try {
                    await this.fetchCurrentUser()
                } catch {
                    // 如果刷新失败，使用缓存的信息或清空
                    if (!this.user) {
                        this.logout()
                    }
                }
            }
        },

        /**
         * 清除错误信息
         */
        clearError(): void {
            this.error = null
        }
    }
})
