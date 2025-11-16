<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { transactionCategoryDetails } from '~~/shared/consts/transactions';

const props = defineProps<{
  modelValue?: string;
}>();

const selectedValue = useVModel(props, 'modelValue');
</script>

<template>
  <ShadSelect v-model:model-value="selectedValue">
    <ShadSelectTrigger>
      <ShadSelectValue placeholder="Select Transaction Category" />
    </ShadSelectTrigger>
    <ShadSelectContent>
      <ShadSelectGroup>
        <ShadSelectLabel>Transaction Categories</ShadSelectLabel>
        <ShadSelectItem
          v-for="transactionCategoryDetail in transactionCategoryDetails"
          :key="transactionCategoryDetail.code"
          :value="transactionCategoryDetail.code"
        >
          {{ transactionCategoryDetail.category }}
        </ShadSelectItem>
      </ShadSelectGroup>
    </ShadSelectContent>
  </ShadSelect>
</template>
