<script setup lang="ts">
import { computed, watch, ref, defineProps, defineEmits } from 'vue'
import Exam from '@/components/Exam.vue'

const emit = defineEmits<{
  (event: 'examDeleted', fach: string, date: Date): void
}>()

const props = defineProps<{
  datum: Date
  pruefungen: {
    fach: string
    date: Date
  }[]
}>()

// Erstelle eine reaktive Kopie von `props.pruefungen`
const pruefungen = ref([...props.pruefungen])

// Reagiere auf Änderungen der Prop `pruefungen`
watch(
  () => props.pruefungen,
  newPruefungen => {
    pruefungen.value = [...newPruefungen] // Aktualisiere die lokale Kopie
  },
  { immediate: true }, // Direkt initialisieren
)

function onExamDeleted(fach: string, date: Date) {
  emit('examDeleted', fach, date)

  // Lokal die gelöschte Prüfung entfernen
  pruefungen.value = pruefungen.value.filter(
    pruefung =>
      pruefung.fach !== fach || pruefung.date.getTime() !== date.getTime(),
  )
}

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
      v-for="(pruefung, index) in pruefungen"
      :key="index"
      class="mb-3"
      :pruefung="pruefung.fach"
      :zeitraumStart="pruefung.date"
      @examDeleted="onExamDeleted"
    ></Exam>
  </main>
</template>
