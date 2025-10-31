// ==================== 枚举类型 ====================
export type Role = 'READER' | 'MEMBER' | 'ADMIN'
export type NewsStatus = 'FAKE' | 'NON_FAKE' | 'UNKNOWN'  // 后端实际状态
export type VoteValue = 'FAKE' | 'NOT_FAKE'  // 后端投票值

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

export interface UpdateProfileRequest {
    name?: string
    imageUrl?: string
    currentPassword?: string
    newPassword?: string
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
    id: number                    // 后端 Long
    title: string                 // 后端 title
    shortDetail: string           // 后端 shortDetail (最多500字符)
    fullDetail: string            // 后端 fullDetail (TEXT/Lob)
    imageUrls: string[]           // 后端 List<String>
    reporterName: string          // 后端 reporterName (报料人姓名)
    createdBy: string             // 后端 createdBy (创建者email)
    status: NewsStatus            // 后端 NewsStatus: FAKE/NON_FAKE/UNKNOWN
    deleted: boolean              // 后端 deleted (软删除标记)
    createdAt: string             // 后端 createdAt (LocalDateTime)
    deletedAt?: string            // 后端 deletedAt (可选)
}

export interface NewsCreateRequest {
    title: string                 // @NotBlank
    shortDetail: string           // @NotBlank
    fullDetail: string            // @NotBlank
    reporterName: string          // @NotBlank
    imageUrls?: string[]          // 可选
    status?: NewsStatus           // 可选，默认 UNKNOWN
}

export interface NewsUpdateRequest {
    title?: string
    shortDetail?: string
    fullDetail?: string
    reporterName?: string
    imageUrls?: string[]
    status?: NewsStatus
}

// ==================== 评论相关类型 ====================
export interface Comment {
    id: number                    // 后端 Long
    newsId: number                // 后端 newsId (扁平结构)
    authorId: number              // 后端 authorId
    authorName: string            // 后端 authorName (扁平字符串，非对象)
    content: string               // 后端 content (TEXT)
    imageUrl?: string             // 后端 imageUrl (可选)
    createdAt: string             // 后端 createdAt (LocalDateTime)
    deleted: boolean              // 后端 deleted (软删除)
}

export interface CommentCreateRequest {
    content: string               // @NotBlank
    imageUrl?: string             // 可选
}

// ==================== 投票相关类型 ====================
export interface Vote {
    id: number                    // 后端 Long
    value: VoteValue              // 后端 VoteValue: FAKE/NOT_FAKE
    user: {                       // 后端 User 对象
        id: number
        name: string
        email: string
    }
    news: {                       // 后端 News 对象
        id: number
        title: string
    }
    deleted: boolean              // 后端 deleted (软删除)
    createdAt: string             // 后端 Instant
}

export interface VoteRequest {
    value: VoteValue              // FAKE 或 NOT_FAKE
}

export interface VoteResponse {
    newsId: number
    fakeCount: number             // 后端 fakeCount
    notFakeCount: number          // 后端 notFakeCount
    myVote?: VoteValue            // 当前用户的投票（未投则为null）
}
