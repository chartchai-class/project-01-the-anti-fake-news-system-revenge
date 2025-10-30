<script setup lang="ts">
import { computed } from 'vue'
import type { Comment } from '@/types'

interface Props {
  comment: Comment
  showVoteStats?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showVoteStats: true
})

// Comment 不再包含 vote 字段，移除投票相关逻辑
const voteClass = computed(() => 'status-neutral')
const voteText = computed(() => 'Comment')
const voteIcon = computed(() => '�')
const voteColor = computed(() => 'var(--color-text-secondary)')

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (target) {
    target.style.display = 'none'
  }
}

// 格式化时间显示
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return 'Today'
  } else if (diffDays === 2) {
    return 'Yesterday'
  } else if (diffDays <= 7) {
    return `${diffDays - 1} days ago`
  } else {
    return date.toLocaleDateString()
  }
}
</script>

<template>
  <div class="card-surface rounded-xl p-4 border shadow-sm hover:shadow-md transition-all duration-200" style="border-color: rgba(94, 82, 64, 0.12);">
    <!-- 用户信息和投票状态 -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center shadow-sm">
          <span class="text-white text-sm font-semibold">{{ props.comment.author.name.charAt(0).toUpperCase() }}</span>
        </div>
        <div>
          <p class="text-sm font-semibold" style="color: var(--color-text);">{{ props.comment.author.name }}</p>
          <p class="text-xs" style="color: var(--color-text-secondary);">
            {{ formatDate(props.comment.createdAt) }}
          </p>
        </div>
      </div>
      
      <!-- 投票状态徽章 -->
      <div class="flex items-center gap-2">
        <span 
          class="px-3 py-1.5 rounded-full text-xs font-medium shadow-sm"
          :class="voteClass"
        >
          <span class="flex items-center gap-1">
            {{ voteIcon }}
            {{ voteText }}
          </span>
        </span>
      </div>
    </div>

    <!-- 评论内容 -->
    <div class="mb-4">
      <p class="text-sm leading-relaxed" style="color: var(--color-text);">
        {{ props.comment.content }}
      </p>
    </div>

    <!-- 证据图片 -->
    <div v-if="props.comment.author.imageUrl" class="mb-4">
      <div class="flex items-center gap-2 mb-2">
        <svg class="w-3.5 h-3.5" style="color: var(--color-text-secondary);" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
        </svg>
        <p class="text-xs font-medium" style="color: var(--color-text-secondary);">Evidence Provided:</p>
      </div>
      <div class="relative overflow-hidden rounded-lg border" style="border-color: rgba(94, 82, 64, 0.12);">
        <img 
          :src="props.comment.author.imageUrl" 
          :alt="`Evidence provided by ${props.comment.author.name}`"
          class="w-full h-32 object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
          @error="handleImageError"
        />
        <!-- 图片遮罩层 -->
        <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
          <svg class="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 投票统计信息 -->
    <div v-if="showVoteStats" class="mb-3 p-3 rounded-lg" style="background-color: var(--color-surface); border: 1px solid rgba(94, 82, 64, 0.08);">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium" style="color: var(--color-text-secondary);">Comment Status:</span>
        <span class="text-xs font-semibold" :style="{ color: voteColor }">
          Active
        </span>
      </div>
      
      <!-- 投票置信度指示器 -->
      <div class="flex items-center gap-2">
        <span class="text-xs" style="color: var(--color-text-secondary);">Confidence:</span>
        <div class="flex-1 h-1.5 rounded-full overflow-hidden" style="background-color: var(--color-gray-200);">
          <div 
            class="h-full rounded-full transition-all duration-500 progress-real"
            :style="{ width: props.comment.author.imageUrl ? '85%' : '60%' }"
          ></div>
        </div>
        <span class="text-xs font-medium" style="color: var(--color-text);">
          {{ props.comment.author.imageUrl ? 'High' : 'Medium' }}
        </span>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="flex items-center justify-between text-xs pt-3 border-t" style="color: var(--color-text-secondary); border-color: rgba(94, 82, 64, 0.08);">
      <div class="flex items-center gap-3">
        <span class="flex items-center gap-1">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          ID: {{ props.comment.id }}
        </span>
        <span v-if="props.comment.author.imageUrl" class="flex items-center gap-1">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
          </svg>
          With Evidence
        </span>
      </div>
      
      <!-- 评论类型图标 -->
      <div class="flex items-center gap-1">
        <span class="text-lg">{{ voteIcon }}</span>
        <span class="font-medium" :style="{ color: voteColor }">
          Comment
        </span>
      </div>
    </div>
  </div>
</template>
