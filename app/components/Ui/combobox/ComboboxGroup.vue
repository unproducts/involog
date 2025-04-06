<script setup lang="ts">
import type { ComboboxGroupProps } from 'reka-ui';
import { cn } from '@/lib/utils';
import { ComboboxGroup, ComboboxLabel } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';

const props = defineProps<
  ComboboxGroupProps & {
    class?: HTMLAttributes['class'];
    heading?: string;
  }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <ComboboxGroup
    v-bind="delegatedProps"
    :class="
      cn(
        'overflow-hidden p-1 text-stone-950 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-stone-500 dark:text-stone-50 dark:[&_[cmdk-group-heading]]:text-stone-400',
        props.class
      )
    "
  >
    <ComboboxLabel v-if="heading" class="px-2 py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
      {{ heading }}
    </ComboboxLabel>
    <slot />
  </ComboboxGroup>
</template>
