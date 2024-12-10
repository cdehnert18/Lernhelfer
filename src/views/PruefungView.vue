<script setup lang="ts">
import { computed } from 'vue'
import { usePruefungenStore } from '@/stores/Exam'
import { useLearnUnitStore } from '@/stores/Learnunit'
import ExamDay from '@/components/ExamDay.vue'

const storePruefung = usePruefungenStore()
const storeLearnunit = useLearnUnitStore()

// Gruppierung der Prüfungen nach Datum
const groupedPruefungen = computed(() => {
  return storePruefung.pruefungen.reduce(
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
    [] as { datum: Date; pruefungen: typeof storePruefung.pruefungen }[],
  )
})

// Löschen einer Prüfung & Löschen der Lerneinheiten
function handleExamDeleted(name: string, examDate: Date) {
  const index = storePruefung.pruefungen.findIndex(
    pruefung =>
      pruefung.name === name &&
      pruefung.examDate.getTime() === examDate.getTime(),
  )

  if (index > -1) {
    // Rückwärts iterieren, damit sich die Indizes nicht verschieben
    for (let i = storeLearnunit.learnunits.length - 1; i >= 0; i--) {
      const learnunit = storeLearnunit.learnunits[i]
      if (
        learnunit.exam.name === name &&
        learnunit.exam.examDate.getTime() === examDate.getTime()
      ) {
        storeLearnunit.removeLearnunit(i)
      } else {
        console.log(
          learnunit.exam.examDate.getTime() + ' VS ' + examDate.getTime(),
        )
      }
    }
    storePruefung.removePruefung(index) // Methode aus dem Store nutzen
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
