import { defineStore } from 'pinia'
import { watch, reactive } from 'vue'
import { useLearnUnitStore, type Learnunit } from './Learnunit'

export interface Pruefung {
  name: string
  examDate: Date
  workload: number
  start: Date
  difficulty: string
  buffer: number
  excludedDays: Date[]
  learnedTime: number
}

export const usePruefungenStore = defineStore('pruefungen', () => {
  const pruefungen = reactive<Pruefung[]>([])

  watch(
    pruefungen,
    newPruefungen => {
      localStorage.setItem('pruefungen', JSON.stringify(newPruefungen))
    },
    { deep: true },
  )

  const loadFromLocalStorage = () => {
    const data = localStorage.getItem('pruefungen')
    const parsedDate = data
      ? JSON.parse(data).map(
        (item: {
          name: string
          examDate: string
          effort: number
          start: string
          difficulty: string
          buffer: number
          excludedDays: string[]
          learnedTime: number
        }) => ({
          name: item.name,
          examDate: new Date(item.examDate),
          effort: item.effort,
          start: new Date(item.start),
          difficulty: item.difficulty,
          buffer: item.buffer,
          excludedDays: item.excludedDays.map(
              (date: string) => new Date(date),
            ),
          learnedTime: item.learnedTime,
        }),
      )
      : []
    pruefungen.splice(0, pruefungen.length, ...parsedDate)
  }

  const addPruefung = (pruefung: Pruefung, isNew: boolean) => {
    pruefungen.push(pruefung)

    // Generate Learunits here:
    // algorithmus erzeugt array von learnunits (newLearunits) (learnunit = {exam: pruefung(parameter aus Funktionskopf), date: Date, duration: number, done: false})
    // dann newLearunits.forEach(learnunit => useLearnUnitStore().addLearnunit(learnunit)) speichert alle learnunits in Pinia
    let newLearnUnits: Learnunit[]
    if(isNew) 
      newLearnUnits= initLearnPlan(pruefung)
    else
      newLearnUnits = createLearnPlan(pruefung)
    newLearnUnits.forEach((learnunit) => useLearnUnitStore().addLearnunit(learnunit));
  }

  const removePruefung = (index: number) => {
    pruefungen.splice(index, 1)
  }

  const updatePruefung = (pruefung: Pruefung) => {
    const index = pruefungen.findIndex(
      (item) => item.name === pruefung.name && item.examDate === pruefung.examDate
    )
    pruefungen[index] = pruefung
  }

  return {
    pruefungen,
    loadFromLocalStorage,
    addPruefung,
    removePruefung,
    updatePruefung,
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
  const newLearnunits = createLearnPlan(pruefung)
  return newLearnunits
}

export const createLearnPlan = (pruefung: Pruefung) => {
  let amountDays;
  let actualStartDate;
  const examDate = new Date(pruefung.examDate)
  examDate.setHours(12, 0, 0, 0)
  const startDate = new Date(pruefung.start)
  startDate.setHours(12, 0, 0, 0)

  // Anzahl an zukünftigen excludedDays berechnen
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const amountFutureExcludedDays = pruefung.excludedDays.filter(
    (excludedDate) => {
      const excludedDay = new Date(excludedDate);
      excludedDay.setHours(12, 0, 0, 0);
      return excludedDay.getTime() >= today.getTime();
    }
  ).length;

  //Lernzeit pro Tag berechnen
  if ((startDate.getTime() > today.getTime())) {
    actualStartDate = new Date(pruefung.start)
    amountDays = (examDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) - amountFutureExcludedDays;
  }
  else {
    const dateToday = new Date(Date.now())
    dateToday.setHours(12, 0, 0, 0)
    actualStartDate = new Date(dateToday)
    amountDays = (examDate.getTime() - actualStartDate.getTime()) / (1000 * 60 * 60 * 24) - amountFutureExcludedDays;
  }
  if (pruefung.examDate.getHours() >= 12)
    amountDays++
  let learningTime
  if(pruefung.buffer > 0)
    learningTime=Math.round(((pruefung.workload + pruefung.buffer - pruefung.learnedTime) / amountDays) * 60)
  else
    learningTime=Math.round(((pruefung.workload - pruefung.learnedTime) / amountDays) * 60) 
  //Array von Lernunits erstellen
  const newLearnunits = []
  const currentDateIterator = new Date(actualStartDate)
  while (currentDateIterator <= pruefung.examDate) {
    if (currentDateIterator.toDateString() === pruefung.examDate.toDateString() && pruefung.examDate.getHours() < 12)
      break;
    const isExcludedDay = pruefung.excludedDays.some(
      excludedDate =>
        new Date(excludedDate).toDateString() ===
        currentDateIterator.toDateString(),
    )
    if (!isExcludedDay) {
      newLearnunits.push({
        exam: pruefung,
        date: new Date(currentDateIterator),
        duration: learningTime,
      })
    }
    currentDateIterator.setDate(currentDateIterator.getDate() + 1)
  }
  return newLearnunits
}
