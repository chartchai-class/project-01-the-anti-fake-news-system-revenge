<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>

<template>
    <div class="min-h-screen" style="background-color: var(--color-background); color: var(--color-text);">
        <!-- 导航栏 -->
        <NavBar />

        <!-- 主要内容区域 -->
        <main>
            <RouterView />
        </main>
    </div>
</template>
