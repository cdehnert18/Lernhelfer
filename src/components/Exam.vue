<script setup lang="ts">
import { computed } from 'vue'
import { defineComponent } from 'vue'

defineComponent({
  name: 'ExamComponent',
})

const props = defineProps<{
  pruefung: string
  zeitraumStart: Date
}>()

function deletePruefung() {
  const pruefungen = JSON.parse(localStorage.getItem('pruefungen') || '[]')

  const updatedPruefungen = pruefungen.filter(
    (item: { fach: string; date: string }) =>
      item.fach !== props.pruefung ||
      new Date(item.date).getTime() !== props.zeitraumStart.getTime(),
  )

  localStorage.setItem('pruefungen', JSON.stringify(updatedPruefungen))
}

const zeitraum = computed(() => {
  return `${props.zeitraumStart.getHours().toString().padStart(2, '0')}:${props.zeitraumStart
    .getMinutes()
    .toString()
    .padStart(2, '0')}`
})
</script>

<template>
  <div
    class="container border border-tertiary bg-body-secondary rounded shadow p-3"
  >
    <div class="row align-items-center">
      <div class="col">
        <h6>{{ pruefung }}</h6>
        <small>{{ zeitraum }}</small>
      </div>
      <div class="col-auto d-flex gap-2">
        <button class="btn btn-danger" @click="deletePruefung">Löschen</button>
        <router-link to="/" class="btn btn-success">Bearbeiten</router-link>
      </div>
    </div>
  </div>
</template>
