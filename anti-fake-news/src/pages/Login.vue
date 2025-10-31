<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import '@/config/firebase' // Import Firebase SDK
import * as yup from 'yup'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const fieldErrors = ref<{ email?: string, password?: string }>({})
const isLoading = ref(false)

// Yup validation rules
const loginSchema = yup.object({
    email: yup
        .string()
        .required('Email cannot be empty')
        .email('Please enter a valid email address'),
    password: yup
        .string()
        .required('Password cannot be empty')
        .min(6, 'Password must be at least 6 characters')
})

// Initialize Firebase (automatically initialized by import)
onMounted(() => {
    console.log('Firebase SDK initialized')
})

const handleLogin = async () => {
    // Reset error messages
    errorMessage.value = ''
    fieldErrors.value = {}

    try {
        // Yup validation
        await loginSchema.validate(
            { 
                email: email.value, 
                password: password.value 
            },
            { abortEarly: false }
        )
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            // Collect all field errors
            err.inner.forEach(error => {
                if (error.path) {
                    fieldErrors.value[error.path as 'email' | 'password'] = error.message
                }
            })
        }
        return
    }

    isLoading.value = true

    try {
        // Call backend login API - fields fully match backend LoginRequest
        await authStore.login({
            email: email.value,
            password: password.value
        })

        // Login successful, redirect to home
        router.push('/')
    } catch (error) {
        // Display error message from backend
        errorMessage.value = error instanceof Error ? error.message : 'Login failed, please check your email and password'
    } finally {
        isLoading.value = false
    }
}

const goToRegister = () => {
    router.push('/register')
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
            <!-- Logo/Title -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p class="text-gray-600">Login to Anti-Fake News System</p>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-600 text-sm">{{ errorMessage }}</p>
            </div>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin" class="space-y-6">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                        Email
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
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <input
                        id="password"
                        v-model="password"
                        type="password"
                        placeholder="••••••••"
                        :class="[
                            'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition',
                            fieldErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        ]"
                    />
                    <p v-if="fieldErrors.password" class="mt-1 text-sm text-red-600">{{ fieldErrors.password }}</p>
                </div>

                <button
                    type="submit"
                    :disabled="isLoading"
                    class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {{ isLoading ? 'Logging in...' : 'Login' }}
                </button>
            </form>

            <!-- Divider -->
            <div class="mt-6 text-center">
                <p class="text-sm text-gray-600">
                    Don't have an account?
                    <button
                        @click="goToRegister"
                        class="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        Register now
                    </button>
                </p>
            </div>

            <!-- Test Account Info -->
            <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                <p class="text-xs text-gray-600 mb-2 font-semibold">Test Account:</p>
                <div class="space-y-1 text-xs text-gray-500">
                    <p>Admin: admin@local / admin123</p>
                </div>
            </div>
        </div>
    </div>
</template>
