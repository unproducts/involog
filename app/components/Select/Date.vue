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

const open = ref(false);
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
  open.value = !open.value;
});
</script>

<template>
  <ShadPopover v-model:open="open">
    <ShadPopoverTrigger :value="value" :disabled="disabled">
      <template #icon>
        <CalendarIcon class="h-4 w-4 -ml-1" />
      </template>
      <template #trigger> Select date </template>
      <template #value>{{ df.format(value!.toDate(getLocalTimeZone())) }}</template>
    </ShadPopoverTrigger>
    <ShadPopoverContent class="w-auto p-0">
      <ShadCalendar v-model="value" initial-focus />
    </ShadPopoverContent>
  </ShadPopover>
</template>
