<template>
  <div class="d-flex flex-column p-4 justify-content-between page">
    <h1>Timer</h1>
    
    <div class="d-flex justify-content-center d-flex align-items-center h-75">
      <div class="rounded-circle bg-light h-50 timer"></div>
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
  }
  .page{
    height: 92vh;
  }

</style>