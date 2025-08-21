import { defineStore } from 'pinia'
import type { Comment } from '@/types'

interface CommentsState {
	newsIdToComments: Record<string, Comment[]>
}

function getStorageKey(newsId: string): string {
	return `comments_${newsId}`
}

const API_BASE = 'http://localhost:4000'

export const useCommentsStore = defineStore('comments', {
	state: (): CommentsState => ({
		newsIdToComments: {},
	}),
	getters: {
		getByNewsId: (state) => (newsId: string): Comment[] => {
			return state.newsIdToComments[newsId] ?? []
		},
	},
	actions: {
		async load(newsId: string): Promise<void> {
			// 优先从 API 获取
			try {
				const res = await fetch(`${API_BASE}/comments?newsId=${encodeURIComponent(newsId)}`)
				if (!res.ok) throw new Error(`HTTP ${res.status}`)
				const data = (await res.json()) as Comment[]
				this.newsIdToComments[newsId] = Array.isArray(data) ? data : []
				this.save(newsId)
				return
			} catch {
				// 回退到 localStorage
				try {
					const stored = localStorage.getItem(getStorageKey(newsId))
					if (stored) {
						this.newsIdToComments[newsId] = JSON.parse(stored) as Comment[]
					} else {
						if (!this.newsIdToComments[newsId]) {
							this.newsIdToComments[newsId] = []
						}
					}
				} catch {
					if (!this.newsIdToComments[newsId]) {
						this.newsIdToComments[newsId] = []
					}
				}
			}
		},
		save(newsId: string): void {
			const list = this.newsIdToComments[newsId] ?? []
			localStorage.setItem(getStorageKey(newsId), JSON.stringify(list))
		},
		async add(newsId: string, comment: Comment): Promise<void> {
			// 优先 POST 到 API
			try {
				const res = await fetch(`${API_BASE}/comments`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ ...comment, newsId }),
				})
				if (!res.ok) throw new Error(`HTTP ${res.status}`)
				const created = (await res.json()) as Comment
				if (!this.newsIdToComments[newsId]) this.newsIdToComments[newsId] = []
				this.newsIdToComments[newsId].unshift(created)
				this.save(newsId)
				return
			} catch {
				// 回退：仅写本地
				if (!this.newsIdToComments[newsId]) this.newsIdToComments[newsId] = []
				this.newsIdToComments[newsId].unshift({ ...comment, newsId } as any)
				this.save(newsId)
			}
		},
		clear(newsId: string): void {
			this.newsIdToComments[newsId] = []
			this.save(newsId)
		},
	},
})


