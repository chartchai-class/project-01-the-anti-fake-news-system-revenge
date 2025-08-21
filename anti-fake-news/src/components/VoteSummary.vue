<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  fakeVotes: number
  nonFakeVotes: number
}

const props = defineProps<Props>()

const totalVotes = computed(() => props.fakeVotes + props.nonFakeVotes)
const fakePercentage = computed(() => totalVotes.value > 0 ? Math.round((props.fakeVotes / totalVotes.value) * 100) : 0)
const realPercentage = computed(() => totalVotes.value > 0 ? Math.round((props.nonFakeVotes / totalVotes.value) * 100) : 0)

const status = computed(() => {
  if (totalVotes.value === 0) return 'unknown'
  return props.fakeVotes >= props.nonFakeVotes ? 'fake' : 'real'
})

const statusText = computed(() => {
  switch (status.value) {
    case 'fake': return 'Fake'
    case 'real': return 'Real'
    default: return 'Pending'
  }
})

const statusClass = computed(() => {
  switch (status.value) {
    case 'fake': return 'status-fake'
    case 'real': return 'status-real'
    default: return 'status-unknown'
  }
})
</script>

<template>
  <div class="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200/60 dark:border-zinc-700/60 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold" style="color: var(--color-text);">Voting Results</h3>
      <span 
        class="px-3 py-1.5 rounded-full text-xs font-medium"
        :class="statusClass"
      >
        {{ statusText }}
      </span>
    </div>

    <div class="space-y-4">
      <!-- Vote Counts -->
      <div class="flex justify-between text-sm">
        <span style="color: var(--color-text-secondary);">Total Votes:</span>
        <span class="font-medium" style="color: var(--color-text);">{{ totalVotes }}</span>
      </div>

      <!-- Progress Bars -->
      <div class="space-y-3">
        <div>
          <div class="flex justify-between text-xs mb-1">
            <span style="color: var(--color-text-secondary);">Fake Votes</span>
            <span class="font-medium" style="color: var(--color-text);">{{ props.fakeVotes }} ({{ fakePercentage }}%)</span>
          </div>
          <div class="h-2 w-full rounded-full overflow-hidden" style="background-color: var(--color-gray-200);">
            <div 
              class="h-full rounded-full transition-all duration-1000 ease-out progress-fake"
              :style="{ width: fakePercentage + '%' }"
            ></div>
          </div>
        </div>

        <div>
          <div class="flex justify-between text-xs mb-1">
            <span style="color: var(--color-text-secondary);">Real Votes</span>
            <span class="font-medium" style="color: var(--color-text);">{{ props.nonFakeVotes }} ({{ realPercentage }}%)</span>
          </div>
          <div class="h-2 w-full rounded-full overflow-hidden" style="background-color: var(--color-gray-200);">
            <div 
              class="h-full rounded-full transition-all duration-1000 ease-out progress-real"
              :style="{ width: realPercentage + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Status Summary -->
      <div class="pt-3 border-t" style="border-color: rgba(94, 82, 64, 0.12);">
        <div class="text-center">
          <p class="text-sm" style="color: var(--color-text-secondary);">
            Based on {{ totalVotes }} votes, this news is classified as
          </p>
          <p class="text-lg font-semibold mt-1" :style="{ color: status === 'fake' ? 'var(--color-error)' : status === 'real' ? 'var(--color-success)' : 'var(--color-warning)' }">
            {{ statusText.toUpperCase() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
