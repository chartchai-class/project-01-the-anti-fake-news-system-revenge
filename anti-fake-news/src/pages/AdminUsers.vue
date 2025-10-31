<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { adminService } from '@/services/api'
import type { User, Role } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const users = ref<User[]>([])
const isLoading = ref(false)
const errorMessage = ref('')

// Check permissions
onMounted(async () => {
    if (!authStore.isAdmin) {
        alert('You do not have permission to access this page')
        router.push('/')
        return
    }
    await loadUsers()
})

const loadUsers = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
        users.value = await adminService.getAllUsers()
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : 'Failed to load user list'
    } finally {
        isLoading.value = false
    }
}

const updateRole = async (userId: number, newRole: Role) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
        return
    }

    try {
        await adminService.updateUserRole(userId, newRole)
        await loadUsers() // Refresh list
        alert('Role updated successfully')
    } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to update role')
    }
}

const getRoleBadgeColor = (role: Role): string => {
    switch (role) {
        case 'ADMIN':
            return 'bg-red-100 text-red-800'
        case 'MEMBER':
            return 'bg-blue-100 text-blue-800'
        case 'READER':
            return 'bg-gray-100 text-gray-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

const goBack = () => {
    router.push('/')
}
</script>

<template>
    <div class="min-h-screen bg-gray-50 py-8 px-4">
        <div class="max-w-6xl mx-auto">
            <!-- Header -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
                        <p class="text-gray-600 mt-1">Manage all user roles and permissions</p>
                    </div>
                    <button
                        @click="goBack"
                        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                    >
                        Back to Home
                    </button>
                </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-600">{{ errorMessage }}</p>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p class="mt-4 text-gray-600">Loading...</p>
            </div>

            <!-- Users Table -->
            <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition">
                                <!-- ID -->
                                <td class="px-6 py-4 text-sm text-gray-900">
                                    {{ user.id }}
                                </td>

                                <!-- User Info -->
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <img
                                            :src="user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`"
                                            :alt="user.name"
                                            class="w-10 h-10 rounded-full mr-3"
                                        />
                                        <div>
                                            <p class="text-sm font-semibold text-gray-900">{{ user.name }}</p>
                                        </div>
                                    </div>
                                </td>

                                <!-- Email -->
                                <td class="px-6 py-4 text-sm text-gray-700">
                                    {{ user.email }}
                                </td>

                                <!-- Roles -->
                                <td class="px-6 py-4">
                                    <div class="flex flex-wrap gap-2">
                                        <span
                                            v-for="role in user.roles"
                                            :key="role"
                                            :class="getRoleBadgeColor(role)"
                                            class="px-3 py-1 rounded-full text-xs font-semibold"
                                        >
                                            {{ role }}
                                        </span>
                                    </div>
                                </td>

                                <!-- Actions -->
                                <td class="px-6 py-4">
                                    <div class="flex gap-2">
                                        <button
                                            v-if="!user.roles.includes('READER')"
                                            @click="updateRole(user.id, 'READER')"
                                            class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition"
                                        >
                                            Set to READER
                                        </button>
                                        <button
                                            v-if="!user.roles.includes('MEMBER')"
                                            @click="updateRole(user.id, 'MEMBER')"
                                            class="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition"
                                        >
                                            Set to MEMBER
                                        </button>
                                        <button
                                            v-if="!user.roles.includes('ADMIN')"
                                            @click="updateRole(user.id, 'ADMIN')"
                                            class="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition"
                                        >
                                            Set to ADMIN
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Empty State -->
                <div v-if="users.length === 0 && !isLoading" class="text-center py-12">
                    <p class="text-gray-500">No user data available</p>
                </div>
            </div>

            <!-- Role Descriptions -->
            <div class="mt-6 bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Role Descriptions</h2>
                <div class="space-y-3">
                    <div class="flex items-start">
                        <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold mr-3">READER</span>
                        <p class="text-sm text-gray-600">Read-only user, can browse news and vote, but cannot publish content</p>
                    </div>
                    <div class="flex items-start">
                        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold mr-3">MEMBER</span>
                        <p class="text-sm text-gray-600">Member user, can publish news, comments and vote</p>
                    </div>
                    <div class="flex items-start">
                        <span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold mr-3">ADMIN</span>
                        <p class="text-sm text-gray-600">Administrator, has all permissions, including managing user roles</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
