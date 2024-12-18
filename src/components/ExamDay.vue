<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import Exam from '@/components/Exam.vue'
import { useWochentag } from '@/composables/useWochentag';

const emit = defineEmits<{
  (event: 'examDeleted', name: string, examDate: Date): void
}>()

const props = defineProps<{
  pruefungen: {
    name: string
    examDate: Date
  }[]
}>()

const pruefungen = ref([...props.pruefungen])

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
      pruefung.name !== fach || pruefung.examDate.getTime() !== date.getTime(),
  )
}

const { wochentag } = useWochentag(pruefungen.value[0].examDate);
</script>

<template>
  <header class="px-4 mt-2 mb-2">
    <div class="container px-0">
      <h4>{{ wochentag }}</h4>
      <h6>{{ props.pruefungen[0].examDate.toLocaleDateString('de-DE') }}</h6>
    </div>
  </header>
  <main class="px-4">
    <Exam
      v-for="(pruefung, index) in pruefungen"
      :key="index"
      class="mb-3"
      :pruefung="pruefung.name"
      :zeitraumStart="pruefung.examDate"
      @examDeleted="onExamDeleted"
    ></Exam>
  </main>
</template>
