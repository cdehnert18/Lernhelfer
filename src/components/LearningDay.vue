<script setup lang="ts">
import { computed } from 'vue'
import LearningUnit from '@/components/LearningUnit.vue'
import type { Learnunit } from '@/stores/Learnunit';
import { useWochentag } from '@/composables/useWochentag';


const props = defineProps<{
  datum: Date
  lerneinheiten: Learnunit[]
}>()
const { wochentag } = useWochentag(props.datum);
</script>

<template>
  <header class="px-4 mt-2 mb-2">
    <div class="container px-0">
      <h4>{{ wochentag }}</h4>
      <h6>{{ props.datum.toLocaleDateString('de-DE') }}</h6>
    </div>
  </header>
  <main class="px-4">
    <LearningUnit
      v-for="(lerneinheit, index) in props.lerneinheiten"
      :key="index"
      class="mb-3"
      :pruefung="lerneinheit.exam.name"
      :lerndauer="lerneinheit.duration"
      :date="lerneinheit.date"
    ></LearningUnit>
  </main>
</template>
