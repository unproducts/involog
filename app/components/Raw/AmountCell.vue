<script setup lang="ts">
import { formatCurrency } from '~~/lib/formatting';
const props = defineProps<{
  amount: number | undefined;
  currency: string;
  type: 'positive' | 'negative';
}>();
</script>

<template>
  <div v-if="props.amount" :class="[props.type === 'negative' && 'text-rose-600']">
    {{ formatCurrency(props.currency, props.amount) }}
  </div>
  <div class="italic" v-else>Unknown Amount</div>
</template>
