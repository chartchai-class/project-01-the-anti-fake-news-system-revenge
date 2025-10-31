<script setup lang="ts">
import type { NewsItem } from '@/types'
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { voteService } from '@/services/api'

const props = defineProps<{ item: NewsItem }>()

// Vote statistics
const fakeVotes = ref(0)
const notFakeVotes = ref(0)
const isLoadingVotes = ref(false)

// Load vote statistics
onMounted(async () => {
  try {
    isLoadingVotes.value = true
    const stats = await voteService.getStats(props.item.id)
    fakeVotes.value = stats.fakeCount || 0
    notFakeVotes.value = stats.notFakeCount || 0
  } catch (error) {
    console.error('Failed to load vote stats:', error)
  } finally {
    isLoadingVotes.value = false
  }
})

// Backend returns status: FAKE/NON_FAKE/UNKNOWN
const status = computed(() => {
  if (props.item.status === 'FAKE') return 'fake'
  if (props.item.status === 'NON_FAKE') return 'non-fake'
  return 'unknown'
})

// Calculate vote ratio
const totalVotes = computed(() => fakeVotes.value + notFakeVotes.value)
const fakePercentage = computed(() => 
  totalVotes.value > 0 ? Math.round((fakeVotes.value / totalVotes.value) * 100) : 0
)
const realPercentage = computed(() => 
  totalVotes.value > 0 ? Math.round((notFakeVotes.value / totalVotes.value) * 100) : 0
)

// Determine dominant vote
const voteStatus = computed(() => {
  if (totalVotes.value === 0) return 'unknown'
  return fakeVotes.value > notFakeVotes.value ? 'fake' : 'real'
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
       {{ item.shortDetail }}
     </p>

     <div class="mb-4 text-xs space-y-2" style="color: var(--color-text-secondary);">
       <div class="flex items-center gap-2">
         <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style="background-color: var(--color-surface); border: 1px solid rgba(94, 82, 64, 0.12);">
           <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
             <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 8a2 2 0 11-4 0 2 2 0 014 0z"/>
           </svg>
           {{ item.reporterName }}
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
        <span>🔴 Fake {{ fakePercentage }}% ({{ fakeVotes }})</span>
        <span>🟢 Real {{ realPercentage }}% ({{ notFakeVotes }})</span>
      </div>
      <div v-if="isLoadingVotes" class="h-2 w-full rounded-full overflow-hidden animate-pulse" style="background-color: var(--color-gray-200);"></div>
      <div v-else class="h-2 w-full rounded-full overflow-hidden flex" style="background-color: var(--color-gray-200);">
        <div 
          v-if="fakeVotes > 0"
          class="h-full progress-fake transition-all duration-1000 ease-out" 
          :style="{ width: fakePercentage + '%' }">
        </div>
        <div 
          v-if="notFakeVotes > 0"
          class="h-full progress-real transition-all duration-1000 ease-out" 
          :style="{ width: realPercentage + '%' }">
        </div>
      </div>
      <div v-if="totalVotes > 0" class="mt-2 text-center">
        <span class="text-xs font-medium px-2 py-1 rounded-full"
              :class="{
                'bg-red-100 text-red-700': voteStatus === 'fake',
                'bg-green-100 text-green-700': voteStatus === 'real',
                'bg-gray-100 text-gray-700': voteStatus === 'unknown'
              }">
          Community: {{ voteStatus === 'fake' ? 'Likely Fake' : voteStatus === 'real' ? 'Likely Real' : 'Undecided' }}
        </span>
      </div>
      <div v-else class="mt-2 text-center text-xs" style="color: var(--color-text-secondary);">
        No votes yet - Be the first to vote!
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
