<script setup lang="ts">
import router from '@/router'
import { ref } from 'vue'

const formData = ref({
  name: '',
  date: '',
  workload: '',
  startLearning: '',
  difficulty: 'leicht',
})

function save() {
  const neuePruefung = {
    fach: formData.value.name,
    date: formData.value.date,
  }
  const gespeichertePruefungen = JSON.parse(
    localStorage.getItem('pruefungen') || '[]',
  )

  gespeichertePruefungen.push(neuePruefung)
  localStorage.setItem('pruefungen', JSON.stringify(gespeichertePruefungen))
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
