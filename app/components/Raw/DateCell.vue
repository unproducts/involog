<script setup lang="ts">
import { formatDateFromStr } from '~~/shared/utils/general';

const props = defineProps<{
  value?: string;
}>();
</script>

<template>
  <div v-if="props.value">{{ formatDateFromStr(props.value) }}</div>
</template>
