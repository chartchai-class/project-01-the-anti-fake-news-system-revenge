// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'            // 使用 Tailwind 样式
import './config/firebase'                // 初始化 Firebase SDK

createApp(App).use(createPinia()).use(router).mount('#app')
