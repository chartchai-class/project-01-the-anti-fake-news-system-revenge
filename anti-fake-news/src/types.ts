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
