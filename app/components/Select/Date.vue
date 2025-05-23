<script setup lang="ts">
import { CalendarDate, DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
import { useVModel } from '@vueuse/core';
import { CalendarIcon } from 'lucide-vue-next';
import { extractDate, formatDate } from '~~/shared/utils/general';

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
});

const props = defineProps<{
  modelValue?: string;
  disabled?: boolean;
}>();

const selectedValue = useVModel(props, 'modelValue');
const value = ref<DateValue>();

if (props.modelValue) {
  const date = extractDate(props.modelValue);
  value.value = new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

watch(value, (newValue) => {
  if (newValue) {
    selectedValue.value = formatDate(newValue.toDate(getLocalTimeZone()));
  } else {
    selectedValue.value = undefined;
  }
});
</script>

<template>
  <ShadPopover>
    <ShadPopoverTrigger :value="value" :disabled="disabled">
      <template #trigger>
        <CalendarIcon class="h-4 w-4 -ml-1" />
        Select date
      </template>
      <template #value>
        <CalendarIcon class="h-4 w-4 -ml-1" />
        {{ df.format(value!.toDate(getLocalTimeZone())) }}
      </template>
    </ShadPopoverTrigger>
    <ShadPopoverContent class="w-auto p-0">
      <ShadCalendar v-model="value" initial-focus />
    </ShadPopoverContent>
  </ShadPopover>
</template>
