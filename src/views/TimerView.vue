<template>
  <div class="d-flex flex-column p-4 justify-content-between page">
    <h1>Timer</h1>
    
    <div class="d-flex justify-content-center align-items-center h-75" style="position: relative;">
        <div class="rounded-circle bg-light h-50 timer"></div>
        <div class="time text-primary">2:30</div>
        <div class="test" style="height: 55%; --percentage: 30;"></div>
    </div>
    <div>
      <div value='20' class="progress">
        <div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuemin="0" aria-valuemax="100">25%</div>
      </div>
    </div>
  </div>

</template>

<style scoped>
  .timer {
    aspect-ratio: 1;
    z-index: 3;
  }
  .page{
    height: 92vh;
  }
  .test{
    aspect-ratio: 1;
    border-radius: 100%;
    position: absolute;
    z-index: 1;
    background: conic-gradient(#007bff calc(var(--percentage) * 1%), lightgray 0);
  }
  .time{
    z-index: 4;
    font-weight: bold;
    font-size: 2rem;
    position: absolute;
  }
</style>