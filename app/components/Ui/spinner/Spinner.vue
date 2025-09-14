<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next';
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  class?: HTMLAttributes['class'];
}

const props = defineProps<SpinnerProps>();
</script>

<template>
  <LoaderCircle :class="cn('animate-spin', props.class)" />
</template>
