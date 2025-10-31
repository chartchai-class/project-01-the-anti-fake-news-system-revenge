<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ImageUploader from '@/components/ImageUploader.vue'
import * as yup from 'yup'

const router = useRouter()
const authStore = useAuthStore()

// Form data
const formData = ref({
  name: '',
  imageUrl: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Form validation state
const fieldErrors = ref<{
  name?: string
  imageUrl?: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}>({})

// UI state
const isSubmitting = ref(false)
const showSuccess = ref(false)
const isChangingPassword = ref(false)

// Initialize form with current user data
onMounted(() => {
  if (authStore.user) {
    formData.value.name = authStore.user.name
    formData.value.imageUrl = authStore.user.imageUrl || ''
  }
})

// Computed properties
const currentUser = computed(() => authStore.user)
const displayAvatar = computed(() => {
  return formData.value.imageUrl || authStore.avatarUrl
})

// Yup validation rules
const profileSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  imageUrl: yup
    .string()
    .url('Please enter a valid URL')
    .nullable()
})

const passwordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password cannot exceed 50 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords do not match')
})

// Handle image upload
const handleImageUpload = (url: string) => {
  if (url) {
    formData.value.imageUrl = url
  }
}

// Update profile
const updateProfile = async () => {
  fieldErrors.value = {}

  try {
    // Validate profile data
    await profileSchema.validate(
      {
        name: formData.value.name,
        imageUrl: formData.value.imageUrl || null
      },
      { abortEarly: false }
    )

    // If changing password, validate password fields
    if (isChangingPassword.value) {
      await passwordSchema.validate(
        {
          currentPassword: formData.value.currentPassword,
          newPassword: formData.value.newPassword,
          confirmPassword: formData.value.confirmPassword
        },
        { abortEarly: false }
      )
    }
  } catch (err) {
    if (err instanceof yup.ValidationError) {
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
    const updateData: any = {
      name: formData.value.name,
      imageUrl: formData.value.imageUrl || undefined
    }

    if (isChangingPassword.value) {
      updateData.currentPassword = formData.value.currentPassword
      updateData.newPassword = formData.value.newPassword
    }

    await authStore.updateProfile(updateData)
    
    isSubmitting.value = false
    showSuccess.value = true

    // Clear password fields
    formData.value.currentPassword = ''
    formData.value.newPassword = ''
    formData.value.confirmPassword = ''
    isChangingPassword.value = false

    // Auto hide success message after 3 seconds
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('Failed to update profile:', error)
    isSubmitting.value = false
    alert(error instanceof Error ? error.message : 'Failed to update profile')
  }
}

// Cancel and go back
const goBack = () => {
  router.push('/')
}

// Reset form
const resetForm = () => {
  if (authStore.user) {
    formData.value.name = authStore.user.name
    formData.value.imageUrl = authStore.user.imageUrl || ''
  }
  formData.value.currentPassword = ''
  formData.value.newPassword = ''
  formData.value.confirmPassword = ''
  fieldErrors.value = {}
  isChangingPassword.value = false
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-6 py-6">
    <!-- Back button -->
    <button 
      class="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl card-surface border shadow-sm hover:shadow-md transition-all duration-200"
      style="border-color: rgba(94, 82, 64, 0.12); color: var(--color-text);"
      @click="goBack">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Back to Home
    </button>

    <!-- Success message -->
    <div v-if="showSuccess" class="mb-6 card-surface rounded-2xl p-6 shadow-sm border-2" style="border-color: var(--color-success);">
      <div class="flex items-center gap-3">
        <div class="text-3xl">✅</div>
        <div>
          <h3 class="font-semibold" style="color: var(--color-success);">Profile Updated Successfully!</h3>
          <p class="text-sm" style="color: var(--color-text-secondary);">
            Your changes have been saved.
          </p>
        </div>
      </div>
    </div>

    <!-- Main form -->
    <div class="card-surface rounded-2xl p-8 shadow-sm">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-block relative mb-4">
          <img 
            :src="displayAvatar" 
            :alt="formData.name"
            class="w-24 h-24 rounded-full border-4 border-white shadow-lg">
          <div class="absolute bottom-0 right-0 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shadow-lg">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
          </div>
        </div>
        <h1 class="text-3xl font-bold mb-2" style="color: var(--color-text);">
          Edit Profile
        </h1>
        <p class="text-sm" style="color: var(--color-text-secondary);">
          Update your personal information
        </p>
      </div>

      <form @submit.prevent="updateProfile" class="space-y-6">
        <!-- Email (Read-only) -->
        <div class="space-y-3">
          <label class="block text-sm font-medium" style="color: var(--color-text);">
            Email Address
          </label>
          <input 
            :value="currentUser?.email"
            type="email" 
            disabled
            class="w-full px-4 py-3 rounded-xl border bg-gray-50 cursor-not-allowed opacity-60" 
            style="border-color: rgba(94, 82, 64, 0.12); color: var(--color-text);">
          <p class="text-xs" style="color: var(--color-text-secondary);">
            Email cannot be changed
          </p>
        </div>

        <!-- Name -->
        <div class="space-y-3">
          <label class="block text-sm font-medium" style="color: var(--color-text);">
            Display Name <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="formData.name"
            type="text" 
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200" 
            :class="{ 'border-red-500': fieldErrors.name }"
            style="border-color: rgba(94, 82, 64, 0.12); background-color: var(--color-surface); color: var(--color-text); --tw-ring-color: var(--color-primary);"
            placeholder="Enter your name...">
          <p v-if="fieldErrors.name" class="text-sm text-red-500">{{ fieldErrors.name }}</p>
        </div>

        <!-- Avatar -->
        <div class="space-y-3">
          <label class="block text-sm font-medium" style="color: var(--color-text);">
            Profile Picture
          </label>
          
          <ImageUploader 
            v-model="formData.imageUrl"
            label="Profile Picture"
            placeholder="Enter image URL or upload image"
            @update:modelValue="handleImageUpload"
          />

          <p v-if="fieldErrors.imageUrl" class="text-sm text-red-500">{{ fieldErrors.imageUrl }}</p>
        </div>

        <!-- Roles (Read-only) -->
        <div class="space-y-3">
          <label class="block text-sm font-medium" style="color: var(--color-text);">
            Account Roles
          </label>
          <div class="flex gap-2">
            <span
              v-for="role in currentUser?.roles"
              :key="role"
              class="px-3 py-1.5 rounded-full text-sm font-medium"
              :class="{
                'bg-red-100 text-red-700': role === 'ADMIN',
                'bg-blue-100 text-blue-700': role === 'MEMBER',
                'bg-gray-100 text-gray-700': role === 'READER'
              }">
              {{ role }}
            </span>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t" style="border-color: rgba(94, 82, 64, 0.12);"></div>

        <!-- Change Password Toggle -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold" style="color: var(--color-text);">Change Password</h3>
            <p class="text-sm" style="color: var(--color-text-secondary);">
              Update your account password
            </p>
          </div>
          <button
            type="button"
            @click="isChangingPassword = !isChangingPassword"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            :class="isChangingPassword ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'">
            {{ isChangingPassword ? '✕ Cancel' : '🔒 Change Password' }}
          </button>
        </div>

        <!-- Password fields (shown when changing password) -->
        <div v-if="isChangingPassword" class="space-y-4 p-4 rounded-xl bg-gray-50">
          <!-- Current Password -->
          <div class="space-y-2">
            <label class="block text-sm font-medium" style="color: var(--color-text);">
              Current Password <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="formData.currentPassword"
              type="password" 
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200" 
              :class="{ 'border-red-500': fieldErrors.currentPassword }"
              style="border-color: rgba(94, 82, 64, 0.12); background-color: var(--color-surface); color: var(--color-text); --tw-ring-color: var(--color-primary);"
              placeholder="Enter current password...">
            <p v-if="fieldErrors.currentPassword" class="text-sm text-red-500">{{ fieldErrors.currentPassword }}</p>
          </div>

          <!-- New Password -->
          <div class="space-y-2">
            <label class="block text-sm font-medium" style="color: var(--color-text);">
              New Password <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="formData.newPassword"
              type="password" 
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200" 
              :class="{ 'border-red-500': fieldErrors.newPassword }"
              style="border-color: rgba(94, 82, 64, 0.12); background-color: var(--color-surface); color: var(--color-text); --tw-ring-color: var(--color-primary);"
              placeholder="Enter new password...">
            <p v-if="fieldErrors.newPassword" class="text-sm text-red-500">{{ fieldErrors.newPassword }}</p>
          </div>

          <!-- Confirm Password -->
          <div class="space-y-2">
            <label class="block text-sm font-medium" style="color: var(--color-text);">
              Confirm New Password <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="formData.confirmPassword"
              type="password" 
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200" 
              :class="{ 'border-red-500': fieldErrors.confirmPassword }"
              style="border-color: rgba(94, 82, 64, 0.12); background-color: var(--color-surface); color: var(--color-text); --tw-ring-color: var(--color-primary);"
              placeholder="Confirm new password...">
            <p v-if="fieldErrors.confirmPassword" class="text-sm text-red-500">{{ fieldErrors.confirmPassword }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 py-3.5 px-6 rounded-xl font-semibold shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed btn-primary">
            <span v-if="!isSubmitting">💾 Save Changes</span>
            <span v-else>
              <svg class="inline w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
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
