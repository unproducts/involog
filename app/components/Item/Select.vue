<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { GanttChart } from 'lucide-vue-next';
const props = defineProps<{
  modelValue?: string;
}>();

const selectedValue = useVModel(props, 'modelValue');

const { items } = storeToRefs(useItemsStore());
</script>

<template>
  <ShadSelect v-model:model-value="selectedValue">
    <ShadSelectTrigger>
      <div class="flex items-center gap-2">
        <ShadSelectIcon>
          <GanttChart class="h-4 w-4 -ml-1" />
        </ShadSelectIcon>
        <ShadSelectValue placeholder="Select Item" />
      </div>
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
