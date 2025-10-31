<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { newsService } from '@/services/api'
import type { NewsItem } from '@/types'
import NewsCard from '@/components/NewsCard.vue'
import FilterBar, { type FilterKind } from '@/components/FilterBar.vue'
import Paginator from '@/components/Paginator.vue'

const allNews = ref<NewsItem[]>([])
const isLoading = ref(false)
const loadError = ref<string | null>(null)
const totalElements = ref(0)

// 从后端 API 加载新闻列表
async function fetchNewsFromApi(params?: { page?: number, size?: number, search?: string }) {
  try {
    isLoading.value = true
    loadError.value = null
    
    const result = await newsService.getAll({
      page: params?.page || 0,  // 后端从0开始
      size: params?.size || 100, // 先加载所有数据用于前端过滤
      search: params?.search
    })
    
    allNews.value = result.content
    totalElements.value = result.totalElements
  } catch (e: any) {
    loadError.value = e?.message || 'Failed to load news from backend'
    console.error('Failed to load news:', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchNewsFromApi()
})

// 过滤条件 + 每页数量
const filter = ref<FilterKind>('all')
const pageSize = ref<number>(10)
const page = ref<number>(1)

// 根据后端投票统计判断新闻状态
// 注意：后端使用 VoteSummaryResponse，不在 NewsItem 中直接存储投票数
function statusOf(n: NewsItem) {
  // 后端通过 NewsStatus 字段返回：FAKE/NON_FAKE/UNKNOWN
  if (n.status === 'UNKNOWN') return 'unknown'
  if (n.status === 'FAKE') return 'fake'
  if (n.status === 'NON_FAKE') return 'non-fake'
  return 'unknown'
}

const filtered = computed(() => {
  if (filter.value === 'all') return allNews.value
  return allNews.value.filter(n => statusOf(n) === filter.value)
})

const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))

// 当前页数据
const items = computed(() => {
  if (page.value > pageCount.value) page.value = pageCount.value
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

// 当过滤或每页数量变化时，回到第一页
watch([filter, pageSize], () => {page.value = 1})
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-6">
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-semibold" style="color: var(--color-text);">News List</h2>
      </div>
      
      <FilterBar v-model="filter" v-model:pageSize="pageSize" />
    </div>

    <div v-if="isLoading" class="text-center py-10 text-sm" style="color: var(--color-text-secondary);">Loading news from backend...</div>
    <div v-else-if="loadError" class="text-center py-10 text-sm text-red-500">
      Error: {{ loadError }}
    </div>
    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
      <NewsCard v-for="n in items" :key="n.id" :item="n" />
    </div>

    <div class="card-surface rounded-2xl p-6">
      <Paginator v-model:page="page" :page-count="pageCount" />
      <div class="mt-4 text-center">
        <p class="text-sm" style="color: var(--color-text-secondary);">
          Showing <span class="font-medium" style="color: var(--color-text);">{{ items.length }}</span> of 
          <span class="font-medium" style="color: var(--color-text);">{{ filtered.length }}</span> items
          (Total: <span class="font-medium" style="color: var(--color-text);">{{ allNews.length }}</span>)
        </p>
      </div>
    </div>
  </div>
</template>
