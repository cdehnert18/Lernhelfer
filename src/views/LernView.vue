<script setup lang="ts">
import LearningDay from '@/components/LearningDay.vue'
import { useLearnUnitStore } from '@/stores/Learnunit';
import type { Learnunit } from '@/stores/Learnunit';

const getLearningDays = () => {
  useLearnUnitStore().loadFromLocalStorage();
  const learnunits = useLearnUnitStore().learnunits;
  const groupedByDay = new Map<string, Learnunit[]>();
  learnunits.forEach(unit =>{
    const date = unit.date.toISOString().split('T')[0];
    if(groupedByDay.has(date)){
      groupedByDay.get(date)?.push(unit);
    } else {
      groupedByDay.set(date, [unit]);
    }
  })
  const learningDays = Array.from(groupedByDay).map(([datum, lerneinheiten]) => ({datum, lerneinheiten}));
  return learningDays;
}

</script>

<template>
  <div>
    <LearningDay v-for="(day, index) in getLearningDays()" :key="index" :datum="new Date(day.datum)"
      :lerneinheiten="day.lerneinheiten" />
  </div>
</template>
