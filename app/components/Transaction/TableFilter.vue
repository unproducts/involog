<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';
import { type FilterTransactionsSchema } from '~~/shared/schemas/transaction';

const searchString = defineModel<string>('searchString', { required: true });
const filter = defineModel<FilterTransactionsSchema>('modelValue', { required: true });

watchDebounced(
  searchString,
  (value) => {
    filter.value.search = value;
  },
  { debounce: 500 }
);
</script>
<template>
  <div class="flex w-full flex-wrap gap-2 items-center justify-start pb-2">
    <div class="w-72">
      <SelectDateRange v-model="filter.date" />
    </div>
    <div class="w-48">
      <TransactionSelectCategory v-model="filter.category" multiple />
    </div>
    <div class="w-48">
      <TransactionSelectType v-model="filter.type" multiple />
    </div>
    <div class="w-48">
      <SelectCurrency v-model="filter.currency" multiple />
    </div>
    <div class="w-48">
      <SelectNumRange v-model="filter.amount" />
    </div>
    <div class="w-48">
      <ClientSelect v-model="filter.clientId" multiple />
    </div>
  </div>
</template>
