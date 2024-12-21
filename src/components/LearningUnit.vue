<script setup lang="ts">
import { useLearnUnitStore, type Learnunit } from '@/stores/Learnunit'
import { usePruefungenStore, createLearnPlan, type Pruefung } from '@/stores/Exam'
import { useRouter } from 'vue-router'

const props = defineProps<{
  pruefung: string
  lerndauer: number
  date: Date
}>()

const learnunitStore = useLearnUnitStore()
const storePruefung = usePruefungenStore()
const router = useRouter()

function startLearnunit() {
  const learnunit = learnunitStore.learnunits.find(
    learnunit =>
      learnunit.exam.name === props.pruefung &&
      learnunit.date.getTime() === props.date.getTime(),
  )
  if (learnunit && learnunit.date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]) {
    const queryParams = {
      exam: learnunit.exam.name,
      examDate: learnunit.exam.examDate.toISOString(),
      date: learnunit.date.toISOString(),
    }
    router.push({ path: '/', query: queryParams })
  }
}

function deleteLearnunit() {
  const pruefung = storePruefung.pruefungen.find(
    pruefung =>
      pruefung.name === props.pruefung
  )

  if (pruefung) {
    //check ob es von der Prüfung noch mindestens eine Lerneinheit ab heute gibt, die nicht gerade gelöscht wird
    const learnunitCount = learnunitStore.learnunits.filter(
      learnunit =>
        learnunit.exam.name === pruefung.name &&
        learnunit.date.getTime() >= new Date(new Date().setHours(0,0,0,0)).getTime() &&
        learnunit.date.toISOString().split('T')[0] != props.date.toISOString().split('T')[0]
    ).length
    if (learnunitCount === 0) {
      alert('Es muss mindestens eine Lerneinheit in der Zukunft für die Prüfung vorhanden sein')
      return
    } 
    
    //buffer benutzen
    if (pruefung.buffer > 0)
      pruefung.buffer -= (props.lerndauer / 60)

    //Lerneinheiten löschen
    for (let i = learnunitStore.learnunits.length - 1; i >= 0; i--) {
      const learnunit = learnunitStore.learnunits[i]
      if (
        learnunit.exam.name === pruefung.name &&
        learnunit.exam.examDate.toISOString().split('T')[0] === pruefung.examDate.toISOString().split('T')[0]
      ) {
        learnunitStore.removeLearnunit(i)
        if(learnunit.date.getTime() === props.date.getTime())
        {
          //Tag von der Lernplanerstellung ausschließen
          pruefung.excludedDays.push(props.date)
        }
      }
    }

    //gelernte Zeit dokumentieren
    addLearnedTime(pruefung)

    //Lernplan neu erstellen
    const newLearnUnits: Learnunit[] = createLearnPlan(pruefung)
    newLearnUnits.forEach((learnunit) => useLearnUnitStore().addLearnunit(learnunit))
  }
  else {
    console.log('zugehörige Prüfung nicht gefunden')
  }
}

function addLearnedTime (pruefung: Pruefung) {
  const dateToday = new Date()
  dateToday.setHours(0,0,0,0)
  const dateIterator = new Date(pruefung.start)
  while(dateIterator.getTime() < dateToday.getTime()) {
    const isExcludedDay = pruefung.excludedDays.some(
      (excludedDate) => new Date(excludedDate).toDateString() === dateIterator.toDateString()
    );
    if (!isExcludedDay) {
      pruefung.learnedTime += (props.lerndauer) / 60
      pruefung.excludedDays.push(new Date(dateIterator))
      storePruefung.updatePruefung(pruefung)
    }
    dateIterator.setDate(dateIterator.getDate() + 1)
  }
}
</script>


<template>
  <div
    class="container border border-tertiary bg-body-secondary rounded shadow p-3"
  >
    <div class="row align-items-center">
      <div class="col">
        <h6>{{ pruefung }}</h6>
        <small>{{ lerndauer }} Minuten</small>
      </div>
      <div class="col-auto d-flex gap-2">
        <button @click="deleteLearnunit" class="btn btn-danger">Löschen</button>
        <div @click="startLearnunit" class="btn btn-success">Start</div>
      </div>
    </div>
  </div>
</template>
