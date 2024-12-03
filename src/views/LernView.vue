<script setup lang="ts">
import LearningDay from '@/components/LearningDay.vue'
import { usePruefungenStore } from '@/stores/Exam'
import type { Pruefung } from '@/stores/Exam'
import { useLearnUnitStore } from '@/stores/Learnunit';
import type { Learnunit } from '@/stores/Learnunit';
import { onMounted } from 'vue';

const store = usePruefungenStore()

const createLearnPlan = (pruefung: Pruefung) => {
  let amountDays;
  let acutalStartDate;
  if (pruefung.start.getTime() > Date.now()) {
    amountDays = (pruefung.examDate.getTime() - pruefung.start.getTime()) / (1000 * 60 * 60 * 24) - pruefung.excludedDays.length;
    acutalStartDate = pruefung.start.getDate()
  }
  else {
    amountDays = (pruefung.examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24) - pruefung.excludedDays.length;
    acutalStartDate = Date.now()
  }
  if (pruefung.examDate.getHours() > 12)
    amountDays++
  const learningTime = pruefung.workload / amountDays

  /*for (let i = 0; i < amountDays; i++) {
    const date = new Date(acutalStartDate + i)
    if (pruefung.excludedDays.includes(date.getDay())) {
      continue
    }
    const learningDay = learningDays.find((day) => day.datum === date.toISOString().split('T')[0])
    if (learningDay) {
      learningDay.lerneinheiten.push({
        fach: pruefung.subject,
        dauer: learningTime,
      })
    } else {
      learningDays.push({
        datum: date.toISOString().split('T')[0],
        lerneinheiten: [
          {
            fach: pruefung.subject,
            dauer: learningTime,
          },
        ],
      })
    }
  }*/
};


const initialize = () => {
  store.pruefungen.forEach((pruefung: Pruefung) => {
    if (pruefung.difficulty === 'leicht') {
      pruefung.buffer = 2
    } else if (pruefung.difficulty === 'mittel') {
      pruefung.buffer = 4
    } else {
      pruefung.buffer = 6
    }

    createLearnPlan(pruefung);

  });

};

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


initialize();
</script>

<template>
  <div>
    <LearningDay v-for="(day, index) in getLearningDays()" :key="index" :datum="new Date(day.datum)"
      :lerneinheiten="day.lerneinheiten" />
  </div>
</template>
