<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { currencyDetails } from '~~/shared/consts/currencies';
import { Banknote } from 'lucide-vue-next';

const props = defineProps<{
  modelValue?: string;
}>();

const selectedValue = useVModel(props, 'modelValue');
</script>

<template>
  <ShadSelect v-model:model-value="selectedValue">
    <ShadSelectTrigger>
      <div class="flex items-center gap-2">
        <ShadSelectIcon>
          <Banknote class="h-4 w-4 -ml-1" />
        </ShadSelectIcon>
        <ShadSelectValue placeholder="Select Currency" />
      </div>
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
