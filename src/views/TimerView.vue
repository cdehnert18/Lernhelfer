<template>
  <div class="d-flex flex-column p-4 justify-content-between" style="height: 92vh;">
    <h1>Timer</h1>
    
    <div class="d-flex justify-content-center align-items-center h-75" style="position: relative;">
        <!-- Hintergrundkreis -->
        <div class="rounded-circle z-1 bg-light h-50 aspect-ratio-1"></div>
        <!-- Timertext -->
        <div class="user-select-none z-2 fs-1 fw-bold position-absolute text-primary">2:30</div>
        <!-- Kreissegment -->
        <div class="aspect-ratio-1 circle-piece rounded-circle position-absolute" style="height: 55%; --percentage: 30;"></div>
    </div>
    <div>
      <div value='20' class="progress">
        <div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuemin="0" aria-valuemax="100">25%</div>
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