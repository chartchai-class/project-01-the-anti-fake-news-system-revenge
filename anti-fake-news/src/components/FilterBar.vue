<script setup lang="ts">
import { ref, watch } from 'vue'

export type FilterKind = 'all' | 'fake' | 'non-fake' | 'unknown'

const props = defineProps<{
  modelValue: FilterKind
  pageSize: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: FilterKind): void
  (e: 'update:pageSize', v: number): void
}>()

const localFilter = ref<FilterKind>(props.modelValue)
const localSize = ref<number>(props.pageSize)

watch(localFilter, v => emit('update:modelValue', v))
watch(localSize, v => emit('update:pageSize', v))
watch(() => props.modelValue, v => { localFilter.value = v })
watch(() => props.pageSize, v => { localSize.value = v })

</script>

<template>
  <div class="flex flex-wrap items-center gap-4 p-4 bg-white/60 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 backdrop-blur-sm shadow-sm">
    <div class="inline-flex rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-sm bg-white dark:bg-zinc-900">
      <button v-for="f in ['all','fake','non-fake','unknown']"
              :key="f"
              class="px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
              :class="{
                'bg-gradient-to-r from-zinc-900 to-zinc-800 text-white shadow-sm': localFilter===f,
                'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800': localFilter!==f
              }"
              @click="localFilter = f as any">
        {{ f }}
      </button>
    </div>

    <label class="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
      <span class="flex items-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
        </svg>
        每页：
      </span>
      <select v-model.number="localSize"
              class="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="20">20</option>
      </select>
    </label>
  </div>
</template>
