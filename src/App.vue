<script setup lang="ts">
import Navigation from '@/components/Navigation.vue'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <RouterView class="flex-grow-1" />
    <Navigation class="sticky-bottom bg-dark" />
  </div>
</template>
