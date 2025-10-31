import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '@/pages/Home.vue'
import NewsDetails from '@/pages/NewsDetails.vue'
import VotePage from '@/pages/VotePage.vue'
import VoteAnalytics from '@/pages/VoteAnalytics.vue'
import CreateNews from '@/pages/CreateNews.vue'
import Profile from '@/pages/Profile.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import AdminUsers from '@/pages/AdminUsers.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { 
            path: '/', 
            name: 'Home',
            component: Home,
            meta: {
                title: 'Social Anti-Fake News System - Home'
            }
        },
        { 
            path: '/news/:id', 
            name: 'NewsDetails',
            component: NewsDetails,
            meta: {
                title: 'News Details'
            }
        },
        { 
            path: '/vote/:id', 
            name: 'VotePage',
            component: VotePage,
            meta: {
                title: 'Participate in Voting',
                requiresAuth: true  // 需要登录
            }
        },
        {
            path: '/vote-analytics',
            name: 'VoteAnalytics',
            component: VoteAnalytics,
            meta: {
                title: 'Vote Analytics'
            }
        },
        {
            path: '/create-news',
            name: 'CreateNews',
            component: CreateNews,
            meta: {
                title: 'Create News',
                requiresAuth: true  // 需要登录
            }
        },
        {
            path: '/profile',
            name: 'Profile',
            component: Profile,
            meta: {
                title: 'Edit Profile',
                requiresAuth: true  // 需要登录
            }
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: {
                title: 'Login',
                guestOnly: true  // 仅未登录用户可访问
            }
        },
        {
            path: '/register',
            name: 'Register',
            component: Register,
            meta: {
                title: 'Register',
                guestOnly: true  // 仅未登录用户可访问
            }
        },
        {
            path: '/admin/users',
            name: 'AdminUsers',
            component: AdminUsers,
            meta: {
                title: 'User Management',
                requiresAuth: true,
                requiresAdmin: true  // 需要管理员权限
            }
        },
        // 404 页面重定向
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        }
    ],
})

// 全局路由守卫
router.beforeEach(async (to, _from, next) => {
    // 更新页面标题
    if (to.meta.title) {
        document.title = to.meta.title as string
    }

    const authStore = useAuthStore()

    // 只在第一次访问时恢复会话（避免重复调用）
    if (authStore.token && !authStore.user) {
        try {
            await authStore.restoreSession()
        } catch {
            // 恢复失败，清除 token
            authStore.logout()
        }
    }

    // 检查是否需要登录
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'Login', query: { redirect: to.fullPath } })
        return
    }

    // 检查是否需要管理员权限
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
        alert('您没有权限访问此页面')
        next({ name: 'Home' })
        return
    }

    // 检查是否为仅访客页面（登录、注册）
    if (to.meta.guestOnly && authStore.isAuthenticated) {
        next({ name: 'Home' })
        return
    }

    next()
})

export default router
