<script setup lang="ts">
import { ref } from 'vue'
import { uploadService } from '@/services/api'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  required?: boolean
  error?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Image',
  placeholder: 'Enter image URL or upload an image',
  required: false
})

const emit = defineEmits<Emits>()

const isUploading = ref(false)
const uploadProgress = ref(0)
const previewUrl = ref<string>(props.modelValue || '')
const fileInput = ref<HTMLInputElement | null>(null)

// Open file selector
const openFileSelector = () => {
  fileInput.value?.click()
}

// Handle file selection
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    alert('Only image files are allowed (JPG, PNG, GIF, WebP)')
    return
  }

  // Validate file size (10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    alert('File size cannot exceed 10MB')
    return
  }

  try {
    isUploading.value = true
    uploadProgress.value = 0

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 100)

    // Upload file
    const url = await uploadService.uploadImage(file)
    
    clearInterval(progressInterval)
    uploadProgress.value = 100

    // Update preview and value
    previewUrl.value = url
    emit('update:modelValue', url)

    // Reset progress
    setTimeout(() => {
      isUploading.value = false
      uploadProgress.value = 0
    }, 500)

  } catch (error: any) {
    alert(`Upload failed: ${error.message}`)
    isUploading.value = false
    uploadProgress.value = 0
  }

  // Reset input
  if (target) target.value = ''
}

// Handle manual URL input
const handleUrlInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const url = target.value
  previewUrl.value = url
  emit('update:modelValue', url)
}

// Clear image
const clearImage = () => {
  previewUrl.value = ''
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="space-y-3">
    <label class="block text-sm font-medium" style="color: var(--color-text);">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- URL 输入框 -->
    <div class="relative">
      <input 
        :value="modelValue"
        @input="handleUrlInput"
        type="url" 
        class="w-full px-4 py-3 pr-32 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200" 
        :class="{ 'border-red-500': error }"
        style="border-color: rgba(94, 82, 64, 0.12); background-color: var(--color-surface); color: var(--color-text); --tw-ring-color: var(--color-primary);"
        :placeholder="placeholder"
        :disabled="isUploading">
      
      <!-- Upload button -->
      <button 
        type="button"
        @click="openFileSelector"
        :disabled="isUploading"
        class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        :class="isUploading ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600 text-white'">
        <span v-if="!isUploading">📤 Upload</span>
        <span v-else>Uploading...</span>
      </button>
    </div>

    <!-- Upload progress bar -->
    <div v-if="isUploading" class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div 
        class="h-full bg-teal-500 transition-all duration-300 ease-out"
        :style="{ width: uploadProgress + '%' }"></div>
    </div>

    <!-- Image preview -->
    <div v-if="previewUrl && !isUploading" class="relative inline-block">
      <img 
        :src="previewUrl" 
        alt="Preview"
        class="max-w-xs max-h-48 rounded-lg border-2 shadow-sm object-cover"
        style="border-color: rgba(94, 82, 64, 0.12);"
        @error="previewUrl = ''">
      
      <!-- Delete button -->
      <button 
        type="button"
        @click="clearImage"
        class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 flex items-center justify-center text-xs font-bold shadow-md">
        ✕
      </button>
    </div>

    <!-- Error message -->
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

    <!-- Helper text -->
    <p class="text-xs" style="color: var(--color-text-secondary);">
      Supports JPG, PNG, GIF, WebP formats, max 10MB
    </p>

    <!-- Hidden file input -->
    <input 
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
      class="hidden"
      @change="handleFileChange">
  </div>
</template>
