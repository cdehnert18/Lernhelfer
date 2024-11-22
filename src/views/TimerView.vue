<script>
export default {
  name: "TimerView",
  data() {
    return {
      timerTime: 0,
      timerString: "00:00:00",
      timerProgress: 0,
      phaseProgress: 0,
      phaseTime: 0,
      timerID: null,
      pomodoro: [0, 1500, 1800, 3300, 3600, 5100, 5400, 6900],
      pomodoroIndex: 0
    };
  },
  methods: {
    toggleTimer() {
      if (!this.timerID) 
        this.timerStart();
      else
        this.timerPause();
    },
    timerStart(){
      this.timerID = setInterval(() => {
        this.timerTime += 100;
        this.buildTimerString();
        this.timerProgress = this.timerTime / this.pomodoro[this.pomodoro.length-1] * 100;
        if (this.timerTime >= this.pomodoro[this.pomodoro.length-1])this.timerReset();
        if (this.pomodoro[this.pomodoroIndex] <= this.timerTime)this.pomodoroIndex++;
        
        this.phaseTime = this.timerTime - this.pomodoro[this.pomodoroIndex-1];
        this.phaseProgress = this.phaseTime / (this.pomodoro[this.pomodoroIndex] - this.pomodoro[this.pomodoroIndex-1]) * 100;
        if (this.pomodoroIndex % 2 == 0) this.phaseProgress = 100 - this.phaseProgress;
      }, 1000);
    },
    timerPause(){
      clearInterval(this.timerID);
      this.timerID = null;
    },
    timerReset(){
      this.timerRunning = false;
      this.timerTime = 0;
      clearInterval(this.timerID);
      this.timerID = null;
      this.timerProgress = 0;
    },
    buildTimerString(time){
      let hours = Math.floor(time / 3600);
      let minutes = Math.floor((time % 3600) / 60);
      let seconds = time % 60;
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  }
};
</script>

<template>
  <div class="d-flex flex-column p-4 justify-content-between" style="height: 92vh;">
    <h1>Timer</h1>
    
    <div class="d-flex justify-content-center align-items-center h-75" style="position: relative;">
        <!-- Hintergrundkreis -->
        <div class="rounded-circle z-1 bg-light h-50 aspect-ratio-1" @click="toggleTimer"></div>
        <!-- Timertext -->
        <div class="user-select-none z-2 fs-1 fw-bold position-absolute text-primary">{{pomodoroIndex>0?buildTimerString((pomodoro[pomodoroIndex]-pomodoro[pomodoroIndex-1])-phaseTime):'Start'}}</div>
        <!-- Kreissegment -->
        <div class="aspect-ratio-1 circle-piece rounded-circle position-absolute" 
            :style="{
              height: '55%', 
              '--percentage': `${phaseProgress}`, 
              '--color': pomodoroIndex % 2 == 1 ? '#007bff' : '#dc3545'
            }"
        >
        </div>
    </div>
    <div class="d-flex justify-content-center">
      <div class="progress w-75 position-relative">
        <div class="progress-bar fw-bold user-select-none" :class="{'bg-danger': pomodoroIndex%2==0}"  role="progressbar" :style="{width: `${timerProgress}%`}">{{buildTimerString(timerTime)}}</div>
        <div class="h-100 bg-light position-absolute" v-if="pomodoroIndex<2" style="width: 0.25em; left: 21.7%;"></div>
        <div class="h-100 bg-light position-absolute" v-if="pomodoroIndex<3" style="width: 0.25em; left: 26.05%;"></div>
        <div class="h-100 bg-light position-absolute" v-if="pomodoroIndex<4" style="width: 0.25em; left: 47.75%;"></div>
        <div class="h-100 bg-light position-absolute" v-if="pomodoroIndex<5" style="width: 0.25em; left: 52.1%;"></div>
        <div class="h-100 bg-light position-absolute" v-if="pomodoroIndex<6" style="width: 0.25em; left: 73.8%;"></div>
        <div class="h-100 bg-light position-absolute" v-if="pomodoroIndex<7" style="width: 0.25em; left: 78.15%;"></div>
      </div>
    </div>
  </div>

</template>

<style scoped>
  .aspect-ratio-1 {
    aspect-ratio: 1;
  }
  .circle-piece{
    background: conic-gradient(var(--color) calc(var(--percentage) * 1%), lightgray 0);
  }
</style>