<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <tr :class="cn('border-b transition-colors hover:bg-stone-100/50 data-[state=selected]:bg-stone-100 dark:hover:bg-stone-800/50 dark:data-[state=selected]:bg-stone-800', props.class)">
    <slot />
  </tr>
</template>
