<script setup lang="ts">
import Navigation from '@/components/Navigation.vue'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <RouterView class="d-flex flex-column flex-grow-1" />
    <Navigation class="sticky-bottom bg-secondary-subtle" />
  </div>
</template>
