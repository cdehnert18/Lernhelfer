<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { useLearnUnitStore } from '@/stores/Learnunit';
import type { Learnunit } from '@/stores/Learnunit';

// Konstante für Timer-Intervall
const TIMER_INTERVAL = 60

// Zeit des Timers in Sekunden und Fortschritt in Prozent
const timerTime = ref(0)
const pomodoro = [0, 1500, 1800, 3300, 3600, 5100, 5400, 6900]
const pomodoroIndex = ref(0)

// Timer-ID des laufenden Timers
const timerID = ref<ReturnType<typeof setInterval> | null>(null)

// Timer-Progress in Prozent (basierend auf 2 Stunden und 55 Minuten)
const timerProgress = computed(() => {
  return (timerTime.value / pomodoro[pomodoro.length - 1]) * 100
})

// Phasen-Zeit und Fortschritt
const phaseTime = computed(() => {
  return timerTime.value - pomodoro[pomodoroIndex.value - 1]
})

const phaseProgress = computed(() => {
  const phaseLength =
    pomodoro[pomodoroIndex.value] - pomodoro[pomodoroIndex.value - 1]
  const progress = (phaseTime.value / phaseLength) * 100
  return inWork.value ? progress : 100 - progress
})

// Erkennung: Arbeit oder Pause
const inWork = computed(() => pomodoroIndex.value % 2 === 1)

const selectedLearnunit = ref<Learnunit | null>(null)

const learnunitSelection = useTemplateRef('learnunitSelection')

const router = useRouter()

// Timer-Funktionen
const timerStart = () => {
  if (selectedLearnunit.value === null) {
    learnunitSelection.value?.focus()
    learnunitSelection.value?.showPicker()
    return
  }
  if(learnunitSelection.value)
    learnunitSelection.value.disabled = true

  timerID.value = setInterval(() => {
    timerTime.value += TIMER_INTERVAL

    if (timerTime.value%60 == 0 && selectedLearnunit.value && inWork.value){
      selectedLearnunit.value.duration--
      if(selectedLearnunit.value.duration <= 0){
        useLearnUnitStore().completeLearnunit(selectedLearnunit.value)
        selectedLearnunit.value = null
        if(learnunitSelection.value)
          learnunitSelection.value.disabled = false
        getFilteredLearnunits().length>0?timerPause():timerReset()
      }
    }

    if (timerTime.value >= pomodoro[pomodoro.length - 1])
      timerReset()

    if (pomodoro[pomodoroIndex.value] <= timerTime.value)
      pomodoroIndex.value++

  }, 1000)
}

const timerPause = () => {
  if (timerID.value) {
    clearInterval(timerID.value)
    timerID.value = null
  }
}

const timerReset = () => {
  selectedLearnunit.value = null
  if(learnunitSelection.value)
    learnunitSelection.value.disabled = false
  timerTime.value = 0
  pomodoroIndex.value = 0
  timerPause()
}

const toggleTimer = () => {
  if (timerID.value) {
    timerPause()
  } else {
    timerStart()
  }
}

// Filtert die Lerneinheiten für den aktuellen Tag welche noch nicht abgeschlossen sind
const getFilteredLearnunits = () => {
  const today = new Date().toISOString().split('T')[0];
  return useLearnUnitStore().learnunits.filter((item)=>
    item.date.toISOString().split('T')[0] === today
  )
}

// Hilfsfunktion: Zeit-String erstellen
const buildTimeString = (time: number) => {
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = time % 60
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// Zeit-Strings für Anzeige
const phaseString = computed(() => {
  if (pomodoroIndex.value > 0) {
    const remainingTime =
      pomodoro[pomodoroIndex.value] -
      pomodoro[pomodoroIndex.value - 1] -
      phaseTime.value
    return buildTimeString(remainingTime)
  }
  return 'Start'
})

const timerString = computed(() => buildTimeString(timerTime.value))

// Timer aufräumen bei Entladen der Komponente
onUnmounted(() => {
  timerPause()
})

onMounted(() => {
  const query = router.currentRoute.value.query
  if (query.exam && query.examDate && query.date) {
    const learnunit = useLearnUnitStore().learnunits.find(
      learnunit =>
        learnunit.exam.name === query.exam &&
        learnunit.exam.examDate.toISOString() === query.examDate &&
        learnunit.date.toISOString() === query.date,
    )
    if (learnunit) {
      selectedLearnunit.value = learnunit
    }
  }
})
</script>

<template>
  <div
    class="d-flex flex-column p-4 justify-content-between"
    style="height: 92vh"
  >
    <!-- Lerneinheiten-Auswahl -->
    <div class="d-flex justify-content-center" style="margin-top: 20px">
      <select class="form-select w-75" v-model="selectedLearnunit" ref="learnunitSelection">
        <option :value="null" selected disabled hidden>Lerneinheit auswählen ...</option>
        <option 
          v-for="(learnunit, index) in getFilteredLearnunits()"
          :key="index"
          :value="learnunit">
              {{ learnunit.exam.name }} ({{ learnunit.duration }}min)
        </option>
      </select>
    </div>

    <div v-if="!selectedLearnunit && getFilteredLearnunits().length>0" class="w-100 text-danger text-center fs-3">Wähle einen Lernblock</div>
    <div v-if="!selectedLearnunit && getFilteredLearnunits().length==0" class="w-100 text-success text-center fs-3">Alle Lernblöcke für heute abgeschlossen</div>

    <div
      class="d-flex justify-content-center align-items-center h-75"
      style="position: relative"
    >
      <!-- Hintergrundkreis -->
      <div
        class="rounded-circle z-1 bg-light h-50 aspect-ratio-1"
        @click="toggleTimer"
      ></div>
      <!-- Timertext -->
      <div
        class="user-select-none z-2 fs-1 fw-bold position-absolute text-primary" style="pointer-events: none"
      >
        {{ phaseString }}
      </div>
      <!-- Kreissegment -->
      <div
        class="aspect-ratio-1 circle-piece rounded-circle position-absolute"
        :style="{
          height: '55%',
          '--percentage': `${phaseProgress}`,
          '--color': inWork ? '#007bff' : '#dc3545',
        }"
      ></div>
    </div>

    <!-- Fortschrittsbalken des Lerblockes-->
    <div class="d-flex justify-content-center">
      <div class="progress w-75 position-relative">
        <div
          class="progress-bar fw-bold user-select-none"
          :class="{ 'bg-danger': !inWork }"
          role="progressbar"
          :style="{ width: `${timerProgress}%` }"
        >
          {{ pomodoroIndex > 1 ? timerString : '' }}
        </div>

        <!-- Markierungen -->
        <div
          v-for="(time, index) in pomodoro.slice(1, pomodoro.length - 1)"
          :key="index"
          class="h-100 bg-light position-absolute"
          :style="{
            width: '0.25em',
            left: `${(time / pomodoro[pomodoro.length - 1]) * 100}%`,
            display: index < pomodoroIndex - 1 ? 'none' : 'block',
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.aspect-ratio-1 {
  aspect-ratio: 1;
}
.circle-piece {
  background: conic-gradient(
    var(--color) calc(var(--percentage) * 1%),
    lightgray 0
  );
}
</style>
