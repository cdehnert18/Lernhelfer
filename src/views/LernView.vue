<script setup lang="ts">
import LearningDay from '@/components/LearningDay.vue'
</script>

<template>
  <LearningDay v-for="n in 3" :key="n"></LearningDay>
</template>
