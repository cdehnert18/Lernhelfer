<script setup lang="ts">
import ExamDay from '@/components/ExamDay.vue'

const rawPruefungen = [
  {
    fach: 'Geschichte 1',
    start: new Date('2024-12-03T16:00:00'),
    ende: new Date('2024-12-03T17:30:00'),
  },
  {
    fach: 'Geschichte 2',
    start: new Date('2024-12-03T19:00:00'),
    ende: new Date('2024-12-03T21:30:00'),
  },
  {
    fach: 'Mathematik',
    start: new Date('2024-12-05T10:45:00'),
    ende: new Date('2024-12-05T11:30:00'),
  },
  {
    fach: 'Literatur',
    start: new Date('2024-12-15T14:00:00'),
    ende: new Date('2024-12-15T15:30:00'),
  },
]

const groupedPruefungen = rawPruefungen.reduce(
  (acc, pruefung) => {
    // Extrahiere das Datum (ohne Uhrzeit) als Date-Objekt
    const datum = new Date(pruefung.start.toISOString().split('T')[0]) // '2024-12-03' als Date-Objekt

    // Suche nach einem bestehenden Datumseintrag (Vergleich mit Date)
    const existingEntry = acc.find(
      entry => entry.datum.getTime() === datum.getTime(),
    ) // Vergleiche mit .getTime()

    if (existingEntry) {
      // Datum existiert bereits: Füge die Prüfung hinzu
      existingEntry.pruefungen.push(pruefung)
    } else {
      // Neues Datum: Erstelle einen neuen Eintrag
      acc.push({
        datum: datum, // datum als Date
        pruefungen: [pruefung],
      })
    }

    return acc
  },
  [] as { datum: Date; pruefungen: typeof rawPruefungen }[],
) // Datum als Date im Accumulator
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
