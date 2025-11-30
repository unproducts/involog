<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { Users } from 'lucide-vue-next';
const props = defineProps<{
  modelValue?: string | string[];
  multiple?: boolean;
}>();

const selectedValue = useVModel(props, 'modelValue');

const { data: clients } = useQuery(getClientsColada());
</script>

<template>
  <ShadSelect v-model:model-value="selectedValue" :multiple="multiple">
    <ShadSelectTrigger>
      <template #icon>
        <Users class="h-4 w-4 -ml-1" />
      </template>
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
