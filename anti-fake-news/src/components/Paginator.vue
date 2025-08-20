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
  <nav class="flex items-center justify-center gap-1">
    <button class="px-2 py-1 rounded-lg border text-sm" @click="to(page-1)" :disabled="page<=1">Prev</button>
    <button v-for="p in pageCount" :key="p"
            class="px-3 py-1 rounded-lg border text-sm"
            :class="{'bg-zinc-900 text-white': p===page}"
            @click="to(p as number)">
      {{ p }}
    </button>
    <button class="px-2 py-1 rounded-lg border text-sm" @click="to(page+1)" :disabled="page>=pageCount">Next</button>
  </nav>
</template>
