<script setup lang="ts">
import { computed } from 'vue'
import { usePruefungenStore } from '@/stores/Exam'
import ExamDay from '@/components/ExamDay.vue'

const store = usePruefungenStore()

// Gruppierung der Prüfungen nach Datum
const groupedPruefungen = computed(() => {
  return store.pruefungen.reduce(
    (acc, pruefung) => {
      const datum = new Date(pruefung.examDate.toISOString().split('T')[0])

      const existingEntry = acc.find(
        entry => entry.datum.getTime() === datum.getTime(),
      )

      if (existingEntry) {
        existingEntry.pruefungen.push(pruefung)
      } else {
        acc.push({
          datum: datum,
          pruefungen: [pruefung],
        })
      }
      return acc
    },
    [] as { datum: Date; pruefungen: typeof store.pruefungen }[],
  )
})

// Löschen einer Prüfung
function handleExamDeleted(name: string, date: Date) {
  const index = store.pruefungen.findIndex(
    pruefung =>
      pruefung.name === name && pruefung.examDate.getTime() === date.getTime(),
  )

  if (index > -1) {
    store.removePruefung(index) // Methode aus dem Store nutzen
  }
}
</script>

<template>
  <div>
    <ExamDay
      v-for="(pruefungstag, index) in groupedPruefungen"
      :key="index"
      :pruefungen="pruefungstag.pruefungen"
      @examDeleted="handleExamDeleted"
    />
  </div>
</template>
