<script setup lang="ts">
import { computed } from 'vue'

import type { Comment } from '@/types'

interface Props {
  comment: Comment
}

const props = defineProps<Props>()

const voteClass = computed(() => {
  return props.comment.vote === 'fake' ? 'status-fake' : 'status-real'
})

const voteText = computed(() => {
  return props.comment.vote === 'fake' ? 'Voted: Fake' : 'Voted: Real'
})
</script>

<template>
  <div class="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200/60 dark:border-zinc-700/60 shadow-sm">
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center">
          <span class="text-white text-sm font-medium">{{ props.comment.username.charAt(0).toUpperCase() }}</span>
        </div>
        <div>
          <p class="text-sm font-medium" style="color: var(--color-text);">{{ props.comment.username }}</p>
          <p class="text-xs" style="color: var(--color-text-secondary);">
            {{ new Date(props.comment.createdAt).toLocaleString() }}
          </p>
        </div>
      </div>
      <span 
        class="px-2 py-1 rounded-full text-xs font-medium"
        :class="voteClass"
      >
        {{ voteText }}
      </span>
    </div>

    <div class="mb-3">
      <p class="text-sm leading-relaxed" style="color: var(--color-text);">
        {{ props.comment.comment }}
      </p>
    </div>

    <!-- Evidence Image -->
    <div v-if="props.comment.imageUrl" class="mb-3">
      <p class="text-xs mb-2" style="color: var(--color-text-secondary);">Evidence:</p>
      <div class="relative overflow-hidden rounded-lg">
        <img 
          :src="props.comment.imageUrl" 
          :alt="`Evidence provided by ${props.comment.username}`"
          class="w-full h-32 object-cover hover:scale-105 transition-transform duration-200"
          @error="$event.target.style.display='none'"
        />
      </div>
    </div>

    <div class="flex items-center justify-between text-xs" style="color: var(--color-text-secondary);">
      <span>Comment ID: {{ props.comment.id.slice(0, 8) }}</span>
      <span>{{ props.comment.vote === 'fake' ? '🚫' : '✅' }}</span>
    </div>
  </div>
</template>
