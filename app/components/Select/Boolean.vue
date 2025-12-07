<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    trueValue: string;
    falseValue: string;
    noValue?: string;
    placeholder?: string;
  }>(),
  {
    noValue: 'All',
    placeholder: 'Select Option',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean | undefined];
}>();

// Handle conversion between string select value and boolean filter value
const selectedString = computed({
  get: () => {
    if (props.modelValue === undefined) return undefined;
    return props.modelValue ? 'true' : 'false';
  },
  set: (value: string) => {
    if (value === 'all') {
      emit('update:modelValue', undefined);
    } else if (value === 'true') {
      emit('update:modelValue', true);
    } else if (value === 'false') {
      emit('update:modelValue', false);
    }
  },
});
</script>

<template>
  <ShadSelect v-model:model-value="selectedString">
    <ShadSelectTrigger>
      <template #icon>
        <slot name="icon" />
      </template>
      <ShadSelectValue :placeholder="placeholder" />
    </ShadSelectTrigger>
    <ShadSelectContent>
      <ShadSelectGroup>
        <ShadSelectItem value="all">{{ noValue }}</ShadSelectItem>
        <ShadSelectItem value="true">{{ trueValue }}</ShadSelectItem>
        <ShadSelectItem value="false">{{ falseValue }}</ShadSelectItem>
      </ShadSelectGroup>
    </ShadSelectContent>
  </ShadSelect>
</template>
