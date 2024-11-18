<script>
export default {
  name: "TimerView",
  data() {
    return {
      timerRunning: false,
      timerTime: 0,
      timerString: "00:00:00",
      timerProgress: 0,
      timerID: null
    };
  },
  methods: {
    timerStart() {
      if (!this.timerRunning) {
        this.timerRunning = true;
        this.timerID = setInterval(() => {
          this.timerTime += 1;
          this.buildTimerString();
          this.timerProgress = this.timerTime / 2000 * 100;
          if (this.timerTime >= 2000)this.timerStop();
        }, 1000);
      }
    },
    timerStop(){
      this.timerRunning = false;
      this.timerTime = 0;
      clearInterval(this.timerID);
      this.timerID = null;
      this.timerProgress = 0;
    },
    buildTimerString(){
      let hours = Math.floor(this.timerTime / 3600);
      let minutes = Math.floor((this.timerTime % 3600) / 60);
      let seconds = this.timerTime % 60;
      this.timerString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  }
};
</script>

<template>
  <div class="d-flex flex-column p-4 justify-content-between" style="height: 92vh;">
    <h1>Timer</h1>
    
    <div class="d-flex justify-content-center align-items-center h-75" style="position: relative;">
        <!-- Hintergrundkreis -->
        <div class="rounded-circle z-1 bg-light h-50 aspect-ratio-1" @click="timerStart"></div>
        <!-- Timertext -->
        <div class="user-select-none z-2 fs-1 fw-bold position-absolute text-primary">{{timerString}}</div>
        <!-- Kreissegment -->
        <div class="aspect-ratio-1 circle-piece rounded-circle position-absolute" :style="{height: '55%', '--percentage': `${timerProgress}`}"></div>
    </div>
    <div class="d-flex justify-content-center">
      <div class="progress w-75 position-relative">
        <div class="progress-bar fw-bold user-select-none" role="progressbar" style="width: 60%;">1:15</div>
        <div class="h-100 bg-light position-absolute" style="width: 0.25em; left: 21.7%;"></div>
        <div class="h-100 bg-light position-absolute" style="width: 0.25em; left: 26.05%;"></div>
        <div class="h-100 bg-light position-absolute" style="width: 0.25em; left: 47.75%;"></div>
        <div class="h-100 bg-light position-absolute" style="width: 0.25em; left: 52.1%;"></div>
        <div class="h-100 bg-light position-absolute" style="width: 0.25em; left: 73.8%;"></div>
        <div class="h-100 bg-light position-absolute" style="width: 0.25em; left: 78.15%;"></div>
      </div>
    </div>
  </div>

</template>

<style scoped>
  .aspect-ratio-1 {
    aspect-ratio: 1;
  }
  .circle-piece{
    background: conic-gradient(#007bff calc(var(--percentage) * 1%), lightgray 0);
  }
</style>