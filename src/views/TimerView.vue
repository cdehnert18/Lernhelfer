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
    <div class="d-flex justify-content-center">
      <div class="progress w-75 position-relative">
        <div class="progress-bar fw-bold user-select-none" role="progressbar" style="width: 60%;" aria-valuemin="0" aria-valuemax="100">1:15</div>
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