<script setup lang="ts">
import { defineProps } from 'vue';
import { ref } from 'vue';

defineProps<{
    label: string;
    inputType: string;
}>();

const inputValue = ref('');
</script>

<template>
    <label for="inputField">{{ label }}</label>
    <input id="inputField" v-model="inputValue" :type="inputType" />
</template>