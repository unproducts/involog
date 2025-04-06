<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <span :class="cn('ml-auto text-xs tracking-widest text-stone-500 dark:text-stone-400', props.class)">
    <slot />
  </span>
</template>
