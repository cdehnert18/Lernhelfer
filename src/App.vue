<script setup lang="ts">
import Navigation from '@/components/Navigation.vue';
import { onMounted, onBeforeUnmount } from 'vue';
import { usePruefungenStore } from '@/stores/Exam';

function handleBeforeUnload(event: BeforeUnloadEvent) {
  event.returnValue = "a";
}

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
  const store = usePruefungenStore();
  store.loadFromLocalStorage();
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <RouterView class="d-flex flex-column flex-grow-1" />
    <Navigation class="sticky-bottom bg-secondary-subtle" />
  </div>
</template>
