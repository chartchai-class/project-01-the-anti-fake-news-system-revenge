import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import NewsDetails from '@/pages/NewsDetails.vue'
import VotePage from '@/pages/VotePage.vue'

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
                title: 'Participate in Voting'
            }
        },
        // 404 页面重定向
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        }
    ],
})

// 全局路由守卫 - 更新页面标题
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title as string
    }
    next()
})

export default router
