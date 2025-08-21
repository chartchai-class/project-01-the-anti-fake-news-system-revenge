<script setup lang="ts"></script>
<template>
  <div class="min-h-screen" style="background-color: var(--color-background); color: var(--color-text);">
    <!-- 导航栏 -->
    <header class="border-b card-surface" style="border-color: rgba(94, 82, 64, 0.12);">
      <nav class="max-w-7xl mx-auto px-6 py-4">
        <h1 class="text-2xl font-semibold" style="color: var(--color-text);">Social Anti-Fake News System</h1>
      </nav>
    </header>

    <!-- 主要内容区域 -->
    <main>
      <RouterView />
    </main>
  </div>
</template>
