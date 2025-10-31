<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { newsService } from '@/services/api'
import ImageUploader from '@/components/ImageUploader.vue'
import * as yup from 'yup'
import type { NewsStatus } from '@/types'

const router = useRouter()

// Form data
const formData = ref({
  title: '',
  shortDetail: '',
  fullDetail: '',
  reporterName: '',
  imageUrls: [] as string[],
  status: 'UNKNOWN' as NewsStatus
})

// Form validation state
const fieldErrors = ref<{
  title?: string
  shortDetail?: string
  fullDetail?: string
  reporterName?: string
  imageUrls?: string
  status?: string
}>({})

// Submission state
const isSubmitting = ref(false)
const showSuccess = ref(false)
const createdNewsId = ref<number | null>(null)

// Yup validation rules
const newsSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  shortDetail: yup
    .string()
    .required('Short summary is required')
    .min(10, 'Summary must be at least 10 characters')
    .max(500, 'Summary cannot exceed 500 characters'),
  fullDetail: yup
    .string()
    .required('Full details are required')
    .min(50, 'Details must be at least 50 characters'),
  reporterName: yup
    .string()
    .required('Reporter name is required')
    .min(2, 'Reporter name must be at least 2 characters')
    .max(100, 'Reporter name cannot exceed 100 characters'),
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['UNKNOWN', 'FAKE', 'NON_FAKE'], 'Invalid status')
})

// Computed property
const canSubmit = computed(() => {
  return (
    formData.value.title.trim() !== '' &&
    formData.value.shortDetail.trim() !== '' &&
    formData.value.fullDetail.trim() !== '' &&
    formData.value.reporterName.trim() !== '' &&
    !isSubmitting.value
  )
})

// Handle image upload
const handleImageUpload = (url: string) => {
  if (url && !formData.value.imageUrls.includes(url)) {
    formData.value.imageUrls.push(url)
  }
}

// Remove image
const removeImage = (index: number) => {
  formData.value.imageUrls.splice(index, 1)
}

// Submit news
const submitNews = async () => {
  // Reset error messages
  fieldErrors.value = {}

  try {
    // Yup validation
    await newsSchema.validate(
      {
        title: formData.value.title,
        shortDetail: formData.value.shortDetail,
        fullDetail: formData.value.fullDetail,
        reporterName: formData.value.reporterName,
        status: formData.value.status
      },
      { abortEarly: false }
    )
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      // Collect all field errors
      err.inner.forEach(error => {
        if (error.path) {
          fieldErrors.value[error.path as keyof typeof fieldErrors.value] = error.message
        }
      })
    }
    return
  }

  isSubmitting.value = true

  try {
    // Submit news to backend API
    const createdNews = await newsService.create({
      title: formData.value.title,
      shortDetail: formData.value.shortDetail,
      fullDetail: formData.value.fullDetail,
      reporterName: formData.value.reporterName,
      imageUrls: formData.value.imageUrls.length > 0 ? formData.value.imageUrls : undefined,
      status: formData.value.status
    })

    isSubmitting.value = false
    showSuccess.value = true
    createdNewsId.value = createdNews.id

    // Automatically redirect to news details page after 3 seconds
    setTimeout(() => {
      router.push(`/news/${createdNews.id}`)
    }, 3000)
  } catch (error) {
    console.error('Failed to create news:', error)
    isSubmitting.value = false
    alert('Submission failed, please try again')
  }
}

// Go back to home
const goBackToHome = () => {
  router.push('/')
}

// Reset form
const resetForm = () => {
  formData.value = {
    title: '',
    shortDetail: '',
    fullDetail: '',
    reporterName: '',
    imageUrls: [],
    status: 'UNKNOWN'
  }
  fieldErrors.value = {}
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-6">
    <!-- Back button -->
    <button 
      class="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl card-surface border shadow-sm hover:shadow-md transition-all duration-200"
      style="border-color: rgba(94, 82, 64, 0.12); color: var(--color-text);"
      @click="goBackToHome">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Back to Home
    </button>

    <!-- Success message -->
    <div v-if="showSuccess" class="mb-6 card-surface rounded-2xl p-6 shadow-sm border-2" style="border-color: var(--color-success);">
      <div class="text-center">
        <div class="text-6xl mb-4">✅</div>
        <h3 class="text-xl font-semibold mb-2" style="color: var(--color-success);">News Created Successfully!</h3>
        <p class="text-sm" style="color: var(--color-text-secondary);">
          Your news has been submitted. You will be redirected to the news details page in a few seconds...
        </p>
      </div>
    </div>

    <!-- Main form -->
    <div v-else class="card-surface rounded-2xl p-8 shadow-sm">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="text-5xl mb-4">📰</div>
        <h1 class="text-3xl font-bold mb-2" style="color: var(--color-text);">
          Create News
        </h1>
        <p class="text-sm" style="color: var(--color-text-secondary);">
          Submit a news story for verification
        </p>
      </div>

      <form @submit.prevent="submitNews" class="space-y-6">
        <!-- Title -->
        <div class="space-y-3">
          <label class="block text-sm font-medium" style="color: var(--color-text);">
            Title <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="formData.title"
            type="text" 
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200" 
            :class="{ 'border-red-500': fieldErrors.title }"
            style="border-color: rgba(94, 82, 64, 0.12); background-color: var(--color-surface); color: var(--color-text); --tw-ring-color: var(--color-primary);"
            placeholder="Enter news title...">
          <p v-if="fieldErrors.title" class="text-sm text-red-500">{{ fieldErrors.title }}</p>
        </div>

        <!-- Short Detail -->
        <div class="space-y-3">
          <label class="block text-sm font-medium" style="color: var(--color-text);">
            Short Summary <span class="text-red-500">*</span>
          </label>
          <textarea 
            v-model="formData.shortDetail"
            class="w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-all duration-200" 
            :class="{ 'border-red-500': fieldErrors.shortDetail }"
            style="border-color: rgba(94, 82, 64, 0.12); background-color: var(--color-surface); color: var(--color-text); --tw-ring-color: var(--color-primary);"
            rows="3" 
            placeholder="Enter a brief summary (max 500 characters)..."></textarea>
          <p v-if="fieldErrors.shortDetail" class="text-sm text-red-500">{{ fieldErrors.shortDetail }}</p>
          <p class="text-xs" style="color: var(--color-text-secondary);">
            {{ formData.shortDetail.length }}/500 characters
          </p>
        </div>

        <!-- Full Detail -->
        <div class="space-y-3">
          <label class="block text-sm font-medium" style="color: var(--color-text);">
            Full Details <span class="text-red-500">*</span>
          </label>
          <textarea 
            v-model="formData.fullDetail"
            class="w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-all duration-200" 
            :class="{ 'border-red-500': fieldErrors.fullDetail }"
            style="border-color: rgba(94, 82, 64, 0.12); background-color: var(--color-surface); color: var(--color-text); --tw-ring-color: var(--color-primary);"
            rows="8" 
            placeholder="Enter the complete news details..."></textarea>
          <p v-if="fieldErrors.fullDetail" class="text-sm text-red-500">{{ fieldErrors.fullDetail }}</p>
        </div>

        <!-- Reporter Name -->
        <div class="space-y-3">
          <label class="block text-sm font-medium" style="color: var(--color-text);">
            Reporter Name <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="formData.reporterName"
            type="text" 
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200" 
            :class="{ 'border-red-500': fieldErrors.reporterName }"
            style="border-color: rgba(94, 82, 64, 0.12); background-color: var(--color-surface); color: var(--color-text); --tw-ring-color: var(--color-primary);"
            placeholder="Enter reporter name...">
          <p v-if="fieldErrors.reporterName" class="text-sm text-red-500">{{ fieldErrors.reporterName }}</p>
        </div>

        <!-- Status -->
        <div class="space-y-3">
          <label class="block text-sm font-medium" style="color: var(--color-text);">
            Initial Status <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-3 gap-3">
            <label class="flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:border-gray-400" 
                   :class="{ 'border-gray-600': formData.status === 'UNKNOWN' }"
                   style="border-color: rgba(94, 82, 64, 0.12);">
              <input 
                type="radio" 
                v-model="formData.status"
                value="UNKNOWN"
                class="sr-only">
              <div class="flex items-center gap-2 w-full">
                <div class="w-3 h-3 rounded-full" 
                     style="background-color: var(--color-unknown);"></div>
                <span class="text-sm font-medium" style="color: var(--color-text);">Unknown</span>
              </div>
            </label>

            <label class="flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:border-green-400" 
                   :class="{ 'border-green-600': formData.status === 'NON_FAKE' }"
                   style="border-color: rgba(94, 82, 64, 0.12);">
              <input 
                type="radio" 
                v-model="formData.status"
                value="NON_FAKE"
                class="sr-only">
              <div class="flex items-center gap-2 w-full">
                <div class="w-3 h-3 rounded-full" 
                     style="background-color: var(--color-success);"></div>
                <span class="text-sm font-medium" style="color: var(--color-text);">Real News</span>
              </div>
            </label>

            <label class="flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:border-red-400" 
                   :class="{ 'border-red-600': formData.status === 'FAKE' }"
                   style="border-color: rgba(94, 82, 64, 0.12);">
              <input 
                type="radio" 
                v-model="formData.status"
                value="FAKE"
                class="sr-only">
              <div class="flex items-center gap-2 w-full">
                <div class="w-3 h-3 rounded-full" 
                     style="background-color: var(--color-error);"></div>
                <span class="text-sm font-medium" style="color: var(--color-text);">Fake News</span>
              </div>
            </label>
          </div>
          <p v-if="fieldErrors.status" class="text-sm text-red-500">{{ fieldErrors.status }}</p>
        </div>

        <!-- Image Upload -->
        <div class="space-y-3">
          <label class="block text-sm font-medium" style="color: var(--color-text);">
            Images (Optional)
          </label>
          
          <ImageUploader 
            label="Add Image"
            placeholder="Enter image URL or upload image"
            @update:modelValue="handleImageUpload"
          />

          <!-- Uploaded images list -->
          <div v-if="formData.imageUrls.length > 0" class="space-y-2">
            <p class="text-xs font-medium" style="color: var(--color-text-secondary);">
              Uploaded Images ({{ formData.imageUrls.length }}):
            </p>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div 
                v-for="(url, index) in formData.imageUrls" 
                :key="index"
                class="relative group rounded-lg overflow-hidden border"
                style="border-color: rgba(94, 82, 64, 0.12);">
                <img 
                  :src="url" 
                  :alt="`Image ${index + 1}`"
                  class="w-full h-32 object-cover">
                <button
                  type="button"
                  @click="removeImage(index)"
                  class="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            :disabled="!canSubmit"
            class="flex-1 py-3.5 px-6 rounded-xl font-semibold shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed btn-primary">
            <span v-if="!isSubmitting">✍️ Create News</span>
            <span v-else>
              <svg class="inline w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          </button>
          
          <button
            type="button"
            @click="resetForm"
            :disabled="isSubmitting"
            class="px-6 py-3.5 rounded-xl font-semibold border shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style="border-color: rgba(94, 82, 64, 0.12); color: var(--color-text);"
            :style="{ backgroundColor: 'var(--color-surface)' }">
            🔄 Reset
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
