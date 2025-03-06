<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { expenseCategoryDetails } from '~~/shared/consts/transactions';

const props = defineProps<{
  modelValue?: string;
}>();

const selectedValue = useVModel(props, 'modelValue');
</script>

<template>
  <ShadSelect v-model:model-value="selectedValue">
    <ShadSelectTrigger>
      <ShadSelectValue placeholder="Select Expense Category" />
    </ShadSelectTrigger>
    <ShadSelectContent>
      <ShadSelectGroup>
        <ShadSelectLabel>Expense Categories</ShadSelectLabel>
        <ShadSelectItem
          v-for="expenseCategory in expenseCategoryDetails"
          :key="expenseCategory.code"
          :value="expenseCategory.code"
        >
          {{ expenseCategory.category }}
        </ShadSelectItem>
      </ShadSelectGroup>
    </ShadSelectContent>
  </ShadSelect>
</template>
