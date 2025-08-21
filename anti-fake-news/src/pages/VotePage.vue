<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
const route = useRoute(); const router = useRouter()
</script>

<template>
  <main class="max-w-2xl mx-auto p-6">
    <button 
      class="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm hover:shadow-md transition-all duration-200"
      @click="router.back()">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Back
    </button>

    <div class="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200/60 dark:border-zinc-700/60 shadow-sm text-center">
      <div class="mb-6">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
          Vote Page
        </h1>
        <p class="text-lg text-zinc-600 dark:text-zinc-400">
          News #{{ route.params.id }}
        </p>
      </div>

      <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200/60 dark:border-blue-700/60">
        <p class="text-zinc-700 dark:text-zinc-300 mb-3">
          Member C will implement the voting form here.
        </p>
        <div class="text-sm text-zinc-500 dark:text-zinc-500">
          This page is ready for the voting functionality implementation.
        </div>
      </div>
    </div>
  </main>
</template>
