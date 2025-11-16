<script setup lang="ts">
const props = defineProps<{
  prefixId: string;
}>();

const { data, status } = useQuery(getInvoicePrefixesColada({}));
const prefix = computed(() => data.value?.find((p) => p.id === props.prefixId));
</script>

<template>
  <ShadSkeleton v-if="status === 'pending'" class="w-24 h-4" />
  <div v-else-if="status === 'success' && prefix">{{ prefix.name }}</div>
  <div v-else-if="status === 'success' && !prefix" class="italic text-muted-foreground">Unknown</div>
  <div v-else-if="status === 'error'" class="text-red-500">Error</div>
</template>
