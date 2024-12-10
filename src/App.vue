<script setup lang="ts">
import Navigation from '@/components/Navigation.vue'
import { onMounted, onBeforeUnmount } from 'vue'
import { usePruefungenStore } from '@/stores/Exam'
import { useLearnUnitStore } from '@/stores/Learnunit'

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  event.preventDefault()
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  const storeExam = usePruefungenStore()
  const storeLearnUnit = useLearnUnitStore()
  storeExam.loadFromLocalStorage()
  storeLearnUnit.loadFromLocalStorage()
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <RouterView class="d-flex flex-column flex-grow-1" />
    <Navigation class="sticky-bottom bg-secondary-subtle" />
  </div>
</template>
