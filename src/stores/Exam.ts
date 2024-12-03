import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface Pruefung {
  name: string
  examDate: Date
  workload: number
  start: Date
  difficulty: string
  buffer: number
  excludedDays: Date[]
}

export const usePruefungenStore = defineStore('pruefungen', () => {
  const pruefungen = ref<Pruefung[]>([])

  watch(
    pruefungen,
    newPruefungen => {
      localStorage.setItem('pruefungen', JSON.stringify(newPruefungen))
    },
    { deep: true },
  )

  const loadFromLocalStorage = () => {
    const data = localStorage.getItem('pruefungen')
    pruefungen.value = data
      ? JSON.parse(data).map(
          (item: {
            name: string
            examDate: string
            effort: number
            start: string
            difficulty: string
            buffer: number
            excludedDays: string[]
          }) => ({
            name: item.name,
            examDate: new Date(item.examDate),
            effort: item.effort,
            start: new Date(item.start),
            difficulty: item.difficulty,
            buffer: item.buffer,
            excludedDays: item.excludedDays.map((date: string) => new Date(date)),
          }),
        )
      : []
  }

  const addPruefung = (pruefung: Pruefung) => {
    pruefungen.value.push(pruefung)

    // Generate Learunits here:
    // algorithmus erzeugt array von learnunits (newLearunits) (learnunit = {exam: pruefung(parameter aus Funktionskopf), date: Date, duration: number, done: false})
    // dann newLearunits.forEach(learnunit => useLearnUnitStore().addLearnunit(learnunit)) speichert alle learnunits in Pinia
  }

  const removePruefung = (index: number) => {
    pruefungen.value.splice(index, 1)
  }

  return {
    pruefungen,
    loadFromLocalStorage,
    addPruefung,
    removePruefung,
  }
})
