<script setup lang="ts">
import LearningUnit from '@/components/LearningUnit.vue'
</script>

<template>
  <header class="px-4 mt-2 mb-2">
    <div class="container px-0">
      <h4>Donnerstag</h4>
      <h6>12.05.2024</h6>
    </div>
  </header>
  <main class="px-4">
    <LearningUnit v-for="n in 3" :key="n" class="mb-3"></LearningUnit>
  </main>
</template>
