<script setup lang="ts">
import { useLearnUnitStore } from '@/stores/Learnunit'
import { useRouter } from 'vue-router'

const props = defineProps<{
  pruefung: string
  lerndauer: number
  date: Date
}>()

const learnunitStore = useLearnUnitStore()
const router = useRouter()

function startLearnunit() {
  const learnunit = learnunitStore.learnunits.find(
    learnunit =>
      learnunit.exam.name === props.pruefung &&
      learnunit.date.getTime() === props.date.getTime(),
  )
  if (learnunit && learnunit.date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]) {
    const queryParams = {
      exam: learnunit.exam.name,
      examDate: learnunit.exam.examDate.toISOString(),
      date: learnunit.date.toISOString(),
    }
    router.push({ path: '/', query: queryParams })
  }
}
</script>


<template>
  <div
    class="container border border-tertiary bg-body-secondary rounded shadow p-3"
  >
    <div class="row align-items-center">
      <div class="col">
        <h6>{{ pruefung }}</h6>
        <small>{{ lerndauer }} Minuten</small>
      </div>
      <div class="col-auto d-flex gap-2">
        <button class="btn btn-danger">Löschen</button>
        <div @click="startLearnunit" class="btn btn-success">Start</div>
      </div>
    </div>
  </div>
</template>
