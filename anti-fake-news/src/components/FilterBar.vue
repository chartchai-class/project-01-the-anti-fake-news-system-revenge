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
  <div class="flex flex-wrap items-center gap-3">
    <div class="inline-flex rounded-xl border overflow-hidden">
      <button v-for="f in ['all','fake','non-fake','unknown']"
              :key="f"
              class="px-3 py-1.5 text-sm hover:bg-zinc-50"
              :class="{'bg-zinc-900 text-white hover:bg-zinc-900': localFilter===f}"
              @click="localFilter = f as any">
        {{ f }}
      </button>
    </div>

    <label class="text-sm text-zinc-600">
      每页：
      <select v-model.number="localSize"
              class="ml-1 rounded-lg border px-2 py-1 bg-white dark:bg-zinc-900">
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="20">20</option>
      </select>
    </label>
  </div>
</template>
