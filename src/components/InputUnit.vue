<script setup lang="ts">
import { defineProps } from 'vue';
import { ref } from 'vue';

defineProps<{
    label: string;
    inputType: string;
    placeholder: string;
}>();

const inputValue = ref('');
</script>

<template>
    <div class="form-group mb-3">
        <label for="inputField" class="form-label">{{ label }}</label>
        <input id="inputField" v-model="inputValue" :type="inputType" :placeholder="placeholder" />
    </div>
</template>