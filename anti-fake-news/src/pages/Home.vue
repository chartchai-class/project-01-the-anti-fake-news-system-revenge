<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { newsSeed } from '@/data/news'
import type { NewsItem } from '@/types'
import NewsCard from '@/components/NewsCard.vue'
import FilterBar, { type FilterKind } from '@/components/FilterBar.vue'
import Paginator from '@/components/Paginator.vue'

const allNews = ref<NewsItem[]>(newsSeed)

// 过滤条件 + 每页数量
const filter = ref<FilterKind>('all')
const pageSize = ref<number>(10)
const page = ref<number>(1)

function statusOf(n: NewsItem) {
  if (n.fakeVotes === 0 && n.nonFakeVotes === 0) return 'unknown'
  return n.fakeVotes >= n.nonFakeVotes ? 'fake' : 'non-fake'
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

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
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
