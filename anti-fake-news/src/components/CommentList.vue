<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CommentItem from './CommentItem.vue'
import Paginator from './Paginator.vue'
import type { Comment } from '@/types'

interface Props {
  comments: Comment[]
  pageSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 5
})

const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(props.comments.length / props.pageSize)))

const paginatedComments = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return props.comments.slice(start, end)
})

// Reset to first page when comments change
watch(() => props.comments.length, () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-xl font-semibold" style="color: var(--color-text);">
        Comments & Votes ({{ comments.length }})
      </h3>
      <div class="text-sm" style="color: var(--color-text-secondary);">
        Page {{ currentPage }} of {{ totalPages }}
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="comments.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">💬</div>
      <p class="text-lg" style="color: var(--color-text-secondary);">No comments yet</p>
      <p class="text-sm mt-2" style="color: var(--color-text-secondary);">
        Be the first to share your thoughts and vote on this news!
      </p>
    </div>

    <!-- Comments List -->
    <div v-else class="space-y-4">
      <CommentItem 
        v-for="comment in paginatedComments" 
        :key="comment.id" 
        :comment="comment" 
      />
    </div>

    <!-- Pagination -->
    <div v-if="comments.length > pageSize" class="card-surface rounded-2xl p-4">
      <Paginator 
        v-model:page="currentPage" 
        :page-count="totalPages" 
      />
    </div>
  </div>
</template>
