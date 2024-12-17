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
  learnedTime: number
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
          learnedTime: number
        }) => ({
          name: item.name,
          examDate: new Date(item.examDate),
          effort: item.effort,
          start: new Date(item.start),
          difficulty: item.difficulty,
          buffer: item.buffer,
          excludedDays: item.excludedDays.map((date: string) => new Date(date)),
          learnedTime: item.learnedTime,
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

export const createLearnPlan = (pruefung: Pruefung) => {
  let amountDays;
  let actualStartDate;
  const examDate = new Date(pruefung.examDate)
  examDate.setHours(0, 0, 0, 0)
  const startDate = new Date(pruefung.start)
  startDate.setHours(0, 0, 0, 0)

  // Anzahl an zukünftigen excludedDays ab morgen
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const amountFutureExcludedDays = pruefung.excludedDays.filter(
    (excludedDate) => {
      const excludedDay = new Date(excludedDate);
      excludedDay.setHours(0, 0, 0, 0);
      return excludedDay.getTime() >= tomorrow.getTime();
    }
  ).length;

  //Lernzeit pro Tag berechnen
  if (startDate.getTime() > Date.now()) {
    actualStartDate = pruefung.start
    amountDays = (examDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) - amountFutureExcludedDays;
  }
  else {
    const dateToday = new Date(Date.now())
    dateToday.setHours(0, 0, 0, 0)
    actualStartDate = new Date(dateToday)
    //erst ab morgigen Tag neue Lernunits erstellen
    actualStartDate.setDate(dateToday.getDate() + 1)
    amountDays = (examDate.getTime() - actualStartDate.getTime()) / (1000 * 60 * 60 * 24) - amountFutureExcludedDays;
  }
  if (pruefung.examDate.getHours() > 12)
    amountDays++
  const learningTime = Math.round(((pruefung.workload + pruefung.buffer - pruefung.learnedTime) / amountDays) * 60)

  //Array von Lernunits erstellen
  const newLearnunits = []
  const currentDateIterator = actualStartDate
  while (currentDateIterator <= pruefung.examDate) {
    if (currentDateIterator.toDateString() === pruefung.examDate.toDateString() && pruefung.examDate.getHours() < 12)
      break;
    const isExcludedDay = pruefung.excludedDays.some(
      (excludedDate) => new Date(excludedDate).toDateString() === currentDateIterator.toDateString()
    );
    if (!isExcludedDay) {
      newLearnunits.push({
        exam: pruefung,
        date: new Date(currentDateIterator),
        duration: learningTime,
      });
    }
    currentDateIterator.setDate(currentDateIterator.getDate() + 1);
  }
  return newLearnunits;
};

//Plan: bei Lernunit löschen aktuelle learningTime für alle Tage in Vergangenheit, die nicht exkludiert sind auf learnedTime addieren
// dann Tage zu exkludierten Tagen hinzufügen
// dann alle Lernunits von Prüfung löschen, außer heutige Lernunit, dann neue Lernunits ab morgen erstellen
