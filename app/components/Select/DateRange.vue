<script setup lang="ts">
import { CalendarDate, DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
import type { DateRange } from 'reka-ui';
import { useVModel } from '@vueuse/core';
import { CalendarIcon } from 'lucide-vue-next';
import { extractDate, formatDate } from '~~/shared/utils/general';
import type { DateRangeSchema } from '~~/shared/schemas/_base';

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
});

const props = defineProps<{
  modelValue?: DateRangeSchema;
  disabled?: boolean;
}>();

const open = ref(false);

const selectedValue = useVModel(props, 'modelValue');
const value = ref<DateRange>();

if (props.modelValue?.from) {
  const startDate = extractDate(props.modelValue.from);
  const start = new CalendarDate(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());

  let end: DateValue | undefined;
  if (props.modelValue.to) {
    const endDate = extractDate(props.modelValue.to);
    end = new CalendarDate(endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate());
  }

  value.value = { start, end };
}

watch(
  value,
  (newValue) => {
    if (newValue?.start && newValue.end) {
      selectedValue.value = {
        from: formatDate(newValue.start.toDate(getLocalTimeZone())),
        to: formatDate(newValue.end.toDate(getLocalTimeZone())),
      };
    } else {
      selectedValue.value = undefined;
    }
    open.value = !open.value;
  },
  { deep: true }
);

const formattedDateRange = computed(() => {
  if (!value.value?.start) {
    return null;
  }

  const startDate = value.value.start.toDate(getLocalTimeZone());
  const endDate = value.value.end?.toDate(getLocalTimeZone());

  if (!endDate) {
    return df.format(startDate);
  }

  return `${df.format(startDate)} - ${df.format(endDate)}`;
});

const hasValue = computed(() => !!value.value?.start);
</script>

<template>
  <ShadPopover v-model:open="open">
    <ShadPopoverTrigger :value="hasValue" :disabled="disabled">
      <template #icon>
        <CalendarIcon class="h-4 w-4 -ml-1" />
      </template>
      <template #value>
        <span v-if="formattedDateRange">{{ formattedDateRange }}</span>
      </template>
      <template #trigger> Select date range </template>
    </ShadPopoverTrigger>
    <ShadPopoverContent class="w-auto p-0">
      <ShadRangeCalendar v-model="value" initial-focus :number-of-months="2" />
    </ShadPopoverContent>
  </ShadPopover>
</template>
