<script setup lang="ts">
import { computed } from 'vue'
import LearningUnit from '@/components/LearningUnit.vue'

const props = defineProps<{
  datum: Date
  lerneinheiten: {
    fach: string
    dauer: number
  }[]
}>()

const wochentag = computed(() => {
  const wochentage = [
    'Sonntag',
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
  ]
  const dayIndex = props.datum.getDay()
  return wochentage[dayIndex]
})
</script>

<template>
  <header class="px-4 mt-2 mb-2">
    <div class="container px-0">
      <h4>{{ wochentag }}</h4>
      <h6>{{ props.datum.toLocaleDateString('de-DE') }}</h6>
    </div>
  </header>
  <main class="px-4">
    <LearningUnit
      v-for="(lerneinheit, index) in props.lerneinheiten"
      :key="index"
      class="mb-3"
      :pruefung="lerneinheit.fach"
      :lerndauer="lerneinheit.dauer"
    ></LearningUnit>
  </main>
</template>
