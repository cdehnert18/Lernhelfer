<script setup lang="ts">
import { defineComponent } from 'vue'

defineComponent({
  name: 'PlayeholderComponent',
})
</script>

<template>
  <div class="d-flex flex-grow-1 justify-content-center align-items-center">
    <p class="text-secondary-emphasis"><slot></slot></p>
  </div>
</template>
