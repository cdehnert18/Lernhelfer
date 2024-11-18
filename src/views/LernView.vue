<script setup lang="ts">
import LearningDay from '@/components/LearningDay.vue'

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
    <LearningDay
      v-for="(day, index) in learningDays"
      :key="index"
      :datum="new Date(day.datum)"
      :lerneinheiten="day.lerneinheiten"
    />
  </div>
</template>
