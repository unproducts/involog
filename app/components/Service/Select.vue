<script setup lang="ts">
import { useVModel } from '@vueuse/core';
const props = defineProps<{
  modelValue?: string;
}>();

const selectedValue = useVModel(props, 'modelValue');

const { services } = useServices();
</script>

<template>
  <ShadSelect v-model:model-value="selectedValue">
    <ShadSelectTrigger>
      <ShadSelectValue placeholder="Select Service" />
    </ShadSelectTrigger>
    <ShadSelectContent>
      <ShadSelectGroup>
        <ShadSelectLabel>Your Services</ShadSelectLabel>
        <ShadSelectItem v-for="service in services" :key="service.id" :value="service.id">
          {{ service.name }}
        </ShadSelectItem>
      </ShadSelectGroup>
    </ShadSelectContent>
  </ShadSelect>
</template>
