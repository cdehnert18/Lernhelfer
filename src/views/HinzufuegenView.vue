<script setup lang="ts">
import InputUnit from '@/components/InputUnit.vue'
const options = [{ text: 'leicht' }, { text: 'mittel' }, { text: 'schwer' }]
const inputUnits = [
  { label: 'Name', inputType: 'text', placeholder: 'Prüfungsname' },
  { label: 'Datum', inputType: 'date', placeholder: 'Prüfungsdatum' },
  { label: 'Arbeitsaufwand', inputType: 'number', placeholder: 'Aufwand in Stunden' },
  { label: 'Lernbeginn', inputType: 'date', placeholder: 'Datum' }
]
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <InputUnit v-for="(unit, index) in inputUnits" :key=index :label=unit.label :inputType=unit.inputType
          :placeholder=unit.placeholder />
        <div class="form-group mb-3">
          <label for="selectDifficulty" class="form-label">Schwierigkeitsgrad</label>
          <select id="selectDifficulty" class="form-select">
            <option v-for="(option, index) in options" :key="index">
              {{ option.text }}
            </option>
          </select>
        </div>
        <div class="d-flex justify-content-between">
          <button class="btn">Abbrechen</button>
          <button class="btn btn-primary">Speichern</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>