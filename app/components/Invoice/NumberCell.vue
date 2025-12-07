<script setup lang="ts">
const props = defineProps<{
  prefixId: string;
  number: string;
}>();

const { data, status } = useQuery(invoicePrefixesQueryOptions({}));
const prefix = computed(() => data.value?.find((p) => p.id === props.prefixId));
</script>

<template>
  <ShadSkeleton v-if="status === 'pending'" class="w-28 h-4" />
  <div v-else-if="status === 'success' && prefix">{{ prefix.name }}-{{ number }}</div>
  <div v-else-if="status === 'success' && !prefix">{{ number }}</div>
  <div v-else-if="status === 'error'" class="text-red-500">Error</div>
</template>
