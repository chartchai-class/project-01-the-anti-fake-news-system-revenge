<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ImageUploader from '@/components/ImageUploader.vue'
import * as yup from 'yup'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const name = ref('')
const password = ref('')
const confirmPassword = ref('')
const imageUrl = ref('')
const errorMessage = ref('')
const fieldErrors = ref<{ email?: string, name?: string, password?: string, confirmPassword?: string, imageUrl?: string }>({})
const isLoading = ref(false)

// Yup validation rules
const registerSchema = yup.object({
    email: yup
        .string()
        .required('Email cannot be empty')
        .email('Please enter a valid email address'),
    name: yup
        .string()
        .required('Display name cannot be empty')
        .min(2, 'Display name must be at least 2 characters')
        .max(50, 'Display name cannot exceed 50 characters'),
    password: yup
        .string()
        .required('Password cannot be empty')
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password cannot exceed 100 characters'),
    confirmPassword: yup
        .string()
        .required('Please confirm password')
        .oneOf([yup.ref('password')], 'Passwords do not match'),
    imageUrl: yup
        .string()
        .url('Please enter a valid URL')
        .nullable()
})

const handleRegister = async () => {
    // Reset error messages
    errorMessage.value = ''
    fieldErrors.value = {}

    try {
        // Yup validation
        await registerSchema.validate(
            {
                email: email.value,
                name: name.value,
                password: password.value,
                confirmPassword: confirmPassword.value,
                imageUrl: imageUrl.value || null
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

    isLoading.value = true

    try {
        await authStore.register({
            email: email.value,
            name: name.value,
            password: password.value,
            imageUrl: imageUrl.value || undefined
        })

        // Registration successful, redirect to home
        router.push('/')
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : 'Registration failed, please try again later'
    } finally {
        isLoading.value = false
    }
}

const goToLogin = () => {
    router.push('/login')
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
            <!-- Logo/Title -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p class="text-gray-600">Join Anti-Fake News System</p>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-600 text-sm">{{ errorMessage }}</p>
            </div>

            <!-- Register Form -->
            <form @submit.prevent="handleRegister" class="space-y-5">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                        Email <span class="text-red-500">*</span>
                    </label>
                    <input
                        id="email"
                        v-model="email"
                        type="email"
                        placeholder="your@email.com"
                        :class="[
                            'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition',
                            fieldErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        ]"
                    />
                    <p v-if="fieldErrors.email" class="mt-1 text-sm text-red-600">{{ fieldErrors.email }}</p>
                </div>

                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                        Display Name <span class="text-red-500">*</span>
                    </label>
                    <input
                        id="name"
                        v-model="name"
                        type="text"
                        placeholder="John Doe"
                        :class="[
                            'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition',
                            fieldErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        ]"
                    />
                    <p v-if="fieldErrors.name" class="mt-1 text-sm text-red-600">{{ fieldErrors.name }}</p>
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                        Password <span class="text-red-500">*</span>
                    </label>
                    <input
                        id="password"
                        v-model="password"
                        type="password"
                        placeholder="At least 6 characters"
                        :class="[
                            'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition',
                            fieldErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        ]"
                    />
                    <p v-if="fieldErrors.password" class="mt-1 text-sm text-red-600">{{ fieldErrors.password }}</p>
                </div>

                <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password <span class="text-red-500">*</span>
                    </label>
                    <input
                        id="confirmPassword"
                        v-model="confirmPassword"
                        type="password"
                        placeholder="Enter password again"
                        :class="[
                            'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition',
                            fieldErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        ]"
                    />
                    <p v-if="fieldErrors.confirmPassword" class="mt-1 text-sm text-red-600">{{ fieldErrors.confirmPassword }}</p>
                </div>

                <!-- Avatar upload -->
                <ImageUploader 
                  v-model="imageUrl"
                  label="Avatar (Optional)"
                  placeholder="Enter avatar URL or click upload button"
                  :error="fieldErrors.imageUrl"
                />

                <button
                    type="submit"
                    :disabled="isLoading"
                    class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {{ isLoading ? 'Registering...' : 'Register' }}
                </button>
            </form>

            <!-- Divider -->
            <div class="mt-6 text-center">
                <p class="text-sm text-gray-600">
                    Already have an account?
                    <button
                        @click="goToLogin"
                        class="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        Login now
                    </button>
                </p>
            </div>

            <!-- Registration Info -->
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <p class="text-xs text-blue-800">
                    <strong>Note:</strong> After successful registration, the default role is READER (read-only user)
                </p>
            </div>
        </div>
    </div>
</template>
