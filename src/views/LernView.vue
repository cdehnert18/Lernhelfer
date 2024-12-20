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
  // Neue Map, um Lerneinheiten nach Datum zu gruppieren
  // Key ist Datum als String,
  // Value ist ein Array von Lerneinheiten (Learnunit[]), für diesen Tag
  const groupedByDay = new Map<string, Learnunit[]>();

  learnunits.forEach(unit => {
    const date = unit.date.toISOString().split('T')[0];
    if (groupedByDay.has(date)) {
      // Wenn Datum schon in Map vorkommt
      // speichere Lerneinheit dort
      groupedByDay.get(date)?.push(unit);
    } else {
      // Sonst füge Datum und Lerneinheit neu hinzu
      groupedByDay.set(date, [unit]);
    }
  });

  // Array, dass alle Lerntage und
  // an diesem Tag stattfindende Lerneinheiten enthält
  return Array.from(groupedByDay).map(([datum, lerneinheiten]) => ({ datum, lerneinheiten }));
});
</script>

<template>
  <div>
    <!--alle Lerntage anzeigen-->
    <LearningDay
      v-for="(day, index) in learningDays"
      :key="index"
      :datum="new Date(day.datum)"
      :lerneinheiten="day.lerneinheiten"
    />
    <!--falls es keine Tage wo gelernt werden soll gibt-->
    <Placeholder v-if="learningDays.length === 0">
      Füge Prüfungen hinzu, um deinen Lernplan zu befüllen
    </Placeholder>
  </div>
</template>
