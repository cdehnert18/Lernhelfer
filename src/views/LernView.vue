<script setup lang="ts">
import LearningDay from '@/components/LearningDay.vue'
import { usePruefungenStore } from '@/stores/Exam'
import type { Pruefung } from '@/stores/Exam'

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



initialize();

const learningDays = [
  {
    datum: '5.12.2024',
    lerneinheiten: [
      {
        fach: 'Mathematik',
        dauer: 120,
      },
      {
        fach: 'Deutsch',
        dauer: 45,
      },
      {
        fach: 'Englisch',
        dauer: 60,
      },
    ],
  },
  {
    datum: '5.15.2024',
    lerneinheiten: [
      {
        fach: 'Geschichte',
        dauer: 75,
      },
      {
        fach: 'Literatur',
        dauer: 50,
      },
    ],
  },
]
</script>

<template>
  <div>
    <LearningDay v-for="(day, index) in learningDays" :key="index" :datum="new Date(day.datum)"
      :lerneinheiten="day.lerneinheiten" />
  </div>
</template>
