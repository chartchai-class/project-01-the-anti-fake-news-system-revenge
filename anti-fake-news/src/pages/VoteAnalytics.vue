<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { newsService, voteService } from '@/services/api'
import type { NewsItem, VoteResponse } from '@/types'

const router = useRouter()

// Data
const allNews = ref<NewsItem[]>([])
const voteStats = ref<Map<number, VoteResponse>>(new Map())
const isLoading = ref(false)
const loadError = ref<string | null>(null)

// Filters
const statusFilter = ref<'all' | 'fake' | 'non-fake' | 'unknown'>('all')
const sortBy = ref<'votes' | 'fake-ratio' | 'real-ratio' | 'recent'>('votes')

// Load data
onMounted(async () => {
  await loadData()
})

async function loadData() {
  try {
    isLoading.value = true
    loadError.value = null

    // Load all news
    const result = await newsService.getAll({ size: 100 })
    allNews.value = result.content

    // Load vote statistics for each news
    const statsPromises = allNews.value.map(async (news) => {
      try {
        const stats = await voteService.getStats(news.id)
        voteStats.value.set(news.id, stats)
      } catch (error) {
        console.error(`Failed to load votes for news ${news.id}:`, error)
      }
    })

    await Promise.all(statsPromises)
  } catch (e: any) {
    loadError.value = e?.message || 'Failed to load data'
  } finally {
    isLoading.value = false
  }
}

// Computed statistics
const newsWithVotes = computed(() => {
  return allNews.value.map(news => {
    const votes = voteStats.value.get(news.id) || { 
      newsId: news.id, 
      fakeCount: 0, 
      notFakeCount: 0 
    }
    const total = votes.fakeCount + votes.notFakeCount
    const fakePercentage = total > 0 ? Math.round((votes.fakeCount / total) * 100) : 0
    const realPercentage = total > 0 ? Math.round((votes.notFakeCount / total) * 100) : 0
    
    return {
      news,
      votes,
      total,
      fakePercentage,
      realPercentage,
      voteStatus: total === 0 ? 'unknown' : votes.fakeCount > votes.notFakeCount ? 'fake' : 'real'
    }
  })
})

// Filter by status
const filteredNews = computed(() => {
  if (statusFilter.value === 'all') return newsWithVotes.value
  
  return newsWithVotes.value.filter(item => {
    if (statusFilter.value === 'unknown') return item.total === 0
    if (statusFilter.value === 'fake') return item.voteStatus === 'fake'
    if (statusFilter.value === 'non-fake') return item.voteStatus === 'real'
    return true
  })
})

// Sort
const sortedNews = computed(() => {
  const items = [...filteredNews.value]
  
  switch (sortBy.value) {
    case 'votes':
      return items.sort((a, b) => b.total - a.total)
    case 'fake-ratio':
      return items.sort((a, b) => b.fakePercentage - a.fakePercentage)
    case 'real-ratio':
      return items.sort((a, b) => b.realPercentage - a.realPercentage)
    case 'recent':
      return items.sort((a, b) => 
        new Date(b.news.createdAt).getTime() - new Date(a.news.createdAt).getTime()
      )
    default:
      return items
  }
})

// Overall statistics
const overallStats = computed(() => {
  const totalNews = allNews.value.length
  const totalVotes = newsWithVotes.value.reduce((sum, item) => sum + item.total, 0)
  const totalFakeVotes = newsWithVotes.value.reduce((sum, item) => sum + item.votes.fakeCount, 0)
  const totalRealVotes = newsWithVotes.value.reduce((sum, item) => sum + item.votes.notFakeCount, 0)
  const newsWithVotesCount = newsWithVotes.value.filter(item => item.total > 0).length
  const avgVotesPerNews = newsWithVotesCount > 0 ? Math.round(totalVotes / newsWithVotesCount) : 0

  return {
    totalNews,
    totalVotes,
    totalFakeVotes,
    totalRealVotes,
    newsWithVotesCount,
    avgVotesPerNews,
    fakePercentage: totalVotes > 0 ? Math.round((totalFakeVotes / totalVotes) * 100) : 0,
    realPercentage: totalVotes > 0 ? Math.round((totalRealVotes / totalVotes) * 100) : 0
  }
})

// Navigate to news details
const goToNews = (newsId: number) => {
  router.push(`/news/${newsId}`)
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-6">
    <!-- Header -->
    <div class="mb-6">
      <button 
        class="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl card-surface border shadow-sm hover:shadow-md transition-all duration-200"
        style="border-color: rgba(94, 82, 64, 0.12); color: var(--color-text);"
        @click="goBack">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Home
      </button>

      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-2" style="color: var(--color-text);">
          📊 Vote Analytics Dashboard
        </h1>
        <p class="text-lg" style="color: var(--color-text-secondary);">
          Community voting statistics and trends
        </p>
      </div>
    </div>

    <!-- Overall Statistics -->
    <div v-if="!isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="card-surface rounded-2xl p-6 shadow-sm">
        <div class="text-3xl mb-2">📰</div>
        <div class="text-2xl font-bold mb-1" style="color: var(--color-text);">
          {{ overallStats.totalNews }}
        </div>
        <div class="text-sm" style="color: var(--color-text-secondary);">Total News</div>
      </div>

      <div class="card-surface rounded-2xl p-6 shadow-sm">
        <div class="text-3xl mb-2">🗳️</div>
        <div class="text-2xl font-bold mb-1" style="color: var(--color-text);">
          {{ overallStats.totalVotes }}
        </div>
        <div class="text-sm" style="color: var(--color-text-secondary);">Total Votes</div>
      </div>

      <div class="card-surface rounded-2xl p-6 shadow-sm">
        <div class="text-3xl mb-2">🔴</div>
        <div class="text-2xl font-bold mb-1" style="color: var(--color-error);">
          {{ overallStats.fakePercentage }}%
        </div>
        <div class="text-sm" style="color: var(--color-text-secondary);">Fake Votes</div>
      </div>

      <div class="card-surface rounded-2xl p-6 shadow-sm">
        <div class="text-3xl mb-2">🟢</div>
        <div class="text-2xl font-bold mb-1" style="color: var(--color-success);">
          {{ overallStats.realPercentage }}%
        </div>
        <div class="text-sm" style="color: var(--color-text-secondary);">Real Votes</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card-surface rounded-2xl p-6 mb-6 shadow-sm">
      <div class="flex flex-wrap gap-4">
        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--color-text);">
            Filter by Status:
          </label>
          <div class="inline-flex rounded-xl border overflow-hidden shadow-sm" 
               style="border-color: rgba(94, 82, 64, 0.12); background-color: var(--color-surface);">
            <button
              v-for="f in [
                { value: 'all', label: 'All' },
                { value: 'fake', label: 'Likely Fake' },
                { value: 'non-fake', label: 'Likely Real' },
                { value: 'unknown', label: 'No Votes' }
              ]"
              :key="f.value"
              @click="statusFilter = f.value as any"
              class="px-4 py-2 text-sm font-medium transition-all duration-200"
              :class="{ 'btn-primary': statusFilter === f.value }"
              :style="statusFilter !== f.value ? { color: 'var(--color-text-secondary)' } : {}">
              {{ f.label }}
            </button>
          </div>
        </div>

        <!-- Sort -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--color-text);">
            Sort by:
          </label>
          <select 
            v-model="sortBy"
            class="px-4 py-2 rounded-xl border shadow-sm transition-all duration-200"
            style="border-color: rgba(94, 82, 64, 0.12); background-color: var(--color-surface); color: var(--color-text);">
            <option value="votes">Most Votes</option>
            <option value="fake-ratio">Highest Fake %</option>
            <option value="real-ratio">Highest Real %</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-20">
      <div class="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-lg" style="color: var(--color-text-secondary);">Loading vote statistics...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="text-center py-20">
      <div class="text-6xl mb-4">⚠️</div>
      <p class="text-lg text-red-500">{{ loadError }}</p>
    </div>

    <!-- News List with Vote Stats -->
    <div v-else class="space-y-4">
      <div v-if="sortedNews.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">🔍</div>
        <p class="text-lg" style="color: var(--color-text-secondary);">No news found with the selected filters</p>
      </div>

      <div
        v-for="item in sortedNews"
        :key="item.news.id"
        @click="goToNews(item.news.id)"
        class="card-surface rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer">
        <div class="flex items-start gap-6">
          <!-- News Info -->
          <div class="flex-1">
            <div class="flex items-start justify-between gap-4 mb-3">
              <h3 class="text-lg font-semibold line-clamp-2" style="color: var(--color-text);">
                {{ item.news.title }}
              </h3>
              <span
                class="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
                :class="{
                  'status-fake': item.news.status === 'FAKE',
                  'status-real': item.news.status === 'NON_FAKE',
                  'status-unknown': item.news.status === 'UNKNOWN'
                }">
                {{ item.news.status === 'FAKE' ? 'Fake' : item.news.status === 'NON_FAKE' ? 'Real' : 'Pending' }}
              </span>
            </div>

            <p class="text-sm mb-3 line-clamp-2" style="color: var(--color-text-secondary);">
              {{ item.news.shortDetail }}
            </p>

            <div class="flex items-center gap-4 text-xs" style="color: var(--color-text-secondary);">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 8a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                {{ item.news.reporterName }}
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
                {{ new Date(item.news.createdAt).toLocaleDateString() }}
              </span>
            </div>
          </div>

          <!-- Vote Statistics -->
          <div class="w-80 shrink-0">
            <div class="space-y-3">
              <!-- Total Votes -->
              <div class="text-center">
                <div class="text-3xl font-bold" style="color: var(--color-text);">
                  {{ item.total }}
                </div>
                <div class="text-xs" style="color: var(--color-text-secondary);">Total Votes</div>
              </div>

              <!-- Vote Breakdown -->
              <div class="space-y-2">
                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span style="color: var(--color-text-secondary);">🔴 Fake</span>
                    <span class="font-medium" style="color: var(--color-text);">
                      {{ item.votes.fakeCount }} ({{ item.fakePercentage }}%)
                    </span>
                  </div>
                  <div class="h-2 w-full rounded-full overflow-hidden" style="background-color: var(--color-gray-200);">
                    <div 
                      class="h-full rounded-full transition-all duration-1000 ease-out progress-fake"
                      :style="{ width: item.fakePercentage + '%' }">
                    </div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span style="color: var(--color-text-secondary);">🟢 Real</span>
                    <span class="font-medium" style="color: var(--color-text);">
                      {{ item.votes.notFakeCount }} ({{ item.realPercentage }}%)
                    </span>
                  </div>
                  <div class="h-2 w-full rounded-full overflow-hidden" style="background-color: var(--color-gray-200);">
                    <div 
                      class="h-full rounded-full transition-all duration-1000 ease-out progress-real"
                      :style="{ width: item.realPercentage + '%' }">
                    </div>
                  </div>
                </div>
              </div>

              <!-- Community Verdict -->
              <div class="text-center pt-2 border-t" style="border-color: rgba(94, 82, 64, 0.12);">
                <span 
                  class="text-xs font-medium px-3 py-1.5 rounded-full"
                  :class="{
                    'bg-red-100 text-red-700': item.voteStatus === 'fake',
                    'bg-green-100 text-green-700': item.voteStatus === 'real',
                    'bg-gray-100 text-gray-700': item.voteStatus === 'unknown'
                  }">
                  {{ item.voteStatus === 'fake' ? 'Community: Likely Fake' : 
                     item.voteStatus === 'real' ? 'Community: Likely Real' : 'No Votes Yet' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
