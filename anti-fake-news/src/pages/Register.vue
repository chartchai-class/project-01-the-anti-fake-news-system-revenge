<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const name = ref('')
const password = ref('')
const confirmPassword = ref('')
const imageUrl = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
    // 表单验证
    if (!email.value || !name.value || !password.value) {
        errorMessage.value = '请填写所有必填字段'
        return
    }

    if (password.value !== confirmPassword.value) {
        errorMessage.value = '两次输入的密码不一致'
        return
    }

    if (password.value.length < 6) {
        errorMessage.value = '密码长度至少为 6 个字符'
        return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
        await authStore.register({
            email: email.value,
            name: name.value,
            password: password.value,
            imageUrl: imageUrl.value || undefined
        })

        // 注册成功，跳转到首页
        router.push('/')
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : '注册失败，请稍后再试'
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
                <h1 class="text-3xl font-bold text-gray-900 mb-2">创建账号</h1>
                <p class="text-gray-600">加入反假新闻系统</p>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-600 text-sm">{{ errorMessage }}</p>
            </div>

            <!-- Register Form -->
            <form @submit.prevent="handleRegister" class="space-y-5">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                        邮箱 <span class="text-red-500">*</span>
                    </label>
                    <input
                        id="email"
                        v-model="email"
                        type="email"
                        required
                        placeholder="your@email.com"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                </div>

                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                        显示名称 <span class="text-red-500">*</span>
                    </label>
                    <input
                        id="name"
                        v-model="name"
                        type="text"
                        required
                        placeholder="张三"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                        密码 <span class="text-red-500">*</span>
                    </label>
                    <input
                        id="password"
                        v-model="password"
                        type="password"
                        required
                        placeholder="至少 6 个字符"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                </div>

                <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                        确认密码 <span class="text-red-500">*</span>
                    </label>
                    <input
                        id="confirmPassword"
                        v-model="confirmPassword"
                        type="password"
                        required
                        placeholder="再次输入密码"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                </div>

                <div>
                    <label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-2">
                        头像 URL (可选)
                    </label>
                    <input
                        id="imageUrl"
                        v-model="imageUrl"
                        type="url"
                        placeholder="https://example.com/avatar.jpg"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                </div>

                <button
                    type="submit"
                    :disabled="isLoading"
                    class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {{ isLoading ? '注册中...' : '注册' }}
                </button>
            </form>

            <!-- Divider -->
            <div class="mt-6 text-center">
                <p class="text-sm text-gray-600">
                    已有账号？
                    <button
                        @click="goToLogin"
                        class="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        立即登录
                    </button>
                </p>
            </div>

            <!-- Registration Info -->
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <p class="text-xs text-blue-800">
                    <strong>注意：</strong>注册成功后默认角色为 READER（只读用户）
                </p>
            </div>
        </div>
    </div>
</template>
