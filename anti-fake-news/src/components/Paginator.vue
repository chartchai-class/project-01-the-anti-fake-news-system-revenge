<script setup lang="ts">
const props = withDefaults(defineProps<{
  page: number
  pageCount: number
}>(), {
  page: 1,
  pageCount: 1
})

const emit = defineEmits<{ (e: 'update:page', v: number): void }>()
const to = (p: number) => {
  if (p < 1 || p > props.pageCount) return
  emit('update:page', p)
}
</script>

<template>
  <nav class="flex items-center justify-center gap-2 p-3">
    <button 
      class="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      :class="{
        'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800': page > 1,
        'text-zinc-400 dark:text-zinc-600 cursor-not-allowed': page <= 1
      }"
      @click="to(page-1)" 
      :disabled="page<=1">
      <span class="flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Prev
      </span>
    </button>
    
    <div class="flex items-center gap-1">
      <button 
        v-for="p in pageCount" 
        :key="p"
        class="w-9 h-9 rounded-lg border text-sm font-medium transition-all duration-200 hover:scale-110"
        :class="{
          'bg-gradient-to-r from-zinc-900 to-zinc-800 text-white shadow-sm border-transparent': p===page,
          'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800': p!==page
        }"
        @click="to(p as number)">
        {{ p }}
      </button>
    </div>
    
    <button 
      class="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      :class="{
        'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800': page < pageCount,
        'text-zinc-400 dark:text-zinc-600 cursor-not-allowed': page >= pageCount
      }"
      @click="to(page+1)" 
      :disabled="page>=pageCount">
      <span class="flex items-center gap-1.5">
        Next
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </span>
    </button>
  </nav>
</template>
