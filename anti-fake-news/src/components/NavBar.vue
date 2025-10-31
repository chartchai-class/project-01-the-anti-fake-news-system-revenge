<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.user)
const displayName = computed(() => authStore.displayName)
const avatarUrl = computed(() => authStore.avatarUrl)
const isAdmin = computed(() => authStore.isAdmin)

const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
        authStore.logout()
        router.push('/login')
    }
}

const goToLogin = () => {
    router.push('/login')
}

const goToRegister = () => {
    router.push('/register')
}

const goToAdminUsers = () => {
    router.push('/admin/users')
}

const goToHome = () => {
    router.push('/')
}
</script>

<template>
    <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <!-- Logo -->
                <div class="flex items-center cursor-pointer" @click="goToHome">
                    <div class="flex items-center">
                        <span class="text-2xl mr-2">🛡️</span>
                        <div>
                            <h1 class="text-xl font-bold text-gray-900">Anti-Fake News System</h1>
                            <p class="text-xs text-gray-500">Combating Misinformation</p>
                        </div>
                    </div>
                </div>

                <!-- User Menu -->
                <div class="flex items-center gap-4">
                    <!-- Logged in state -->
                    <template v-if="isAuthenticated && currentUser">
                        <!-- Admin Button -->
                        <button
                            v-if="isAdmin"
                            @click="goToAdminUsers"
                            class="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition font-medium text-sm"
                        >
                            👥 User Management
                        </button>

                        <!-- User Info -->
                        <div class="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                            <img
                                :src="avatarUrl"
                                :alt="displayName"
                                class="w-8 h-8 rounded-full"
                            />
                            <div class="text-left">
                                <p class="text-sm font-semibold text-gray-900">{{ displayName }}</p>
                                <div class="flex gap-1">
                                    <span
                                        v-for="role in currentUser.roles"
                                        :key="role"
                                        class="text-xs px-2 py-0.5 rounded-full"
                                        :class="{
                                            'bg-red-100 text-red-700': role === 'ADMIN',
                                            'bg-blue-100 text-blue-700': role === 'MEMBER',
                                            'bg-gray-100 text-gray-700': role === 'READER'
                                        }"
                                    >
                                        {{ role }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Logout Button -->
                        <button
                            @click="handleLogout"
                            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium text-sm"
                        >
                            Logout
                        </button>
                    </template>

                    <!-- Not logged in state -->
                    <template v-else>
                        <button
                            @click="goToLogin"
                            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium text-sm"
                        >
                            Login
                        </button>
                        <button
                            @click="goToRegister"
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm"
                        >
                            Register
                        </button>
                    </template>
                </div>
            </div>
        </div>
    </nav>
</template>
