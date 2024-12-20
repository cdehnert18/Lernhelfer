<script setup lang="ts">
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { usePruefungenStore } from '@/stores/Exam'

const router = useRouter()

defineComponent({
  name: 'ExamComponent',
})

// Löschen per Emit an ExamDay weitergeben
const emit = defineEmits<{
  (event: 'examDeleted', name: string, examDate: Date): void
}>()

const props = defineProps<{
  pruefung: string      // Name der Prüfung
  zeitraumStart: Date   // Uhrzeit, zu der Prüfung beginnt
}>()

const pruefungenStore = usePruefungenStore()

// Löschen per Emit an ExamDay weitergeben
function deletePruefung() {
  emit('examDeleted', props.pruefung, props.zeitraumStart)
}

function editPruefung() {
  // Suche passende Prüfung aus Store
  const pruefung = pruefungenStore.pruefungen.find(
    exam =>
      exam.name === props.pruefung &&
      exam.examDate.getTime() === props.zeitraumStart.getTime(), // Vergleiche beide Zeiten
  )

  // Zusammenstellung URL-Parameter für HinzufuegenView
  if (pruefung) {
    const queryParams = {
      fach: pruefung.name,                    // Prüfungsname
      date: pruefung.examDate.toISOString(),  // Datum der Prüfung mit Uhrzeit
      workload: pruefung.workload,            // Aufwand in Stunden
      start: pruefung.start.toISOString(),    // Startdatum zum Lernen
      difficulty: pruefung.difficulty,        // Schwierigkeitsstufe der Prüfung
    }

    // Wechsel zu HinzufuegenView
    router.push({ path: '/add', query: queryParams })
  }
}

// Formatierung des Prüfungsdatums
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
