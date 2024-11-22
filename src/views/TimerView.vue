<script>
import { ref, computed, onMounted, onUnmounted } from "vue";

export default {
  name: "TimerView",
  setup() {
    const timerTime = ref(0);
    const timerProgress = ref(0);
    const phaseProgress = ref(0);
    const phaseTime = ref(0);
    const timerID = ref(null);
    const pomodoro = [0, 1500, 1800, 3300, 3600, 5100, 5400, 6900];
    const pomodoroIndex = ref(0);

    const toggleTimer = () => {
      if (!timerID.value) timerStart();
      else timerPause();
    };

    const timerStart = () => {
      timerID.value = setInterval(() => {
        timerTime.value += 100;
        console.log(timerTime.value);
        timerProgress.value = (timerTime.value / pomodoro[pomodoro.length - 1]) * 100;

        if (timerTime.value >= pomodoro[pomodoro.length - 1]) timerReset();

        if (pomodoro[pomodoroIndex.value] <= timerTime.value) pomodoroIndex.value++;

        phaseTime.value = timerTime.value - pomodoro[pomodoroIndex.value - 1];
        phaseProgress.value =
          (phaseTime.value / (pomodoro[pomodoroIndex.value] - pomodoro[pomodoroIndex.value - 1])) * 100;

        if (pomodoroIndex.value % 2 === 0) phaseProgress.value = 100 - phaseProgress.value;
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
      timerProgress.value = 0;
      pomodoroIndex.value = 0;
      phaseProgress.value = 0;
    };

    const buildTimerString = (time) => {
      let hours = Math.floor(time / 3600);
      let minutes = Math.floor((time % 3600) / 60);
      let seconds = time % 60;
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const phaseString = computed(() =>
      pomodoroIndex.value > 0
        ? buildTimerString((pomodoro[pomodoroIndex.value] - pomodoro[pomodoroIndex.value - 1]) - phaseTime.value)
        : "Start"
    );
    const timerString = computed(() => buildTimerString(timerTime.value));

    onUnmounted(() => {
      if (timerID.value) clearInterval(timerID.value);
    });

    return {
      timerTime,
      timerProgress,
      phaseProgress,
      phaseTime,
      pomodoro,
      pomodoroIndex,
      toggleTimer,
      timerString,
      phaseString,
      timerPause,
      timerReset,
    };
  },
};
</script>

<template>
  <div class="d-flex flex-column p-4 justify-content-between" style="height: 92vh;">
    <h1>Timer</h1>

    <div class="d-flex justify-content-center align-items-center h-75" style="position: relative;">
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
          '--color': pomodoroIndex % 2 == 1 ? '#007bff' : '#dc3545'
        }"
      ></div>
    </div>

    <div class="d-flex justify-content-center">
      <div class="progress w-75 position-relative">
        <div
          class="progress-bar fw-bold user-select-none"
          :class="{ 'bg-danger': pomodoroIndex % 2 == 0 }"
          role="progressbar"
          :style="{ width: `${timerProgress}%` }"
        >
          {{ timerString }}
        </div>

        <!-- Markierungen -->
        <div
          v-for="(time, index) in pomodoro"
          v-if="index > 0 && index < pomodoro.length"
          :key="index"
          class="h-100 bg-light position-absolute"
          :style="{ width: '0.25em', left: `${(time / pomodoro[pomodoro.length - 1]) * 100}%` }"
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