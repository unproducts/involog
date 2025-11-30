<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';
import { type FilterClientsSchema } from '~~/shared/schemas/client';

const searchString = defineModel<string>('searchString', { required: true });
const filter = defineModel<FilterClientsSchema>('modelValue', { required: true });

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
    <div class="w-48">
      <SelectCountry v-model="filter.country" multiple />
    </div>
    <div class="w-48">
      <SelectCurrency v-model="filter.currency" multiple />
    </div>
  </div>
</template>
