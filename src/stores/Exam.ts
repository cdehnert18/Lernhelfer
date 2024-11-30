import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface Pruefung {
  name: string
  examDate: Date
  workload: number
  start: Date
  difficulty: string
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
          }) => ({
            name: item.name,
            examDate: new Date(item.examDate),
            effort: item.effort,
            start: new Date(item.start),
            difficulty: item.difficulty,
          }),
        )
      : []
  }

  const addPruefung = (pruefung: Pruefung) => {
    pruefungen.value.push(pruefung)
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
