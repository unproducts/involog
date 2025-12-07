<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { Ruler } from 'lucide-vue-next';

const props = defineProps<{
  modelValue?: string | string[];
  multiple?: boolean;
}>();

const selectedValue = useVModel(props, 'modelValue');

const { data: units } = useQuery(unitsQueryOptions());
</script>

<template>
  <ShadSelect v-model="selectedValue" :multiple="multiple">
    <ShadSelectTrigger>
      <template #icon>
        <Ruler class="h-4 w-4 -ml-1" />
      </template>
      <ShadSelectValue placeholder="Select Unit" />
    </ShadSelectTrigger>
    <ShadSelectContent>
      <ShadSelectGroup>
        <ShadSelectLabel>Units</ShadSelectLabel>
        <ShadSelectItem v-for="unit in units" :key="unit.id" :value="unit.id">
          {{ unit.name }} - {{ unit.symbolSingular }}
        </ShadSelectItem>
      </ShadSelectGroup>
    </ShadSelectContent>
  </ShadSelect>
</template>
