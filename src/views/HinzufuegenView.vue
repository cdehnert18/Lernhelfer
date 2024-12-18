<script setup lang="ts">
import router from '@/router'
import { ref, onMounted } from 'vue'
import { usePruefungenStore } from '@/stores/Exam'

const store = usePruefungenStore()

const aktuellesDatum = new Date()

// Gibt an, ob eine neue Prüfung erstellt wird (true) oder
// eine bestehende Prüfung bearbeitet wird (false)
const isNew = ref(true)

// Formulardaten mit Standardwerten
const formData = ref({
  name: '',                                                       // Name der Prüfung
  examDate: '',                                                   // Datum der Prüfung
  examTime: '',                                                   // Uhrzeit der Prüfung
  workload: '',                                                   // geschätzter Aufwand zur Vorbereitung in Stunden
  start: (aktuellesDatum.toISOString() as string).split('T')[0],  // Datum, ab dem gelernt werden kann
  difficulty: 'leicht',                                           // Schwierigkeit der Prüfung
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
      // Übernahme aller Parameter in das Formular
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

// Initialisiert der Eingabefelder (wenn möglich)
onMounted(() => {
  const query = router.currentRoute.value.query
  const initializedData = initializeFormData(query)
  if (initializedData) {
    formData.value = initializedData    // Setzten der Parameter aus URL
    isNew.value = false                 // isNew = false, da bestehende Prüfung bearbeitet wird
  }
})

// Speichern der eingetragenen Werte als Prüfung,
// wenn kein Feld leer ist
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

  // Kombiniere Tag und Uhrzeit der Prüfung zu einer Variable
  const [hours, minutes] = formData.value.examTime.split(':')
  const examDateWithTime = new Date(formData.value.examDate)
  examDateWithTime.setHours(parseInt(hours, 10), parseInt(minutes, 10))

  // Extrahieren der Fom-Werte in Prüfung
  const neuePruefung = {
    name: formData.value.name,
    examDate: examDateWithTime,
    workload: parseInt(formData.value.workload),
    start: new Date(formData.value.start),
    difficulty: formData.value.difficulty,
    buffer: 0,
    excludedDays: [],
  }
  // Wenn eine bestehende Prüfung gearbeitet wurde:
  // - Suche und Löschung der alten Prüfung
  // - Speicherung der neuen Prüfung
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
    <!--Name der Prüfung-->
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

    <!--Datum der Prüfung-->
    <div class="mb-3">
      <label for="inputDate" class="form-label">Prüfungsdatum</label>
      <input
        id="inputDate"
        class="form-control"
        type="date"
        v-model="formData.examDate"
      />
    </div>

    <!--Uhrzeit der Prüfung-->
    <div class="mb-3">
      <label for="inputTime" class="form-label">Prüfungsuhrzeit</label>
      <input
        id="inputTime"
        class="form-control"
        type="time"
        v-model="formData.examTime"
      />
    </div>

    <!--geschätzter Aufwand zur Vorbereitung in Stunden-->
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

    <!--Datum, ab dem gelernt werden kann-->
    <div class="mb-3">
      <label for="inputStart" class="form-label">Lernbeginn</label>
      <input
        id="inputStart"
        class="form-control"
        type="date"
        v-model="formData.start"
      />
    </div>

    <!--Schwierigeit der Prüfung-->
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
