<script setup lang="ts">
import type { ClientSchema } from '~~/shared/schemas/client';
import type EditOrCreate from './EditOrCreate.vue';

defineProps<{
  client?: ClientSchema;
}>();

const editForm = ref<InstanceType<typeof EditOrCreate>>();
const status = ref<DataStateStatus>('pending');
const loading = ref(false);
const modalOpen = ref(false);

watch(status, (newStatus) => {
  if (newStatus === 'success') {
    modalOpen.value = false;
  }
});
</script>

<template>
  <ShadDialog v-model:open="modalOpen">
    <ShadDialogTrigger class="ml-auto" as-child>
      <slot />
    </ShadDialogTrigger>
    <ShadDialogContent>
      <ShadDialogHeader>
        <ShadDialogTitle>{{ client ? 'Update' : 'Register' }} Client</ShadDialogTitle>
        <ShadDialogDescription sr-only>
          {{ client ? 'Update' : 'Register' }} {{ client?.name || 'New Client' }}
        </ShadDialogDescription>
      </ShadDialogHeader>
      <ClientEditOrCreate :client ref="editForm" v-model:status="status" v-model:loading="loading" />
      <ShadDialogFooter>
        <ShadButton variant="secondary" :disabled="loading" @click.prevent="modalOpen = false">Cancel</ShadButton>
        <ShadButton @click.prevent="editForm?.submit()" :loading="loading">Save</ShadButton>
      </ShadDialogFooter>
    </ShadDialogContent>
  </ShadDialog>
</template>
