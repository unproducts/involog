<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { type NumberRangeSchema } from '~~/shared/schemas/_base';
import { Hash } from 'lucide-vue-next';

const props = defineProps<{
  modelValue?: NumberRangeSchema;
  disabled?: boolean;
}>();

const open = ref(false);
const selectedValue = useVModel(props, 'modelValue');
const value = ref<NumberRangeSchema>({ min: selectedValue.value?.min, max: selectedValue.value?.max });

const formattedValue = computed(() => `${selectedValue.value?.min ?? ''} - ${selectedValue.value?.max ?? ''}`);
const hasValue = computed(() => !!selectedValue.value?.min || !!selectedValue.value?.max);

const apply = () => {
  selectedValue.value = { min: value.value?.min, max: value.value?.max };
  open.value = false;
};

const reset = () => {
  value.value = { min: selectedValue.value?.min, max: selectedValue.value?.max };
  open.value = false;
};
</script>

<template>
  <ShadPopover v-model:open="open">
    <ShadPopoverTrigger :value="hasValue" :disabled="disabled">
      <template #icon>
        <Hash class="h-4 w-4 -ml-1" />
      </template>
      <template #value>
        <span v-if="formattedValue">{{ formattedValue }}</span>
      </template>
      <template #trigger> Select number range </template>
    </ShadPopoverTrigger>
    <ShadPopoverContent class="w-auto p-0">
      <div class="flex flex-col gap-2 p-2">
        <ShadLabel>Min</ShadLabel>
        <ShadInput type="number" size="sm" v-model="value.min" />
        <ShadLabel>Max</ShadLabel>
        <ShadInput type="number" size="sm" v-model="value.max" />
        <div class="flex gap-2 justify-between">
          <ShadButton size="xs" variant="secondary" @click="reset"> Reset </ShadButton>
          <ShadButton size="xs" variant="default" @click="apply"> Apply </ShadButton>
        </div>
      </div>
    </ShadPopoverContent>
  </ShadPopover>
</template>
