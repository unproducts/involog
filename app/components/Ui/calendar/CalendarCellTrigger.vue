<script lang="ts" setup>
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/Ui/button'
import { CalendarCellTrigger, type CalendarCellTriggerProps, useForwardProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<CalendarCellTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <CalendarCellTrigger
    :class="cn(
      buttonVariants({ variant: 'ghost' }),
      'h-8 w-8 p-0 font-normal',
      '[&[data-today]:not([data-selected])]:bg-stone-100 [&[data-today]:not([data-selected])]:text-stone-900 dark:[&[data-today]:not([data-selected])]:bg-stone-800 dark:[&[data-today]:not([data-selected])]:text-stone-50',
      // Selected
      'data-[selected]:bg-stone-900 data-[selected]:text-stone-50 data-[selected]:opacity-100 data-[selected]:hover:bg-stone-900 data-[selected]:hover:text-stone-50 data-[selected]:focus:bg-stone-900 data-[selected]:focus:text-stone-50 dark:data-[selected]:bg-stone-50 dark:data-[selected]:text-stone-900 dark:data-[selected]:hover:bg-stone-50 dark:data-[selected]:hover:text-stone-900 dark:data-[selected]:focus:bg-stone-50 dark:data-[selected]:focus:text-stone-900',
      // Disabled
      'data-[disabled]:text-stone-500 data-[disabled]:opacity-50 dark:data-[disabled]:text-stone-400',
      // Unavailable
      'data-[unavailable]:text-stone-50 data-[unavailable]:line-through dark:data-[unavailable]:text-stone-50',
      // Outside months
      'data-[outside-view]:text-stone-500 data-[outside-view]:opacity-50 [&[data-outside-view][data-selected]]:bg-stone-100/50 [&[data-outside-view][data-selected]]:text-stone-500 [&[data-outside-view][data-selected]]:opacity-30 dark:data-[outside-view]:text-stone-400 dark:[&[data-outside-view][data-selected]]:bg-stone-800/50 dark:[&[data-outside-view][data-selected]]:text-stone-400',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot />
  </CalendarCellTrigger>
</template>
