import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwind from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'     // 现在可用了

export default defineConfig({
    plugins: [vue(), tailwind()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))  // ★ 别名
        }
    }
})
