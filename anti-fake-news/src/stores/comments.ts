// /src/stores/comments.ts
import { defineStore } from 'pinia'
import type { Comment, CommentCreateRequest } from '@/types'
import { commentService } from '@/services/api'

interface CommentsState {
    newsIdToComments: Record<string, Comment[]>
    loading: Record<string, boolean>
    error: Record<string, string | null>
    pageInfo: Record<string, { page: number; size: number; hasMore: boolean; total?: number }>
}

function getStorageKey(newsId: string | number): string {
    return `comments_${newsId}`
}

export const useCommentsStore = defineStore('comments', {
    state: (): CommentsState => ({
        newsIdToComments: {},
        loading: {},
        error: {},
        pageInfo: {},
    }),

    getters: {
        getByNewsId: (state) => (newsId: string | number): Comment[] =>
            state.newsIdToComments[String(newsId)] ?? [],
        isLoading: (state) => (newsId: string | number): boolean =>
            !!state.loading[String(newsId)],
        getError: (state) => (newsId: string | number): string | null =>
            state.error[String(newsId)] ?? null,
        getPageInfo: (state) => (newsId: string | number) =>
            state.pageInfo[String(newsId)] ?? { page: 0, size: 10, hasMore: true, total: 0 },
    },

    actions: {
        save(newsId: string | number): void {
            const key = String(newsId)
            const list = this.newsIdToComments[key] ?? []
            localStorage.setItem(getStorageKey(key), JSON.stringify(list))
        },

        loadFromStorage(newsId: string | number): void {
            const key = String(newsId)
            try {
                const stored = localStorage.getItem(getStorageKey(key))
                if (stored) {
                    this.newsIdToComments[key] = JSON.parse(stored) as Comment[]
                } else {
                    this.newsIdToComments[key] = this.newsIdToComments[key] ?? []
                }
            } catch {
                this.newsIdToComments[key] = this.newsIdToComments[key] ?? []
            }
        },

        // 使用 api.ts 的 commentService.getByNewsId
        async load(newsId: string | number, page = 0, size = 10): Promise<void> {
            const key = String(newsId)
            this.loading[key] = true
            this.error[key] = null

            try {
                const { content, totalElements } = await commentService.getByNewsId(Number(newsId), {
                    page,
                    size,
                })

                if (page === 0) {
                    this.newsIdToComments[key] = content
                } else {
                    if (!this.newsIdToComments[key]) this.newsIdToComments[key] = []
                    this.newsIdToComments[key].push(...content)
                }

                const loaded = (this.newsIdToComments[key]?.length ?? 0)
                const hasMore =
                    totalElements && totalElements > 0
                        ? loaded < totalElements
                        : content.length >= size // 没有 totalElements 时用长度判断

                this.pageInfo[key] = { page, size, hasMore, total: totalElements ?? loaded }
                this.save(key)
            } catch (e: any) {
                this.error[key] = e?.message ?? '加载评论失败'
                this.loadFromStorage(key)
                this.pageInfo[key] = { page: 0, size, hasMore: false, total: this.newsIdToComments[key]?.length ?? 0 }
            } finally {
                this.loading[key] = false
            }
        },

        // 使用 api.ts 的 commentService.create
        async add(newsId: string | number, payload: CommentCreateRequest): Promise<void> {
            const key = String(newsId)
            this.error[key] = null

            try {
                const created = await commentService.create(Number(newsId), payload)
                if (!this.newsIdToComments[key]) this.newsIdToComments[key] = []
                this.newsIdToComments[key].unshift(created)
                this.save(key)

                // 新增后，已知总数则 +1
                const info = this.pageInfo[key]
                if (info?.total !== undefined) {
                    this.pageInfo[key] = { ...info, total: (info.total ?? 0) + 1 }
                }
            } catch (e: any) {
                // 本地回退（仅展示用）
                if (!this.newsIdToComments[key]) this.newsIdToComments[key] = []
                this.newsIdToComments[key].unshift({
                    id: Date.now(),
                    newsId: Number(newsId),
                    authorId: 0,
                    authorName: 'You',
                    content: payload.content,
                    imageUrl: payload.imageUrl ?? null,
                    createdAt: new Date().toISOString(),
                    deleted: false,
                } as unknown as Comment)
                this.save(key)
                this.error[key] = e?.message ?? '发表评论失败（已本地回退）'
            }
        },

        clear(newsId: string | number): void {
            const key = String(newsId)
            this.newsIdToComments[key] = []
            this.pageInfo[key] = { page: 0, size: 10, hasMore: true, total: 0 }
            this.save(key)
        },
    },
})
