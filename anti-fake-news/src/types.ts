// ==================== 枚举类型 ====================
export type Role = 'READER' | 'MEMBER' | 'ADMIN'
export type NewsStatus = 'PENDING' | 'APPROVED' | 'REJECTED'  // 审核状态
export type VoteType = 'TRUE_NEWS' | 'FAKE_NEWS'

// ==================== 认证相关类型 ====================
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
    id: number              // 后端 Long
    title: string           // 后端 title（原前端 topic）
    summary: string         // 后端 summary（原前端 shortDetail）
    content: string         // 后端 content（原前端 fullDetail）
    imageUrl?: string
    author: {               // 后端 User 对象（原前端 reporter）
        id: number
        name: string
        email: string
        imageUrl?: string
    }
    status: NewsStatus      // 审核状态：PENDING/APPROVED/REJECTED
    fakeVotes: number
    trueVotes: number       // 后端 trueVotes（原前端 nonFakeVotes）
    isDeleted: boolean
    createdAt: string       // 后端 createdAt（原前端 reportedAt）
    updatedAt: string
}

export interface NewsCreateRequest {
    title: string           // @NotBlank
    summary: string         // @NotBlank
    content: string         // @NotBlank
    imageUrl?: string
}

export interface NewsUpdateRequest {
    title?: string
    summary?: string
    content?: string
    imageUrl?: string
}

// ==================== 评论相关类型 ====================
export interface Comment {
    id: number              // 后端 Long
    content: string         // 后端 content（原前端 comment）
    author: {               // 后端 User 对象（原前端 username）
        id: number
        name: string
        imageUrl?: string
    }
    news: {                 // 关联的新闻
        id: number
        title: string
    }
    isDeleted: boolean
    createdAt: string
}

export interface CommentCreateRequest {
    content: string         // @NotBlank
}

// ==================== 投票相关类型 ====================
export interface Vote {
    id: number              // 后端 Long
    voteType: VoteType      // TRUE_NEWS 或 FAKE_NEWS
    user: {
        id: number
        name: string
    }
    news: {
        id: number
        title: string
    }
    createdAt: string
    updatedAt: string
}

export interface VoteRequest {
    voteType: VoteType      // TRUE_NEWS 或 FAKE_NEWS
}

export interface VoteResponse {
    trueVotes: number
    fakeVotes: number
    totalVotes: number
}
