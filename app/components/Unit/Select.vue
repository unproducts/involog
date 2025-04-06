<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { Ruler } from 'lucide-vue-next';

const props = defineProps<{
  modelValue?: string;
}>();

const selectedValue = useVModel(props, 'modelValue');

const { units } = storeToRefs(useUnitsStore());
</script>

<template>
  <ShadSelect v-model:model-value="selectedValue">
    <ShadSelectTrigger>
      <div class="flex items-center gap-2">
        <ShadSelectIcon>
          <Ruler class="h-4 w-4 -ml-1" />
        </ShadSelectIcon>
        <ShadSelectValue placeholder="Select Unit" />
      </div>
    </ShadSelectTrigger>
    <ShadSelectContent>
      <ShadSelectGroup>
        <ShadSelectLabel>Units</ShadSelectLabel>
        <ShadSelectItem v-for="unit in units" :key="unit.id" :value="unit.id">
          {{ unit.name }} - {{ unit.symbolSingular }}
        </ShadSelectItem>
      </ShadSelectGroup>
    </ShadSelectContent>
  </ShadSelect>
</template>
