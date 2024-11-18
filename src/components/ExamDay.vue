<script setup lang="ts">
import { computed } from 'vue'
import Exam from '@/components/Exam.vue'

const props = defineProps<{
  datum: Date
  pruefungen: {
    fach: string
    start: Date
    ende: Date
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
    <Exam
      v-for="(pruefung, index) in props.pruefungen"
      :key="index"
      class="mb-3"
      :pruefung="pruefung.fach"
      :zeitraumStart="pruefung.start"
      :zeitraumEnde="pruefung.ende"
    ></Exam>
  </main>
</template>
