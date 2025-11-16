<script setup lang="ts">
import { User2 } from 'lucide-vue-next';

const props = defineProps<{
  clientId: string;
  showIcon: boolean;
}>();

const { data: clients, status } = useQuery(getClientsColada());
const client = computed(() => clients.value?.find((c) => c.id === props.clientId));
</script>

<template>
  <ShadSkeleton v-if="status === 'pending'" class="w-full h-4" />
  <ShadButton v-else-if="status === 'success' && client" variant="ghost" class="-ml-4">
    <User2 v-if="props.showIcon" class="h-4 w-4" />
    {{ client.name }}
  </ShadButton>
  <div v-else-if="status === 'success' && !client">Unknown Client</div>
  <div v-else-if="status === 'error'" class="text-red-500">Error fetching client</div>
</template>
