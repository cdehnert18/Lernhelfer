<script setup lang="ts">
import Navigation from '@/components/Navigation.vue';
import { onMounted, onBeforeUnmount } from 'vue';

function handleBeforeUnload(event: BeforeUnloadEvent) {
  event.returnValue = "a";
}

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <div class="flex-grow-1">
      <RouterView class="flex-grow-1" />
    </div>
    <Navigation class="sticky-bottom bg-secondary-subtle" />
  </div>
</template>
