<script setup lang="ts">
import { computed } from 'vue'
import { defineComponent } from 'vue';

defineComponent({
  name: 'ExamComponent',
})

const props = defineProps<{
  pruefung: string
  zeitraumStart: Date
  zeitraumEnde: Date
}>()

const zeitraum = computed(() => {
  const hoursStart = props.zeitraumStart.getHours().toString().padStart(2, '0');
  const minutesStart = props.zeitraumStart.getMinutes().toString().padStart(2, '0');
  const hoursEnde = props.zeitraumEnde.getHours().toString().padStart(2, '0');
  const minutesEnde = props.zeitraumEnde.getMinutes().toString().padStart(2, '0');
  const zeitraum = `${hoursStart}:${minutesStart} - ${hoursEnde}:${minutesEnde}`;

  return zeitraum
})
</script>

<template>
  <div
    class="container border border-tertiary bg-body-secondary rounded shadow p-3"
  >
    <div class="row align-items-center">
      <div class="col">
        <h6>{{ pruefung }}</h6>
        <small>{{ zeitraum }}</small>
      </div>
      <div class="col-auto d-flex gap-2">
        <button class="btn btn-danger">Löschen</button>
        <router-link to="/" class="btn btn-success">Bearbeiten</router-link>
      </div>
    </div>
  </div>
</template>
