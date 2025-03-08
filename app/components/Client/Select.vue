<script setup lang="ts">
import { useVModel } from '@vueuse/core';
const props = defineProps<{
  modelValue?: string;
}>();

const selectedValue = useVModel(props, 'modelValue');

const { clients } = useClients();
</script>

<template>
  <ShadSelect v-model:model-value="selectedValue">
    <ShadSelectTrigger>
      <ShadSelectValue placeholder="Select Client" />
    </ShadSelectTrigger>
    <ShadSelectContent>
      <ShadSelectGroup>
        <ShadSelectLabel>Your Clients</ShadSelectLabel>
        <ShadSelectItem v-for="client in clients" :key="client.id" :value="client.id">
          {{ client.name }}
        </ShadSelectItem>
      </ShadSelectGroup>
    </ShadSelectContent>
  </ShadSelect>
</template>
