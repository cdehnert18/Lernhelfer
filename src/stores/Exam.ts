import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useLearnUnitStore, type Learnunit } from './Learnunit'

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
    const newLearnUnits: Learnunit[] = initLearnPlan(pruefung)
    newLearnUnits.forEach((learnunit) => useLearnUnitStore().addLearnunit(learnunit));
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

const initLearnPlan = (pruefung: Pruefung) => {
  if (pruefung.difficulty === 'leicht') {
    pruefung.buffer = 2
  } else if (pruefung.difficulty === 'mittel') {
    pruefung.buffer = 4
  } else {
    pruefung.buffer = 6
  }
  const newLearnunits = createLearnPlan(pruefung);
  return newLearnunits
};

const createLearnPlan = (pruefung: Pruefung) => {
  let amountDays;
  let actualStartDate;
  if (pruefung.start.getTime() > Date.now()) {
    amountDays = (pruefung.examDate.getTime() - pruefung.start.getTime()) / (1000 * 60 * 60 * 24) - pruefung.excludedDays.length;
    actualStartDate = pruefung.start
  }
  else {
    amountDays = (pruefung.examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24) - pruefung.excludedDays.length;
    actualStartDate = new Date(Date.now())
  }
  if (pruefung.examDate.getHours() > 12)
    amountDays++
  const learningTime = Math.round((pruefung.workload / amountDays) * 60)
  const newLearnunits = []
  const currentDateIterator = actualStartDate

  while (currentDateIterator <= pruefung.examDate) {
    const isExcludedDay = pruefung.excludedDays.some(
      (excludedDate) => new Date(excludedDate).toDateString() === currentDateIterator.toDateString()
    );
    if (!isExcludedDay) {
      newLearnunits.push({
        exam: pruefung,
        date: new Date(currentDateIterator),
        duration: learningTime,
        done: false,
      });
    }
    currentDateIterator.setDate(currentDateIterator.getDate() + 1);
  }
  return newLearnunits;
};

