<script setup lang="ts">
/**
 * This is modification of the PopoverTrigger component from reka-ui.
 * It adds a class to the trigger when the value is not set.
 * This is done to maintain consistency with the SelectTrigger component.
 */
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-vue-next';
import { SelectIcon, PopoverTrigger, type PopoverTriggerProps, useForwardProps } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';

const props = defineProps<PopoverTriggerProps & { class?: HTMLAttributes['class']; value?: any; disabled?: boolean }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <PopoverTrigger
    v-bind="forwardedProps"
    :class="[
      cn(
        'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white focus:outline-none focus:ring-1 focus:ring-stone-950 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate text-start',
        props.class,
        { 'text-zinc-500': !value },
        { 'cursor-not-allowed': disabled }
      ),
    ]"
  >
    <div class="flex items-center gap-2">
      <slot name="icon" />
      <slot name="value" v-if="value" />
      <slot name="trigger" v-else />
    </div>
    <SelectIcon as-child>
      <ChevronDown class="w-4 h-4 opacity-50 shrink-0" />
    </SelectIcon>
  </PopoverTrigger>
</template>
