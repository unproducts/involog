<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import { Primitive, type PrimitiveProps } from 'reka-ui';
import { type ButtonVariants, buttonVariants } from '.';

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  class?: HTMLAttributes['class'];
  type?: string;
  loading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  loading: false,
  disabled: false,
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
    :type="type || 'button'"
    :disabled="loading || disabled"
  >
    <ShadSpinner v-if="loading" class="w-full h-full" />
    <slot />
  </Primitive>
</template>
