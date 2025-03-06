<script lang="ts" setup>
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/Ui/button'
import { RangeCalendarCellTrigger, type RangeCalendarCellTriggerProps, useForwardProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<RangeCalendarCellTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <RangeCalendarCellTrigger
    :class="cn(
      buttonVariants({ variant: 'ghost' }),
      'h-8 w-8 p-0 font-normal data-[selected]:opacity-100',
      '[&[data-today]:not([data-selected])]:bg-stone-100 [&[data-today]:not([data-selected])]:text-stone-900 dark:[&[data-today]:not([data-selected])]:bg-stone-800 dark:[&[data-today]:not([data-selected])]:text-stone-50',
      // Selection Start
      'data-[selection-start]:bg-stone-900 data-[selection-start]:text-stone-50 data-[selection-start]:hover:bg-stone-900 data-[selection-start]:hover:text-stone-50 data-[selection-start]:focus:bg-stone-900 data-[selection-start]:focus:text-stone-50 dark:data-[selection-start]:bg-stone-50 dark:data-[selection-start]:text-stone-900 dark:data-[selection-start]:hover:bg-stone-50 dark:data-[selection-start]:hover:text-stone-900 dark:data-[selection-start]:focus:bg-stone-50 dark:data-[selection-start]:focus:text-stone-900',
      // Selection End
      'data-[selection-end]:bg-stone-900 data-[selection-end]:text-stone-50 data-[selection-end]:hover:bg-stone-900 data-[selection-end]:hover:text-stone-50 data-[selection-end]:focus:bg-stone-900 data-[selection-end]:focus:text-stone-50 dark:data-[selection-end]:bg-stone-50 dark:data-[selection-end]:text-stone-900 dark:data-[selection-end]:hover:bg-stone-50 dark:data-[selection-end]:hover:text-stone-900 dark:data-[selection-end]:focus:bg-stone-50 dark:data-[selection-end]:focus:text-stone-900',
      // Outside months
      'data-[outside-view]:text-stone-500 data-[outside-view]:opacity-50 [&[data-outside-view][data-selected]]:text-stone-500 [&[data-outside-view][data-selected]]:opacity-30 dark:data-[outside-view]:text-stone-400 dark:[&[data-outside-view][data-selected]]:text-stone-400',
      // Disabled
      'data-[disabled]:text-stone-500 data-[disabled]:opacity-50 dark:data-[disabled]:text-stone-400',
      // Unavailable
      'data-[unavailable]:text-stone-50 data-[unavailable]:line-through dark:data-[unavailable]:text-stone-50',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot />
  </RangeCalendarCellTrigger>
</template>
