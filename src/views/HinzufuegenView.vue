<script setup lang="ts">
    import InputUnit from '@/components/InputUnit.vue'
    const options = [{text: 'leicht'}, {text: 'mittel'}, {text: 'schwer'}]
</script>

<template>
  <InputUnit label="Name" inputType="text"/>
  <InputUnit label="Datum" inputType="date"/>
  <InputUnit label="Arbeitsaufwand" inputType ="number"/>
  <InputUnit label="Lernbeginn" inputType="date"/>
  <select id="selectDifficulty">
    <option v-for="(option, index) in options" :key="index">
      {{ option.text }}
    </option>
  </select>
  <button class="btn">Abbrechen</button>
  <button class="btn btn-primary">Speichern</button>
</template>
