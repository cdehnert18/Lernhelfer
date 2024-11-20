<script setup lang="ts">
import { ref, computed } from 'vue'
import ExamDay from '@/components/ExamDay.vue'

interface Pruefung {
  fach: string
  date: Date
}

function getLocalStorageData(): Pruefung[] {
  const data = localStorage.getItem('pruefungen')
  return data
    ? JSON.parse(data).map((item: { fach: string; date: string }) => ({
        fach: item.fach,
        date: new Date(item.date),
      }))
    : []
}

const pruefungen = ref<Pruefung[]>(getLocalStorageData())

// Prüfungen nach Datum gruppieren
const groupedPruefungen = computed(() => {
  return pruefungen.value.reduce(
    (acc, pruefung) => {
      const datum = new Date(pruefung.date.toISOString().split('T')[0])

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
    [] as { datum: Date; pruefungen: Pruefung[] }[],
  )
})

function handleExamDeleted(fach: string, date: Date) {
  pruefungen.value = pruefungen.value.filter(
    pruefung =>
      pruefung.fach !== fach || pruefung.date.getTime() !== date.getTime(),
  )

  localStorage.setItem('pruefungen', JSON.stringify(pruefungen.value))
}
</script>

<template>
  <div>
    <ExamDay
      v-for="(pruefungstag, index) in groupedPruefungen"
      :key="index"
      :datum="pruefungstag.datum"
      :pruefungen="pruefungstag.pruefungen"
      @examDeleted="handleExamDeleted"
    />
  </div>
</template>
