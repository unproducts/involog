<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class'];
    isActive?: boolean;
  }>(),
  {
    isActive: false,
  }
);
</script>

<template>
  <li
    data-sidebar="menu-item"
    :class="[cn('group/menu-item relative', props.class), { 'bg-stone-200 text-stone-950 rounded': isActive }]"
  >
    <slot />
  </li>
</template>
