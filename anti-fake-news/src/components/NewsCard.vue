<script setup lang="ts">
import type { NewsItem } from '@/types'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ item: NewsItem }>()

const status = computed(() => {
  const { fakeVotes, nonFakeVotes } = props.item
  if (fakeVotes === 0 && nonFakeVotes === 0) return 'unknown'
  return fakeVotes >= nonFakeVotes ? 'fake' : 'non-fake'
})

const ratio = computed(() => {
  const total = props.item.fakeVotes + props.item.nonFakeVotes
  if (!total) return { fake: 0, non: 0 }
  return {
    fake: Math.round((props.item.fakeVotes / total) * 100),
    non: Math.round((props.item.nonFakeVotes / total) * 100),
  }
})

const router = useRouter()
const goDetail = () => router.push(`/news/${props.item.id}`)
</script>

<template>
  <article class="rounded-2xl shadow p-4 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
    <header class="flex items-start justify-between gap-4">
      <h3 class="text-lg font-semibold leading-snug line-clamp-2">{{ item.topic }}</h3>
      <span
          class="shrink-0 px-2 py-0.5 rounded-full text-xs font-medium"
          :class="{
          'bg-red-100 text-red-700': status==='fake',
          'bg-emerald-100 text-emerald-700': status==='non-fake',
          'bg-zinc-100 text-zinc-600': status==='unknown'
        }"
      >
        {{ status }}
      </span>
    </header>

    <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
      {{ item.shortDetail }}
    </p>

    <div class="mt-3 text-xs text-zinc-500">
      <span class="mr-3">Reporter: {{ item.reporter }}</span>
      <time :datetime="item.reportedAt">{{ new Date(item.reportedAt).toLocaleString() }}</time>
    </div>

    <div class="mt-3">
      <div class="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
        <div class="h-2 bg-zinc-900 dark:bg-zinc-100" :style="{ width: ratio.fake + '%' }"></div>
      </div>
      <div class="mt-1 text-xs text-zinc-500">
        Fake {{ ratio.fake }}% · Not fake {{ ratio.non }}%
      </div>
    </div>

    <footer class="mt-4">
      <button class="px-3 py-1.5 rounded-xl text-sm border hover:bg-zinc-50 dark:hover:bg-zinc-800"
              @click="goDetail">
        View details
      </button>
    </footer>
  </article>
</template>
