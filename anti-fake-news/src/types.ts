export type NewsStatus = 'fake' | 'non-fake' | 'unknown'

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
