import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import NewsDetails from '@/pages/NewsDetails.vue'
import VotePage from '@/pages/VotePage.vue'

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Home },
        { path: '/news/:id', component: NewsDetails },
        { path: '/vote/:id', component: VotePage },
    ],
})
