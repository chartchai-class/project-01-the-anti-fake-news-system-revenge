<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
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

// Yup 验证规则
const registerSchema = yup.object({
    email: yup
        .string()
        .required('邮箱不能为空')
        .email('请输入有效的邮箱地址'),
    name: yup
        .string()
        .required('显示名称不能为空')
        .min(2, '显示名称至少需要 2 个字符')
        .max(50, '显示名称不能超过 50 个字符'),
    password: yup
        .string()
        .required('密码不能为空')
        .min(6, '密码长度至少为 6 个字符')
        .max(100, '密码长度不能超过 100 个字符'),
    confirmPassword: yup
        .string()
        .required('请确认密码')
        .oneOf([yup.ref('password')], '两次输入的密码不一致'),
    imageUrl: yup
        .string()
        .url('请输入有效的 URL')
        .nullable()
})

const handleRegister = async () => {
    // 重置错误信息
    errorMessage.value = ''
    fieldErrors.value = {}

    try {
        // Yup 验证
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
            // 收集所有字段错误
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
                        显示名称 <span class="text-red-500">*</span>
                    </label>
                    <input
                        id="name"
                        v-model="name"
                        type="text"
                        placeholder="张三"
                        :class="[
                            'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition',
                            fieldErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        ]"
                    />
                    <p v-if="fieldErrors.name" class="mt-1 text-sm text-red-600">{{ fieldErrors.name }}</p>
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                        密码 <span class="text-red-500">*</span>
                    </label>
                    <input
                        id="password"
                        v-model="password"
                        type="password"
                        placeholder="至少 6 个字符"
                        :class="[
                            'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition',
                            fieldErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        ]"
                    />
                    <p v-if="fieldErrors.password" class="mt-1 text-sm text-red-600">{{ fieldErrors.password }}</p>
                </div>

                <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                        确认密码 <span class="text-red-500">*</span>
                    </label>
                    <input
                        id="confirmPassword"
                        v-model="confirmPassword"
                        type="password"
                        placeholder="再次输入密码"
                        :class="[
                            'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition',
                            fieldErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        ]"
                    />
                    <p v-if="fieldErrors.confirmPassword" class="mt-1 text-sm text-red-600">{{ fieldErrors.confirmPassword }}</p>
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
                        :class="[
                            'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition',
                            fieldErrors.imageUrl ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        ]"
                    />
                    <p v-if="fieldErrors.imageUrl" class="mt-1 text-sm text-red-600">{{ fieldErrors.imageUrl }}</p>
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
