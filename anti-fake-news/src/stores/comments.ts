import { defineStore } from 'pinia'
import type { Comment } from '@/types'

interface CommentsState {
	newsIdToComments: Record<string, Comment[]>
}

function getStorageKey(newsId: string | number): string {
	return `comments_${newsId}`
}

const API_BASE = 'http://localhost:4000'

export const useCommentsStore = defineStore('comments', {
	state: (): CommentsState => ({
		newsIdToComments: {},
	}),
	getters: {
		getByNewsId: (state) => (newsId: string | number): Comment[] => {
			const key = String(newsId)
			return state.newsIdToComments[key] ?? []
		},
	},
	actions: {
		async load(newsId: string | number): Promise<void> {
			const key = String(newsId)
			// 优先从 API 获取
			try {
				const res = await fetch(`${API_BASE}/comments?newsId=${encodeURIComponent(key)}`)
				if (!res.ok) throw new Error(`HTTP ${res.status}`)
				const data = (await res.json()) as Comment[]
				this.newsIdToComments[key] = Array.isArray(data) ? data : []
				this.save(key)
				return
			} catch {
				// 回退到 localStorage
				try {
					const stored = localStorage.getItem(getStorageKey(key))
					if (stored) {
						this.newsIdToComments[key] = JSON.parse(stored) as Comment[]
					} else {
						if (!this.newsIdToComments[key]) {
							this.newsIdToComments[key] = []
						}
					}
				} catch {
					if (!this.newsIdToComments[key]) {
						this.newsIdToComments[key] = []
					}
				}
			}
		},
		save(newsId: string | number): void {
			const key = String(newsId)
			const list = this.newsIdToComments[key] ?? []
			localStorage.setItem(getStorageKey(key), JSON.stringify(list))
		},
		async add(newsId: string | number, comment: Comment): Promise<void> {
			const key = String(newsId)
			// 优先 POST 到 API
			try {
				const res = await fetch(`${API_BASE}/comments`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ ...comment, newsId: key }),
				})
				if (!res.ok) throw new Error(`HTTP ${res.status}`)
				const created = (await res.json()) as Comment
				if (!this.newsIdToComments[key]) this.newsIdToComments[key] = []
				this.newsIdToComments[key].unshift(created)
				this.save(key)
				return
			} catch {
				// 回退：仅写本地
				if (!this.newsIdToComments[key]) this.newsIdToComments[key] = []
				this.newsIdToComments[key].unshift({ ...comment, newsId: key } as any)
				this.save(key)
			}
		},
		clear(newsId: string | number): void {
			const key = String(newsId)
			this.newsIdToComments[key] = []
			this.save(key)
		},
	},
})


