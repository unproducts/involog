<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { ArrowRightLeft } from 'lucide-vue-next';

const props = defineProps<{
  modelValue?: string | string[];
  multiple?: boolean;
}>();

const selectedValue = useVModel(props, 'modelValue');
</script>

<template>
  <ShadSelect v-model:model-value="selectedValue" :multiple="multiple">
    <ShadSelectTrigger>
      <template #icon>
        <ArrowRightLeft class="h-4 w-4 -ml-1" />
      </template>
      <ShadSelectValue placeholder="Select Type" />
    </ShadSelectTrigger>
    <ShadSelectContent>
      <ShadSelectGroup>
        <ShadSelectItem value="I">Income</ShadSelectItem>
        <ShadSelectItem value="E">Expense</ShadSelectItem>
      </ShadSelectGroup>
    </ShadSelectContent>
  </ShadSelect>
</template>
