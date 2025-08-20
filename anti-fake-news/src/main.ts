// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'            // 或者你的 tailwind.css

createApp(App).use(createPinia()).use(router).mount('#app')
