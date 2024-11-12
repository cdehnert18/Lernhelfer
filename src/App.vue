<script setup lang="ts"></script>

<template>
  <!-- <div class="container bg-primary text-white">Bootstrap is working.</div> -->
   <div class="container">
    <RouterView />
    <Navigation />
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation.vue'
  export default {
    components: {
      Navigation
    },
  };
</script>

<style>
  .container {
    background-color: rgb(65, 54, 54);
    height: 96vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 2vh;
  }
</style>