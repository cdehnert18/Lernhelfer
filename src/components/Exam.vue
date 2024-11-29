<script setup lang="ts">
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { usePruefungenStore } from '@/stores/Exam'

const router = useRouter()

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

const pruefungenStore = usePruefungenStore()

function deletePruefung() {
  emit('examDeleted', props.pruefung, props.zeitraumStart)
}

function editPruefung() {
  const pruefung = pruefungenStore.pruefungen.find(
    exam =>
      exam.fach === props.pruefung &&
      exam.date.getTime() === props.zeitraumStart.getTime(), // Vergleiche beide Zeiten
  )

  if (pruefung) {
    const queryParams = {
      fach: pruefung.fach,
      date: pruefung.date.toISOString(),
      effort: pruefung.effort,
      start: pruefung.start.toISOString(),
      difficulty: pruefung.difficulty,
    }

    router.push({ path: '/add', query: queryParams })
  } else {
    console.error('Prüfung nicht gefunden!')
  }
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
        <button class="btn btn-success" @click="editPruefung">
          Bearbeiten
        </button>
      </div>
    </div>
  </div>
</template>
