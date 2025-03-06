<script lang="ts" setup>
import { cn } from '@/lib/utils'
import { RangeCalendarHeadCell, type RangeCalendarHeadCellProps, useForwardProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<RangeCalendarHeadCellProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <RangeCalendarHeadCell
    :class="cn('w-8 rounded-md text-[0.8rem] font-normal text-stone-500 dark:text-stone-400', props.class)"
    v-bind="forwardedProps"
  >
    <slot />
  </RangeCalendarHeadCell>
</template>
