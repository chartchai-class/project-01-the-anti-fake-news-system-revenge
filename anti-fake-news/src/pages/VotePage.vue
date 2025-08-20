<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
const route = useRoute(); const router = useRouter()
</script>

<template>
  <main class="max-w-xl mx-auto p-4">
    <button class="mb-4 text-sm underline" @click="router.back()">← Back</button>
    <h1 class="text-xl font-bold">Vote Page (News #{{ route.params.id }})</h1>
    <p class="text-sm text-zinc-600 mt-2">Member C will implement the voting form here.</p>
  </main>
</template>
