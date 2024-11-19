<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  label: string
  inputType: string
  placeholder: string
}>()

const inputValue = ref('')
</script>

<template>
  <div class="d-flex flex-column" style="width: 80%">
    <label for="inputField" class="form-label">{{ label }}</label>
    <input
      id="inputField"
      class="form-control"
      v-model="inputValue"
      :type="inputType"
      :placeholder="placeholder"
    />
  </div>
</template>
