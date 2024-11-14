<script setup lang="ts">
defineProps<{
  pruefung: string
  lerndauer: number
}>()
</script>

<template>
  <div
    class="container border border-tertiary bg-body-secondary rounded shadow p-3"
  >
    <div class="row align-items-center">
      <div class="col">
        <h6>{{ pruefung }}</h6>
        <small>{{ lerndauer }} Minuten</small>
      </div>
      <div class="col-auto d-flex gap-2">
        <button class="btn btn-danger">Löschen</button>
        <router-link to="/" class="btn btn-success">Start</router-link>
      </div>
    </div>
  </div>
</template>
