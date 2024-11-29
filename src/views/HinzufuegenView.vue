<script setup lang="ts">
import router from '@/router'
import { ref, onMounted } from 'vue'
import { usePruefungenStore } from '@/stores/Exam'

const store = usePruefungenStore()
const formData = ref({
  name: '',
  date: '2023-07-27T19:20',
  workload: '',
  startLearning: '2023-07-20',
  difficulty: 'leicht',
})

onMounted(() => {
  // Extrahiere die Werte aus der Route, wenn vorhanden
  const query = router.currentRoute.value.query
  if (query.fach) {
    formData.value.name = query.fach as string
  }
  if (query.date) {
    formData.value.date = (query.date as string).split('.')[0]
  }
  if (query.effort) {
    formData.value.workload = query.effort as string
  }
  if (query.start) {
    formData.value.startLearning = (query.start as string).split('T')[0]
  }
  if (query.difficulty) {
    formData.value.difficulty = query.difficulty as string
  }
})

function save() {
  if (
    !formData.value.name ||
    !formData.value.date ||
    !formData.value.workload ||
    !formData.value.startLearning
  ) {
    alert('Bitte füllen Sie alle erforderlichen Felder aus.')
    return
  }
  const neuePruefung = {
    fach: formData.value.name,
    date: new Date(formData.value.date),
    effort: parseInt(formData.value.workload),
    start: new Date(formData.value.startLearning),
    difficulty: formData.value.difficulty,
  }

  store.addPruefung(neuePruefung)
  router.push('/pruefung')
}
</script>

<template>
  <form class="container flex-grow-1" @submit.prevent="save">
    <h2 class="my-2">Neue Prüfung anlegen</h2>
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
        v-model="formData.date"
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
        v-model="formData.startLearning"
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
      <button type="button" class="btn btn-danger">Abbrechen</button>
      <button type="submit" class="btn btn-primary">Speichern</button>
    </div>
  </form>
</template>
