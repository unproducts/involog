<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { GanttChart } from 'lucide-vue-next';
const props = defineProps<{
  modelValue?: string | string[];
  multiple?: boolean;
}>();

const selectedValue = useVModel(props, 'modelValue');

const { data: items } = useQuery(itemsQueryOptions);
</script>

<template>
  <ShadSelect v-model:model-value="selectedValue" :multiple="multiple">
    <ShadSelectTrigger>
      <template #icon>
        <GanttChart class="h-4 w-4 -ml-1" />
      </template>
      <ShadSelectValue placeholder="Select Item" />
    </ShadSelectTrigger>
    <ShadSelectContent>
      <ShadSelectGroup>
        <ShadSelectLabel>Your Items</ShadSelectLabel>
        <ShadSelectItem v-for="item in items" :key="item.id" :value="item.id">
          {{ item.name }}
        </ShadSelectItem>
      </ShadSelectGroup>
    </ShadSelectContent>
  </ShadSelect>
</template>
