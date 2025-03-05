<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { currencyDetails } from '~~/shared/consts/currencies';

const props = defineProps<{
  modelValue?: string;
}>();

const selectedValue = useVModel(props, 'modelValue');
</script>

<template>
  <ShadSelect v-model:model-value="selectedValue">
    <ShadSelectTrigger>
      <ShadSelectValue placeholder="Select Currency" />
    </ShadSelectTrigger>
    <ShadSelectContent>
      <ShadSelectGroup>
        <ShadSelectLabel>Currencies</ShadSelectLabel>
        <ShadSelectItem v-for="currency in currencyDetails" :key="currency.code" :value="currency.code">
          {{ currency.code }} - {{ currency.name }}
        </ShadSelectItem>
      </ShadSelectGroup>
    </ShadSelectContent>
  </ShadSelect>
</template>
