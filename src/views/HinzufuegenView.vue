<script setup lang="ts">
import router from '@/router'
import { ref, onMounted } from 'vue'
import { usePruefungenStore, type Pruefung } from '@/stores/Exam'
import { useLearnUnitStore } from '@/stores/Learnunit'

const store = usePruefungenStore()
const learnunitStore = useLearnUnitStore()


const aktuellesDatum = new Date()

// true, wenn eine völlig neue Prüfung erstellt wird
// false, wenn eine bestehende Prüfung bearbeitet wird
const isNew = ref(true)

const formData = ref({
  name: '',
  examDate: '',
  workload: '',
  start: (aktuellesDatum.toISOString() as string).split('T')[0],
  difficulty: 'leicht',
})

// Initialisierung der Eingabefelder, wenn alle Parameter der URL existieren
function initializeFormData(query: Record<string, unknown>) {
  if (
    query.fach &&
    query.date &&
    query.effort &&
    query.start &&
    query.difficulty
  ) {
    return {
      name: query.fach as string,
      examDate: (query.date as string).split('.')[0],
      workload: query.effort as string,
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

  const neuePruefung: Pruefung = {
    name: formData.value.name,
    examDate: new Date(formData.value.examDate),
    workload: parseInt(formData.value.workload),
    start: new Date(formData.value.start),
    difficulty: formData.value.difficulty,
    buffer: 0,
    excludedDays: [],
    learnedTime: 0,
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
      // Buffer, ausgeschlossene Tage und gelernte Zeit von alter Prüfung übernehmen
      const altePruefung = store.pruefungen[index]
      neuePruefung.buffer = altePruefung.buffer
      neuePruefung.excludedDays = altePruefung.excludedDays
      neuePruefung.learnedTime = altePruefung.learnedTime
      store.removePruefung(index)
    }

    // alte Lerneinheiten löschen
    for (let i = learnunitStore.learnunits.length - 1; i >= 0; i--) {
      const learnunit = learnunitStore.learnunits[i]
      if (
        learnunit.exam.name === router.currentRoute.value.query.fach &&
        learnunit.exam.examDate.toISOString() === router.currentRoute.value.query.date
      ) {
        learnunitStore.removeLearnunit(i)
      }
    }
  }
  store.addPruefung(neuePruefung, isNew.value)
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
      <label for="inputDate" class="form-label">Datum</label>
      <input
        id="inputDate"
        class="form-control"
        type="datetime-local"
        v-model="formData.examDate"
      />
    </div>

    <div class="mb-3">
      <label for="inputEffort" class="form-label">Aufwand in Stunden</label>
      <input
        id="inputEffort"
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
