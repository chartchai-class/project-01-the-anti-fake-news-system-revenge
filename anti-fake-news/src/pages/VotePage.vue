<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { newsSeed } from '@/data/news'
import type { Comment } from '@/types'
import { useCommentsStore } from '@/stores/comments'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 获取新闻信息
const newsId = Number(route.params.id)  // 改为 number
const newsItem = newsSeed.find(n => n.id === newsId)

// 表单数据
const formData = ref({
  vote: '',
  comment: '',
  imageUrl: ''
})

// 表单验证状态
const errors = ref({
  vote: '',
  comment: '',
  imageUrl: ''
})

// 投票状态
const isSubmitting = ref(false)
const showSuccess = ref(false)
const commentsStore = useCommentsStore()

// 计算属性
const canSubmit = computed(() => {
  return formData.value.vote !== '' && !isSubmitting.value
})

// 表单验证
const validateForm = () => {
  errors.value = { vote: '', comment: '', imageUrl: '' }
  let isValid = true

  if (!formData.value.vote) {
    errors.value.vote = 'Please select your vote'
    isValid = false
  }

  if (formData.value.comment.trim().length === 0) {
    errors.value.comment = 'Comment is required'
    isValid = false
  }

  if (formData.value.imageUrl && !isValidUrl(formData.value.imageUrl)) {
    errors.value.imageUrl = 'Please enter a valid URL'
    isValid = false
  }

  return isValid
}

// URL 验证
const isValidUrl = (string: string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

// 提交投票
const submitVote = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  
  // 模拟 API 调用
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 更新本地数据（这里应该调用实际的 API）
  if (newsItem) {
    if (formData.value.vote === 'Fake') {
      newsItem.fakeVotes++
    } else {
      newsItem.trueVotes++
    }
  }

  // 保存用户评论到 localStorage
  const newComment: Comment = {
    id: Date.now(),  // 改为 number
    content: formData.value.comment,  // 改为 content
    author: {  // 改为 author 对象
      id: authStore.user?.id || 0,
      name: authStore.displayName,
      imageUrl: formData.value.imageUrl || authStore.avatarUrl
    },
    news: {  // 添加 news 对象
      id: newsId,
      title: newsItem?.title || 'Unknown'
    },
    isDeleted: false,
    createdAt: new Date().toISOString()
  }

  // 使用 Pinia 评论 store 持久化
  commentsStore.add(newsId, newComment)

  // 更新新闻投票数据到 localStorage
  const newsData = JSON.parse(localStorage.getItem(`news_${newsId}`) || '{}')
  newsData.fakeVotes = newsItem?.fakeVotes || 0
  newsData.trueVotes = newsItem?.trueVotes || 0
  localStorage.setItem(`news_${newsId}`, JSON.stringify(newsData))

  isSubmitting.value = false
  showSuccess.value = true

  // 3秒后自动返回新闻详情页
  setTimeout(() => {
    router.push(`/news/${newsId}`)
  }, 3000)
}

// 返回新闻详情页
const goBackToNews = () => {
  router.push(`/news/${newsId}`)
}

// 重置表单
const resetForm = () => {
  formData.value = { vote: '', comment: '', imageUrl: '' }
  errors.value = { vote: '', comment: '', imageUrl: '' }
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-6 py-6">
    <!-- 返回按钮 -->
    <button 
      class="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl card-surface border shadow-sm hover:shadow-md transition-all duration-200"
      style="border-color: rgba(94, 82, 64, 0.12); color: var(--color-text);"
      @click="goBackToNews">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Back to News Details
    </button>

    <!-- 投票成功提示 -->
    <div v-if="showSuccess" class="mb-6 card-surface rounded-2xl p-6 shadow-sm border-2" style="border-color: var(--color-success);">
      <div class="text-center">
        <div class="text-6xl mb-4">✅</div>
        <h3 class="text-xl font-semibold mb-2" style="color: var(--color-success);">Vote Submitted Successfully!</h3>
        <p class="text-sm" style="color: var(--color-text-secondary);">
          Thank you for participating. You will be redirected to the news details page in a few seconds...
        </p>
        <button 
          @click="goBackToNews"
          class="mt-4 px-6 py-2 rounded-xl text-sm font-medium btn-primary">
          Go Back Now
        </button>
      </div>
    </div>

    <!-- 投票表单 -->
    <div v-else class="card-surface rounded-2xl p-8 shadow-sm">
      <!-- 新闻信息 -->
      <div v-if="newsItem" class="text-center mb-8">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center btn-primary">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold mb-2" style="color: var(--color-text);">
          Participate in Voting
        </h1>
        <p class="text-lg mb-2" style="color: var(--color-text-secondary);">
          News #{{ newsId }}
        </p>
        <p class="text-sm" style="color: var(--color-text-secondary);">
          {{ newsItem.title }}
        </p>
      </div>

      <form @submit.prevent="submitVote" class="space-y-6">
        <!-- 投票选择 -->
        <div class="space-y-3">
          <label class="block text-sm font-medium" style="color: var(--color-text);">
            What do you think about this news? <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 gap-3">
            <label class="flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:border-teal-300" 
                   :class="{ 'border-teal-500': formData.vote === 'Real' }"
                   style="border-color: rgba(94, 82, 64, 0.12);">
              <input 
                type="radio" 
                name="vote" 
                value="Real" 
                v-model="formData.vote"
                class="sr-only">
              <div class="w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center" 
                   :class="{ 'border-teal-500': formData.vote === 'Real' }"
                   style="border-color: var(--color-primary);">
                <div v-if="formData.vote === 'Real'" 
                     class="w-2 h-2 rounded-full" 
                     style="background-color: var(--color-primary);"></div>
              </div>
              <span class="text-sm font-medium" style="color: var(--color-text);">Real News</span>
            </label>
            
            <label class="flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:border-red-300"
                   :class="{ 'border-red-500': formData.vote === 'Fake' }"
                   style="border-color: rgba(94, 82, 64, 0.12);">
              <input 
                type="radio" 
                name="vote" 
                value="Fake" 
                v-model="formData.vote"
                class="sr-only">
              <div class="w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center"
                   :class="{ 'border-red-500': formData.vote === 'Fake' }"
                   style="border-color: var(--color-error);">
                <div v-if="formData.vote === 'Fake'" 
                     class="w-2 h-2 rounded-full" 
                     style="background-color: var(--color-error);"></div>
              </div>
              <span class="text-sm font-medium" style="color: var(--color-text);">Fake News</span>
            </label>
          </div>
          <p v-if="errors.vote" class="text-sm text-red-500">{{ errors.vote }}</p>
        </div>

        <!-- 评论 -->
        <div class="space-y-3">
          <label class="block text-sm font-medium" style="color: var(--color-text);">
            Comment <span class="text-red-500">*</span>
          </label>
          <textarea 
            v-model="formData.comment"
            class="w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-all duration-200" 
            :class="{ 'border-red-500': errors.comment }"
            style="border-color: rgba(94, 82, 64, 0.12); background-color: var(--color-surface); color: var(--color-text); --tw-ring-color: var(--color-primary);"
            rows="4" 
            placeholder="Please enter your comment..."></textarea>
          <p v-if="errors.comment" class="text-sm text-red-500">{{ errors.comment }}</p>
        </div>

        <!-- 图片链接 -->
        <div class="space-y-3">
          <label class="block text-sm font-medium" style="color: var(--color-text);">Image URL (Optional)</label>
          <input 
            v-model="formData.imageUrl"
            type="url" 
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200" 
            :class="{ 'border-red-500': errors.imageUrl }"
            style="border-color: rgba(94, 82, 64, 0.12); background-color: var(--color-surface); color: var(--color-text); --tw-ring-color: var(--color-primary);"
            placeholder="https://example.com/image.jpg">
          <p v-if="errors.imageUrl" class="text-sm text-red-500">{{ errors.imageUrl }}</p>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-4">
          <button 
            type="button"
            @click="resetForm"
            class="flex-1 px-6 py-3 rounded-xl text-base font-medium card-surface border shadow-sm hover:shadow-md transition-all duration-200"
            style="border-color: rgba(94, 82, 64, 0.12); color: var(--color-text);">
            Reset Form
          </button>
          
          <button 
            type="submit" 
            :disabled="!canSubmit"
            class="flex-1 px-6 py-3 rounded-xl text-base font-medium btn-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
            <span v-else>Submit Vote</span>
          </button>
        </div>
      </form>
    </div>

    <!-- 新闻未找到提示 -->
    <div v-if="!newsItem" class="text-center py-20">
      <div class="text-6xl mb-4">📰</div>
      <p class="text-xl" style="color: var(--color-text-secondary);">News not found</p>
      <button 
        @click="goBackToNews"
        class="mt-4 px-6 py-2 rounded-xl text-sm font-medium btn-primary">
        Back to Home
      </button>
    </div>
  </div>
</template>
