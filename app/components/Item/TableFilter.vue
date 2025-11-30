<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';
import { type FilterItemsSchema } from '~~/shared/schemas/item';
import { Package } from 'lucide-vue-next';

const searchString = defineModel<string>('searchString', { required: true });
const filter = defineModel<FilterItemsSchema>('modelValue', { required: true });

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
    <div class="w-64">
      <SelectNumRange v-model="filter.price" placeholder="Price" />
    </div>
    <div class="w-48">
      <SelectCurrency v-model="filter.currency" multiple />
    </div>
    <div class="w-48">
      <UnitSelect v-model="filter.unitId" multiple />
    </div>
    <div class="w-48">
      <SelectBoolean
        v-model="filter.isService"
        true-value="Service"
        false-value="Product"
        placeholder="Product/Service"
      >
        <template #icon>
          <Package class="h-4 w-4 -ml-1" />
        </template>
      </SelectBoolean>
    </div>
  </div>
</template>
