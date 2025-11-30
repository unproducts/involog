<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { currencyDetails } from '~~/shared/consts/currencies';
import { Banknote } from 'lucide-vue-next';

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
        <Banknote class="h-4 w-4 -ml-1" />
      </template>
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
