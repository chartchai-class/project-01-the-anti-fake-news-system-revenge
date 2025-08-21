<script setup lang="ts"></script>
<template>
  <div class="min-h-screen bg-gradient-to-br from-zinc-50 via-blue-50/10 to-purple-50/10 dark:from-zinc-950 dark:via-blue-950/5 dark:to-purple-950/5 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
    <!-- 装饰性背景元素 -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-32 -right-32 w-64 h-64 bg-blue-400/5 dark:bg-blue-600/3 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-400/5 dark:bg-purple-600/3 rounded-full blur-3xl"></div>
    </div>
    
    <div class="relative z-10">
      <RouterView />
    </div>
  </div>
</template>
