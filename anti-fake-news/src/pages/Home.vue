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
  <main class="max-w-6xl mx-auto p-6">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-3 bg-gradient-to-r from-zinc-900 via-blue-800 to-purple-800 dark:from-zinc-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
        Social Anti-Fake News
      </h1>
      <p class="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
        Discover, analyze, and vote on news authenticity
      </p>
    </div>

    <section class="mb-6">
      <FilterBar v-model="filter" v-model:pageSize="pageSize" />
    </section>

    <section class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
      <NewsCard v-for="n in items" :key="n.id" :item="n" />
    </section>

    <section class="bg-white/60 dark:bg-zinc-900/60 rounded-2xl p-6 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-700/60 shadow-sm">
      <Paginator v-model:page="page" :page-count="pageCount" />
      <div class="mt-4 text-center">
        <p class="text-sm text-zinc-600 dark:text-zinc-400">
          Showing <span class="font-semibold text-zinc-900 dark:text-zinc-100">{{ items.length }}</span> of 
          <span class="font-semibold text-zinc-900 dark:text-zinc-100">{{ filtered.length }}</span> items 
          (Total: <span class="font-semibold text-zinc-900 dark:text-zinc-100">{{ allNews.length }}</span>)
        </p>
      </div>
    </section>
  </main>
</template>
