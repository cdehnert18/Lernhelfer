<script>
import { ref, computed, onMounted, onUnmounted } from "vue";

export default {
  name: "TimerView",
  setup() {
    // Zum Vorführen des Timers kann die Konstante TIMER_INTERVAL auf 100 gesetzt werden, sodass immer 100 Sekunden pro Sekunde vergehen. Sonst auf 1 setzen.
    const TIMER_INTERVAL = 100;

    // Zeit des Timers in Sekunden und Progress in Prozent (von 2 Stunden und 55 Minuten)
    const timerTime = ref(0);
    const timerProgress = computed(() => (timerTime.value / pomodoro[pomodoro.length - 1]) * 100);

    // Zeit des aktuellen Phasenabschnitts in Sekunden und Progress in Prozent (von 25 Minuten für Arbeit und 5 Minuten für Pause)
    const phaseTime = computed(() => timerTime.value - pomodoro[pomodoroIndex.value - 1]);
    const phaseProgress = computed(() => {
      let progress = phaseTime.value / (pomodoro[pomodoroIndex.value] - pomodoro[pomodoroIndex.value - 1]) * 100;
      if (inWork.value) return progress;
      return 100 - progress;
    });

    // Arbeit oder Pause
    const inWork = computed(() => pomodoroIndex.value % 2 === 1);

    // TimerID des laufenden Timers um ihn zu pausieren
    const timerID = ref(null);

    // Pomodoro-Phasen in Sekunden und Index des aktuellen Phasenabschnitts
    const pomodoro = [0, 1500, 1800, 3300, 3600, 5100, 5400, 6900];
    const pomodoroIndex = ref(0);

    // Funktionen zum Starten, Pausieren und Zurücksetzen des Timers
    const toggleTimer = () => {
      if (!timerID.value) timerStart();
      else timerPause();
    };

    const timerStart = () => {
      timerID.value = setInterval(() => {
        timerTime.value += TIMER_INTERVAL;

        if (timerTime.value >= pomodoro[pomodoro.length - 1]) timerReset();

        if (pomodoro[pomodoroIndex.value] <= timerTime.value) pomodoroIndex.value++;
      }, 1000);
    };

    const timerPause = () => {
      clearInterval(timerID.value);
      timerID.value = null;
    };

    const timerReset = () => {
      timerTime.value = 0;
      clearInterval(timerID.value);
      timerID.value = null;
      pomodoroIndex.value = 0;
    };

    // Erstellt einen String aus der Zeit in Sekunden
    const buildTimeString = (time) => {
      let hours = Math.floor(time / 3600);
      let minutes = Math.floor((time % 3600) / 60);
      let seconds = time % 60;
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const phaseString = computed(() =>
      pomodoroIndex.value > 0
        ? buildTimeString((pomodoro[pomodoroIndex.value] - pomodoro[pomodoroIndex.value - 1]) - phaseTime.value)
        : "Start"
    );
    const timerString = computed(() => buildTimeString(timerTime.value));

    onUnmounted(() => {
      if (timerID.value) clearInterval(timerID.value);
    });

    return {
      timerTime, timerProgress, phaseProgress, phaseTime, pomodoro, pomodoroIndex, inWork, 
      timerString, phaseString,
      toggleTimer,timerPause,timerReset,
    };
  },
};
</script>

<template>
  <div class="d-flex flex-column p-4 justify-content-between" style="height: 92vh;">
    <h1>Timer</h1>
    <div class="d-flex justify-content-center" style="margin-top: 20px">
      <select class="form-select w-25">
        <option selected>Mathematik</option>
        <option>Geschichte</option>
      </select>
    </div>
    <div class="d-flex justify-content-center align-items-center h-75" style="position: relative">
      <!-- Hintergrundkreis -->
      <div class="rounded-circle z-1 bg-light h-50 aspect-ratio-1" @click="toggleTimer"></div>
      <!-- Timertext -->
      <div class="user-select-none z-2 fs-1 fw-bold position-absolute text-primary">{{ phaseString }}</div>
      <!-- Kreissegment -->
      <div
        class="aspect-ratio-1 circle-piece rounded-circle position-absolute"
        :style="{
          height: '55%',
          '--percentage': `${phaseProgress}`,
          '--color': inWork ? '#007bff' : '#dc3545'
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
          {{ pomodoroIndex>1?timerString:'' }}
        </div>

        <!-- Markierungen -->
        <div
          v-for="(time, index) in pomodoro.slice(1, this.pomodoro.length - 1)"
          :key="index"
          class="h-100 bg-light position-absolute"
          :style="{ width: '0.25em', left: `${(time / pomodoro[pomodoro.length - 1]) * 100}%`, display: index < pomodoroIndex-1 ? 'none' : 'block' }"
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
  background: conic-gradient(var(--color) calc(var(--percentage) * 1%), lightgray 0);
}
</style>