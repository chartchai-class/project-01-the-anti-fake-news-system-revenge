<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { newsSeed } from '@/data/news'

const route = useRoute()
const router = useRouter()
const id = String(route.params.id)
const item = newsSeed.find(n => n.id === id)
</script>

<template>
  <main class="max-w-4xl mx-auto p-6">
    <button 
      class="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm hover:shadow-md transition-all duration-200"
      @click="router.push('/')">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Back to Home
    </button>

    <div v-if="item" class="space-y-6">
      <div class="text-center">
        <h1 class="text-3xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">{{ item.topic }}</h1>
      </div>

      <div class="relative overflow-hidden rounded-2xl shadow-lg">
        <img :src="item.imageUrl" alt="" class="w-full h-80 object-cover" />
      </div>

      <div class="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200/60 dark:border-zinc-700/60 shadow-sm">
        <p class="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 mb-6">
          {{ item.fullDetail }}
        </p>
        
        <div class="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500 border-t border-zinc-200 dark:border-zinc-700 pt-4">
          <span class="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 8a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            Reporter: {{ item.reporter }}
          </span>
          <time :datetime="item.reportedAt" class="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
            {{ new Date(item.reportedAt).toLocaleString() }}
          </time>
        </div>
      </div>

      <div class="text-center">
        <router-link 
          :to="`/vote/${item.id}`" 
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Go Vote
        </router-link>
      </div>
    </div>
    
    <div v-else class="text-center py-16">
      <div class="text-4xl mb-3">😕</div>
      <p class="text-lg text-zinc-600 dark:text-zinc-400">News not found.</p>
    </div>
  </main>
</template>
