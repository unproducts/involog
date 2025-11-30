<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { Flag } from 'lucide-vue-next';
import { countryDetails } from '~~/shared/consts/countries';

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
        <Flag class="h-4 w-4 -ml-1" />
      </template>
      <ShadSelectValue placeholder="Select Country" />
    </ShadSelectTrigger>
    <ShadSelectContent>
      <ShadSelectGroup>
        <ShadSelectLabel>Currencies</ShadSelectLabel>
        <ShadSelectItem v-for="country in countryDetails" :key="country.code" :value="country.code">
          {{ country.country }}
        </ShadSelectItem>
      </ShadSelectGroup>
    </ShadSelectContent>
  </ShadSelect>
</template>
