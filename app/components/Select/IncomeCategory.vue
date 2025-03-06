<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { incomeCategoryDetails } from '~~/shared/consts/transactions';

const props = defineProps<{
  modelValue?: string;
}>();

const selectedValue = useVModel(props, 'modelValue');
</script>

<template>
  <ShadSelect v-model:model-value="selectedValue">
    <ShadSelectTrigger>
      <ShadSelectValue placeholder="Select Income Category" />
    </ShadSelectTrigger>
    <ShadSelectContent>
      <ShadSelectGroup>
        <ShadSelectLabel>Income Categories</ShadSelectLabel>
        <ShadSelectItem
          v-for="incomeCategory in incomeCategoryDetails"
          :key="incomeCategory.code"
          :value="incomeCategory.code"
        >
          {{ incomeCategory.category }}
        </ShadSelectItem>
      </ShadSelectGroup>
    </ShadSelectContent>
  </ShadSelect>
</template>
