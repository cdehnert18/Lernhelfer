<script setup lang="ts">
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

const rawPruefungen = getLocalStorageData().map(pruefung => ({
  fach: pruefung.fach,
  date: new Date(pruefung.date),
}))

const groupedPruefungen = rawPruefungen.reduce(
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
  [] as { datum: Date; pruefungen: typeof rawPruefungen }[],
)
</script>

<template>
  <div>
    <ExamDay
      v-for="(pruefungstag, index) in groupedPruefungen"
      :key="index"
      :datum="pruefungstag.datum"
      :pruefungen="pruefungstag.pruefungen"
    />
  </div>
</template>
