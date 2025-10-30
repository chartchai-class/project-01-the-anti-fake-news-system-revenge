export type NewsStatus = 'fake' | 'non-fake' | 'unknown'

// ==================== 认证相关类型 ====================
export type Role = 'READER' | 'MEMBER' | 'ADMIN'

export interface User {
    id: number
    email: string
    name: string
    imageUrl?: string
    roles: Role[]
}

export interface RegisterRequest {
    email: string
    name: string
    password: string
    imageUrl?: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface AuthResponse {
    token: string
}

export interface ApiError {
    status: number
    message: string
}

// ==================== 新闻相关类型 ====================
export interface NewsItem {
    id: string
    topic: string
    shortDetail: string
    fullDetail: string
    reporter: string
    reportedAt: string   // ISO string
    imageUrl: string
    fakeVotes: number
    nonFakeVotes: number
}

export interface Comment {
    id: string
    username: string
    comment: string
    imageUrl?: string
    createdAt: string
    vote: 'fake' | 'real'
}

export interface Vote {
    id: string
    newsId: string
    userId: string
    vote: 'fake' | 'real'
    comment?: string
    imageUrl?: string
    createdAt: string
}
