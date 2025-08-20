<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { newsSeed } from '@/data/news'

const route = useRoute()
const router = useRouter()
const id = String(route.params.id)
const item = newsSeed.find(n => n.id === id)
</script>

<template>
  <main class="max-w-3xl mx-auto p-4">
    <button class="mb-4 text-sm underline" @click="router.push('/')">← Back</button>
    <div v-if="item" class="space-y-3">
      <h1 class="text-2xl font-bold">{{ item.topic }}</h1>
      <img :src="item.imageUrl" alt="" class="rounded-xl w-full object-cover" />
      <p class="text-zinc-700">{{ item.fullDetail }}</p>
      <div class="text-sm text-zinc-500">
        Reporter: {{ item.reporter }} ·
        <time :datetime="item.reportedAt">{{ new Date(item.reportedAt).toLocaleString() }}</time>
      </div>

      <div class="mt-4">
        <router-link :to="`/vote/${item.id}`" class="px-3 py-1.5 border rounded-xl">Go Vote</router-link>
      </div>
    </div>
    <p v-else>Not found.</p>
  </main>
</template>
