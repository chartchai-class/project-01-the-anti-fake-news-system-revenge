<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { newsSeed } from '@/data/news'
import VoteSummary from '@/components/VoteSummary.vue'
import CommentList from '@/components/CommentList.vue'
import type { Comment } from '@/types'
import { useCommentsStore } from '@/stores/comments'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const item = ref(newsSeed.find(n => n.id === id))

import { ref, onMounted, watch } from 'vue'
async function fetchNewsById(newsId: number) {
  try {
    const res = await fetch(`http://localhost:4000/news/${newsId}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    item.value = data ?? item.value
  } catch {
    // 回退：保持本地种子
  }
}

// 评论 store
const commentsStore = useCommentsStore()
const comments = ref<Comment[]>([])

// 加载评论数据（通过 store）
const loadComments = async () => {
  if (!id) return
  await commentsStore.load(id)
  comments.value = commentsStore.getByNewsId(id)
}

// 监听路由变化，重新加载评论
watch(() => route.params.id, () => {
  if (route.params.id) {
    fetchNewsById(Number(route.params.id))
    loadComments()
  }
})

// 获取更新的投票计数
const getUpdatedVoteCount = (type: 'fake' | 'non-fake') => {
  if (id) {
    const storedNewsData = localStorage.getItem(`news_${id}`)
    if (storedNewsData) {
      const newsData = JSON.parse(storedNewsData)
      return type === 'fake' ? newsData.fakeVotes : newsData.trueVotes
    }
  }
  // 如果没有存储的数据，返回原始数据
  return type === 'fake' ? (item.value?.fakeVotes || 0) : (item.value?.trueVotes || 0)
}

// 组件挂载时加载评论
onMounted(() => {
  fetchNewsById(id)
  loadComments()
})
</script>

<template>
  <div class="max-w-5xl mx-auto px-6 py-6">
    <button 
      class="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl card-surface border shadow-sm hover:shadow-md transition-all duration-200"
      style="border-color: rgba(94, 82, 64, 0.12); color: var(--color-text);"
      @click="router.push('/')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Back to Home
    </button>

    <div v-if="item" class="space-y-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-4" style="color: var(--color-text);">{{ item.title }}</h1>
      </div>

      <div class="relative overflow-hidden rounded-2xl shadow-lg">
        <img :src="item.imageUrl" alt="" class="w-full h-96 object-cover" />
      </div>

      <div class="card-surface rounded-2xl p-8 shadow-sm">
        <p class="text-lg leading-relaxed mb-6" style="color: var(--color-text);">
          {{ item.content }}
        </p>
        
        <div class="flex flex-wrap items-center gap-4 text-sm border-t pt-6" style="border-color: rgba(94, 82, 64, 0.12); color: var(--color-text-secondary);">
          <span class="inline-flex items-center gap-2 px-3 py-2 rounded-full card-surface border" style="border-color: rgba(94, 82, 64, 0.12);">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 8a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            Reporter: {{ item.author.name }}
          </span>
          <time :datetime="item.createdAt" class="inline-flex items-center gap-2 px-3 py-2 rounded-full card-surface border" style="border-color: rgba(94, 82, 64, 0.12);">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
            {{ new Date(item.createdAt).toLocaleString() }}
          </time>
        </div>
      </div>

      <div class="flex gap-4 justify-center">
        <router-link 
          :to="`/vote/${item.id}`" 
          class="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-base font-medium btn-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Go Vote
        </router-link>
      </div>
    </div>

    <!-- Voting Results Section -->
    <div v-if="item" class="card-surface rounded-2xl p-8 shadow-sm">
      <VoteSummary 
        :fake-votes="getUpdatedVoteCount('fake')" 
        :non-fake-votes="getUpdatedVoteCount('non-fake')" 
      />
    </div>

    <!-- Comments Section -->
    <div v-if="item" class="card-surface rounded-2xl p-8 shadow-sm">
      <CommentList :comments="comments" :page-size="3" />
    </div>
    
    <div v-else class="text-center py-20">
      <div class="text-6xl mb-4">📰</div>
      <p class="text-xl" style="color: var(--color-text-secondary);">News not found</p>
    </div>
  </div>
</template>
