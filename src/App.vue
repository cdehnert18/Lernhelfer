<script setup lang="ts">
import Navigation from '@/components/Navigation.vue'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <div class="flex-grow-1">
      <RouterView class="flex-grow-1" />
    </div>
    <Navigation class="sticky-bottom bg-secondary-subtle" />
  </div>
</template>
