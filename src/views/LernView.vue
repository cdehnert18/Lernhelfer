<script setup lang="ts">
import LearningDay from '@/components/LearningDay.vue'
import Placeholder from '@/components/Placeholder.vue'
import { useLearnUnitStore } from '@/stores/Learnunit';
import type { Learnunit } from '@/stores/Learnunit';
import { computed } from 'vue';

const store = useLearnUnitStore();
store.loadFromLocalStorage();

// Gruppiert die Lerneinheiten nach Datum
const learningDays = computed(() => {
  const learnunits = store.learnunits;
  const groupedByDay = new Map<string, Learnunit[]>();

  learnunits.forEach(unit => {
    const date = unit.date.toISOString().split('T')[0];
    if (groupedByDay.has(date)) {
      groupedByDay.get(date)?.push(unit);
    } else {
      groupedByDay.set(date, [unit]);
    }
  });

  return Array.from(groupedByDay).map(([datum, lerneinheiten]) => ({ datum, lerneinheiten }));
});
</script>

<template>
  <div>
    <LearningDay
      v-for="(day, index) in learningDays"
      :key="index"
      :datum="new Date(day.datum)"
      :lerneinheiten="day.lerneinheiten"
    />
    <Placeholder v-if="learningDays.length === 0">
      Füge Prüfungen hinzu, um deinen Lernplan zu befüllen
    </Placeholder>
  </div>
</template>
