<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { newsService, commentService, voteService } from '@/services/api'
import VoteSummary from '@/components/VoteSummary.vue'
import CommentList from '@/components/CommentList.vue'
import type { NewsItem, Comment, VoteResponse } from '@/types'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const item = ref<NewsItem | null>(null)
const comments = ref<Comment[]>([])
const voteStats = ref<VoteResponse | null>(null)
const isLoading = ref(false)
const loadError = ref<string | null>(null)

// 从后端 API 加载新闻详情
async function fetchNewsById(newsId: number) {
  try {
    isLoading.value = true
    loadError.value = null
    item.value = await newsService.getById(newsId)
  } catch (e: any) {
    loadError.value = e?.message || 'Failed to load news'
    console.error('Failed to load news:', e)
  } finally {
    isLoading.value = false
  }
}

// 加载评论数据
const loadComments = async () => {
  if (!id) return
  try {
    const result = await commentService.getByNewsId(id)
    comments.value = result.content
  } catch (e: any) {
    console.error('Failed to load comments:', e)
  }
}

// 加载投票统计
const loadVoteStats = async () => {
  if (!id) return
  try {
    voteStats.value = await voteService.getStats(id)
  } catch (e: any) {
    console.error('Failed to load vote stats:', e)
  }
}

// 监听路由变化，重新加载数据
watch(() => route.params.id, () => {
  if (route.params.id) {
    const newId = Number(route.params.id)
    fetchNewsById(newId)
    loadComments()
    loadVoteStats()
  }
})

// 组件挂载时加载数据
onMounted(() => {
  fetchNewsById(id)
  loadComments()
  loadVoteStats()
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

    <div v-if="isLoading" class="text-center py-20">
      <p class="text-xl" style="color: var(--color-text-secondary);">Loading...</p>
    </div>

    <div v-else-if="loadError" class="text-center py-20">
      <p class="text-xl text-red-500">Error: {{ loadError }}</p>
    </div>

    <div v-else-if="item" class="space-y-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-4" style="color: var(--color-text);">{{ item.title }}</h1>
      </div>

      <div v-if="item.imageUrls && item.imageUrls.length > 0" class="relative overflow-hidden rounded-2xl shadow-lg">
        <img :src="item.imageUrls[0]" alt="" class="w-full h-96 object-cover" />
      </div>

      <div class="card-surface rounded-2xl p-8 shadow-sm">
        <p class="text-lg leading-relaxed mb-6" style="color: var(--color-text);">
          {{ item.fullDetail }}
        </p>
        
        <div class="flex flex-wrap items-center gap-4 text-sm border-t pt-6" style="border-color: rgba(94, 82, 64, 0.12); color: var(--color-text-secondary);">
          <span class="inline-flex items-center gap-2 px-3 py-2 rounded-full card-surface border" style="border-color: rgba(94, 82, 64, 0.12);">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 8a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            Reporter: {{ item.reporterName }}
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

      <!-- Voting Results Section -->
      <div class="card-surface rounded-2xl p-8 shadow-sm">
        <VoteSummary 
          v-if="voteStats"
          :fake-votes="voteStats.fakeCount" 
          :not-fake-votes="voteStats.notFakeCount" 
        />
        <div v-else class="text-center py-4" style="color: var(--color-text-secondary);">
          No votes yet
        </div>
      </div>

      <!-- Comments Section -->
      <div class="card-surface rounded-2xl p-8 shadow-sm">
        <CommentList :comments="comments" :page-size="3" />
      </div>
    </div>
    
    <div v-else class="text-center py-20">
      <div class="text-6xl mb-4">📰</div>
      <p class="text-xl" style="color: var(--color-text-secondary);">News not found</p>
    </div>
  </div>
</template>
