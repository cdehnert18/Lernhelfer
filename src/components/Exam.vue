<script setup lang="ts">
import { computed, defineComponent, defineEmits } from 'vue'

defineComponent({
  name: 'ExamComponent',
})

const emit = defineEmits<{
  (event: 'examDeleted', fach: string, date: Date): void
}>()

const props = defineProps<{
  pruefung: string
  zeitraumStart: Date
}>()

function deletePruefung() {
  emit('examDeleted', props.pruefung, props.zeitraumStart)
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
