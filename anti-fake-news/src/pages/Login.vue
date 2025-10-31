<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import '@/config/firebase' // 引入 Firebase SDK
import * as yup from 'yup'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const fieldErrors = ref<{ email?: string, password?: string }>({})
const isLoading = ref(false)

// Yup 验证规则
const loginSchema = yup.object({
    email: yup
        .string()
        .required('邮箱不能为空')
        .email('请输入有效的邮箱地址'),
    password: yup
        .string()
        .required('密码不能为空')
        .min(6, '密码长度至少为 6 个字符')
})

// 初始化 Firebase (通过导入已自动初始化)
onMounted(() => {
    console.log('Firebase SDK initialized')
})

const handleLogin = async () => {
    // 重置错误信息
    errorMessage.value = ''
    fieldErrors.value = {}

    try {
        // Yup 验证
        await loginSchema.validate(
            { 
                email: email.value, 
                password: password.value 
            },
            { abortEarly: false }
        )
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            // 收集所有字段错误
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
        // 调用后端登录接口 - 字段完全匹配后端 LoginRequest
        await authStore.login({
            email: email.value,
            password: password.value
        })

        // 登录成功，跳转到首页
        router.push('/')
    } catch (error) {
        // 显示后端返回的错误信息
        errorMessage.value = error instanceof Error ? error.message : '登录失败，请检查邮箱和密码'
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
                <h1 class="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h1>
                <p class="text-gray-600">登录到反假新闻系统</p>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-600 text-sm">{{ errorMessage }}</p>
            </div>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin" class="space-y-6">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                        邮箱
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
                        密码
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
                    {{ isLoading ? '登录中...' : '登录' }}
                </button>
            </form>

            <!-- Divider -->
            <div class="mt-6 text-center">
                <p class="text-sm text-gray-600">
                    还没有账号？
                    <button
                        @click="goToRegister"
                        class="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        立即注册
                    </button>
                </p>
            </div>

            <!-- Test Account Info -->
            <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                <p class="text-xs text-gray-600 mb-2 font-semibold">测试账号：</p>
                <div class="space-y-1 text-xs text-gray-500">
                    <p>管理员: admin@local / admin123</p>
                </div>
            </div>
        </div>
    </div>
</template>
