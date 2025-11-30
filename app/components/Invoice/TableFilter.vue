<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';
import { type FilterInvoicesSchema } from '~~/shared/schemas/invoice';

const searchString = defineModel<string>('searchString', { required: true });
const filter = defineModel<FilterInvoicesSchema>('modelValue', { required: true });

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
      <SelectDateRange v-model="filter.date" placeholder="Invoice Date" />
    </div>
    <div class="w-72">
      <SelectDateRange v-model="filter.dueDate" placeholder="Due Date" />
    </div>
    <div class="w-48">
      <SelectCurrency v-model="filter.currency" multiple />
    </div>
    <div class="w-64">
      <SelectNumRange v-model="filter.amount" />
    </div>
    <div class="w-48">
      <ClientSelect v-model="filter.clientId" multiple />
    </div>
    <div class="w-48">
      <ItemSelect v-model="filter.items" multiple />
    </div>
  </div>
</template>
