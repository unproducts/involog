<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <caption :class="cn('mt-4 text-sm text-stone-500 dark:text-stone-400', props.class)">
    <slot />
  </caption>
</template>
