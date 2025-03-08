<script setup lang="ts">
import { cn } from '@/lib/utils';
import { CalendarDate, DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
import { useVModel } from '@vueuse/core';
import { CalendarIcon } from 'lucide-vue-next';
import { extractDate, formatCalendarDate } from '~~/shared/utils/general';

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
});

const props = defineProps<{
  modelValue?: string;
}>();

const selectedValue = useVModel(props, 'modelValue');
const value = ref<DateValue>();

if (props.modelValue) {
  const date = extractDate(props.modelValue);
  value.value = new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

watch(value, (newValue) => {
  if (newValue) {
    selectedValue.value = formatCalendarDate(newValue);
  } else {
    selectedValue.value = undefined;
  }
});
</script>

<template>
  <ShadPopover>
    <ShadPopoverTrigger as-child>
      <ShadButton
        variant="outline-subtle"
        :class="cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground !text-zinc-500')"
      >
        <CalendarIcon class="h-4 w-4 -ml-1" />
        {{ value ? df.format(value.toDate(getLocalTimeZone())) : 'Select date' }}
      </ShadButton>
    </ShadPopoverTrigger>
    <ShadPopoverContent class="w-auto p-0">
      <ShadCalendar v-model="value" initial-focus />
    </ShadPopoverContent>
  </ShadPopover>
</template>
