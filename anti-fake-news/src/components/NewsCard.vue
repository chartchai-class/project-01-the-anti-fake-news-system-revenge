<script setup lang="ts">
import type { NewsItem } from '@/types'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ item: NewsItem }>()

const status = computed(() => {
  const { fakeVotes, trueVotes } = props.item
  if (fakeVotes === 0 && trueVotes === 0) return 'unknown'
  return fakeVotes >= trueVotes ? 'fake' : 'non-fake'
})

const ratio = computed(() => {
  const total = props.item.fakeVotes + props.item.trueVotes
  if (!total) return { fake: 0, non: 0 }
  return {
    fake: Math.round((props.item.fakeVotes / total) * 100),
    non: Math.round((props.item.trueVotes / total) * 100),
  }
})

const router = useRouter()
const goDetail = () => router.push(`/news/${props.item.id}`)
</script>

<template>
     <article class="card-surface rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
     <header class="flex items-start justify-between gap-4 mb-4">
       <h3 class="text-lg font-medium leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors duration-200" style="color: var(--color-text);">
         {{ item.title }}
       </h3>
       <span
           class="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
           :class="{
           'status-fake': status==='fake',
           'status-real': status==='non-fake',
           'status-unknown': status==='unknown'
         }"
       >
         {{ status === 'fake' ? 'Fake' : status === 'non-fake' ? 'Real' : 'Pending' }}
       </span>
     </header>

         <p class="mb-4 text-sm leading-relaxed line-clamp-2" style="color: var(--color-text-secondary);">
       {{ item.summary }}
     </p>

     <div class="mb-4 text-xs space-y-2" style="color: var(--color-text-secondary);">
       <div class="flex items-center gap-2">
         <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style="background-color: var(--color-surface); border: 1px solid rgba(94, 82, 64, 0.12);">
           <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
             <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 8a2 2 0 11-4 0 2 2 0 014 0z"/>
           </svg>
           {{ item.author.name }}
         </span>
       </div>
       <time :datetime="item.createdAt" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style="background-color: var(--color-surface); border: 1px solid rgba(94, 82, 64, 0.12);">
         <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
           <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
         </svg>
         {{ new Date(item.createdAt).toLocaleString() }}
       </time>
     </div>

    <div class="mb-6">
      <div class="mb-2 flex justify-between text-xs font-medium" style="color: var(--color-text-secondary);">
        <span>Fake {{ ratio.fake }}%</span>
        <span>Real {{ ratio.non }}%</span>
      </div>
      <div class="h-2 w-full rounded-full overflow-hidden" style="background-color: var(--color-gray-200);">
        <div class="h-full rounded-full transition-all duration-1000 ease-out" 
             :class="status === 'fake' ? 'progress-fake' : 'progress-real'"
             :style="{ width: (status === 'fake' ? ratio.fake : ratio.non) + '%' }"></div>
      </div>
    </div>

    <footer>
      <button class="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 text-white dark:text-zinc-900 hover:from-zinc-800 hover:to-zinc-600 dark:hover:from-zinc-200 dark:hover:to-zinc-400 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              @click="goDetail">
                 <span class="flex items-center justify-center gap-2">
           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
           </svg>
           View Details
         </span>
      </button>
    </footer>
  </article>
</template>
