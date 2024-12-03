import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { usePruefungenStore } from '@/stores/Exam'
import type { Pruefung } from '@/stores/Exam'

export interface Learnunit {
  exam: Pruefung
  date: Date
}

export const useLearnUnitStore = defineStore('learnunit', () => {
  const learnunits = ref<Learnunit[]>([])

  watch(
    learnunits,
    newLearnunits => {
        const serialized = newLearnunits.map(unit => ({
            examName: unit.exam.name,
            date: unit.date.toISOString(),
        }))
          localStorage.setItem('learnunits', JSON.stringify(serialized))
    },
    { deep: true },
  )

  const loadFromLocalStorage = () => {
    const data = localStorage.getItem('learnunits')
    learnunits.value = data
    ? JSON.parse(data).map((item: { examName: string; date: string }) => {
        const exam = usePruefungenStore().pruefungen.find(p => p.name === item.examName)
        if (!exam) {
          throw new Error(`Prüfung mit dem Namen ${item.examName} nicht gefunden.`)
        }

        return {
          exam: exam,
          date: new Date(item.date),
        }
      })
    : []
  }


  const addLearunit= (learnunit: Learnunit) => {
    learnunits.value.push(learnunit)
  }

  const removeLearnunit = (index: number) => {
    learnunits.value.splice(index, 1)
  }

  return {
    learnunits,
    loadFromLocalStorage,
    addLearunit,
    removeLearnunit,
  }
})
