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
  <div class="flex flex-wrap items-center gap-4 p-4 card-surface rounded-2xl">
    <div class="inline-flex rounded-xl border overflow-hidden shadow-sm" style="border-color: rgba(94, 82, 64, 0.12); background-color: var(--color-surface);">
      <button v-for="f in ['all','fake','non-fake','unknown']"
              :key="f"
              class="px-4 py-2 text-sm font-medium transition-all duration-200"
              :class="{
                'btn-primary': localFilter===f
              }"
              :style="localFilter!==f ? {color: 'var(--color-text-secondary)'} : {}"
              @click="localFilter = f as any">
        {{ f === 'all' ? 'All News' : f === 'fake' ? 'Fake News' : f === 'non-fake' ? 'Real News' : 'Pending News' }}
      </button>
    </div>

    <label class="flex items-center gap-2 text-sm font-medium" style="color: var(--color-text);">
      <span class="flex items-center gap-1.5">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
        </svg>
        Per Page:
      </span>
      <select v-model.number="localSize"
              class="px-3 py-1.5 rounded-lg border shadow-sm transition-all duration-200"
              style="border-color: rgba(94, 82, 64, 0.12); background-color: var(--color-surface); color: var(--color-text);">
                 <option :value="5">5</option>
         <option :value="10">10</option>
         <option :value="20">20</option>
      </select>
    </label>
  </div>
</template>
