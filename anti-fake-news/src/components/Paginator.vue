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
  <nav class="flex items-center justify-center gap-2 p-4">
    <button 
      class="px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      style="border-color: rgba(94, 82, 64, 0.12); color: var(--color-text-secondary);"
      @click="to(page-1)" 
      :disabled="page<=1">
      <span class="flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Previous
      </span>
    </button>
    
    <div class="flex items-center gap-1">
      <button 
        v-for="p in pageCount" 
        :key="p"
        class="w-10 h-10 rounded-lg border text-sm font-medium transition-all duration-200"
        :class="{
          'btn-primary': p===page
        }"
        :style="p!==page ? {borderColor: 'rgba(94, 82, 64, 0.12)', color: 'var(--color-text-secondary)'} : {}"
        @click="to(p as number)">
        {{ p }}
      </button>
    </div>
    
    <button 
      class="px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      style="border-color: rgba(94, 82, 64, 0.12); color: var(--color-text-secondary);"
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
