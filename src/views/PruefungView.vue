<script setup lang="ts">
import { computed } from 'vue'
import { usePruefungenStore } from '@/stores/Exam'
import { useLearnUnitStore } from '@/stores/Learnunit'
import ExamDay from '@/components/ExamDay.vue'
import Placeholder from '@/components/Placeholder.vue'

const storePruefung = usePruefungenStore()
const storeLearnunit = useLearnUnitStore()

// Gruppierung der Prüfungen nach Datum
const groupedPruefungen = computed(() => {
  return storePruefung.pruefungen.reduce(
    (acc, pruefung) => {
      const datum = new Date(pruefung.examDate.toISOString().split('T')[0])

      // Suche Prüfungen am selben Tag
      const existingEntry = acc.find(
        entry => entry.datum.getTime() === datum.getTime(),
      )

      if (existingEntry) {
        // Füge Prüfungen am selben Tag zusammen
        existingEntry.pruefungen.push(pruefung)
      } else {
        acc.push({
          datum: datum,
          pruefungen: [pruefung],
        })
      }
      return acc
    },
    // Array, dass alle Prüfungstage und
    // an diesem Tag stattfindende Prüfungen enthält
    [] as { datum: Date; pruefungen: typeof storePruefung.pruefungen }[],
  )
})

// Löschen einer Prüfung & Löschen der Lerneinheiten
function handleExamDeleted(name: string, examDate: Date) {
  // Suche Prüfung am selben Tag mit demselben Namen
  const index = storePruefung.pruefungen.findIndex(
    pruefung =>
      pruefung.name === name &&
      pruefung.examDate.getTime() === examDate.getTime(),
  )

  if (index > -1) {
    // Rückwärts iterieren, damit sich die Indizes nicht verschieben
    for (let i = storeLearnunit.learnunits.length - 1; i >= 0; i--) {
      const learnunit = storeLearnunit.learnunits[i]
      // Löschen der Lerneinheiten mit passender zugehöriger Prüfung
      if (
        learnunit.exam.name === name &&
        learnunit.exam.examDate.getTime() === examDate.getTime()
      ) {
        storeLearnunit.removeLearnunit(i)
      }
    }
    // Prüfung löschen
    storePruefung.removePruefung(index)
  }
}
</script>

<template>
  <div>
    <!--alle Prüfungstage anzeigen-->
    <ExamDay
      v-for="(pruefungstag, index) in groupedPruefungen"
      :key="index"
      :pruefungen="pruefungstag.pruefungen"
      @examDeleted="handleExamDeleted"
    />
    <!--falls es keine Tage mit Prüfungen gibt-->
    <Placeholder v-if="groupedPruefungen.length === 0">
      Hier werden Prüfungen angezeigt, die du erstellt hast
    </Placeholder>
  </div>
</template>
