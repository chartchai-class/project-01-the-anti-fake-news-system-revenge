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
  <main class="max-w-5xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Social Anti-Fake News — Home</h1>

    <section class="mb-4">
      <FilterBar v-model="filter" v-model:pageSize="pageSize" />
    </section>

    <section class="grid gap-4 md:grid-cols-2">
      <NewsCard v-for="n in items" :key="n.id" :item="n" />
    </section>

    <section class="mt-6">
      <Paginator v-model:page="page" :page-count="pageCount" />
      <p class="mt-2 text-xs text-zinc-500 text-center">
        Showing {{ items.length }} of {{ filtered.length }} items (Total: {{ allNews.length }})
      </p>
    </section>
  </main>
</template>
