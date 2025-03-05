<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { countryDetails } from '~~/shared/consts/countries';

const props = defineProps<{
  modelValue?: string;
}>();

const selectedValue = useVModel(props, 'modelValue');
</script>

<template>
  <ShadSelect v-model:model-value="selectedValue">
    <ShadSelectTrigger>
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
