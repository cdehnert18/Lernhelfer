<script setup lang="ts">
import router from '@/router'
import { ref, onMounted } from 'vue'
import { usePruefungenStore } from '@/stores/Exam'

const store = usePruefungenStore()

const aktuellesDatum = new Date()

// true, wenn eine völlig neue Prüfung erstellt wird
// false, wenn eine bestehende Prüfung bearbeitet wird
const isNew = ref(true)

const formData = ref({
  name: '',
  examDate: '',
  examTime: '',
  workload: '',
  start: (aktuellesDatum.toISOString() as string).split('T')[0],
  difficulty: 'leicht',
})

// Initialisierung der Eingabefelder, wenn alle Parameter der URL existieren
function initializeFormData(query: Record<string, unknown>) {
  if (
    query.fach &&
    query.date &&
    query.workload &&
    query.start &&
    query.difficulty
  ) {
    return {
      name: query.fach as string,
      examDate: (query.date as string).split('T')[0],
      examTime: (query.date as string).split('T')[1]?.slice(0, 5),
      workload: query.workload as string,
      start: (query.start as string).split('T')[0],
      difficulty: query.difficulty as string,
    }
  }
  return null
}

// Initialisiert wenn möglich die EIngabefelder
onMounted(() => {
  const query = router.currentRoute.value.query
  const initializedData = initializeFormData(query)
  if (initializedData) {
    formData.value = initializedData
    isNew.value = false
  }
})

function save() {
  if (
    !formData.value.name ||
    !formData.value.examDate ||
    !formData.value.workload ||
    !formData.value.start
  ) {
    alert('Bitte füllen Sie alle erforderlichen Felder aus.')
    return
  }

  const [hours, minutes] = formData.value.examTime.split(':')
  const examDateWithTime = new Date(formData.value.examDate)
  examDateWithTime.setHours(parseInt(hours, 10), parseInt(minutes, 10))

  const neuePruefung = {
    name: formData.value.name,
    examDate: examDateWithTime,
    workload: parseInt(formData.value.workload),
    start: new Date(formData.value.start),
    difficulty: formData.value.difficulty,
    buffer: 0,
    excludedDays: [],
  }
  // Wenn eine bestehende Prüfung gearbeitet wurde: Löschung der alten Prüfung
  if (!isNew.value) {
    const index = store.pruefungen.findIndex(
      pruefung =>
        pruefung.name === router.currentRoute.value.query.fach &&
        pruefung.examDate.toISOString() ===
          router.currentRoute.value.query.date,
    )
    if (index > -1) {
      store.removePruefung(index)
    }
  }
  store.addPruefung(neuePruefung)
  router.push('/pruefung')
}
</script>

<template>
  <form class="container flex-grow-1" @submit.prevent="save">
    <h2 v-if="isNew" class="my-2">Neue Prüfung anlegen</h2>
    <h2 v-else class="my-2">Bestehende Prüfung bearbeiten</h2>
    <div class="my-3">
      <label for="inputName" class="form-label">Fach</label>
      <input
        id="inputName"
        class="form-control"
        type="text"
        v-model="formData.name"
        placeholder="z.B. Mathematik"
      />
    </div>

    <div class="mb-3">
      <label for="inputDate" class="form-label">Prüfungsdatum</label>
      <input
        id="inputDate"
        class="form-control"
        type="date"
        v-model="formData.examDate"
      />
    </div>

    <div class="mb-3">
      <label for="inputTime" class="form-label">Prüfungsuhrzeit</label>
      <input
        id="inputTime"
        class="form-control"
        type="time"
        v-model="formData.examTime"
      />
    </div>

    <div class="mb-3">
      <label for="inputWorkload" class="form-label">Aufwand in Stunden</label>
      <input
        id="inputWorkload"
        class="form-control"
        type="number"
        v-model="formData.workload"
        placeholder="z.B. 10"
      />
    </div>

    <div class="mb-3">
      <label for="inputStart" class="form-label">Lernbeginn</label>
      <input
        id="inputStart"
        class="form-control"
        type="date"
        v-model="formData.start"
      />
    </div>

    <div class="mb-3">
      <label for="inputDifficulty" class="form-label">Schwierigkeitsgrad</label>
      <select
        id="inputDifficulty"
        class="form-select"
        v-model="formData.difficulty"
      >
        <option value="leicht">leicht</option>
        <option value="mittel">mittel</option>
        <option value="schwer">schwer</option>
      </select>
    </div>

    <div class="flex-grow-1"></div>

    <div class="d-flex justify-content-around mb-4">
      <RouterLink to="/pruefung" v-if="!isNew" class="btn btn-danger"
        >Abbrechen</RouterLink
      >
      <button type="submit" class="btn btn-primary">Speichern</button>
    </div>
  </form>
</template>
