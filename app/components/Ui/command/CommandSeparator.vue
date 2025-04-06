<script setup lang="ts">
import type { SeparatorProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import { Separator } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<SeparatorProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <Separator
    v-bind="delegatedProps"
    :class="cn('-mx-1 h-px bg-stone-200 dark:bg-stone-800', props.class)"
  >
    <slot />
  </Separator>
</template>
