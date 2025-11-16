<script setup lang="ts">
import type { ClientSchema } from '~~/shared/schemas/client';

defineProps<{
  client?: ClientSchema;
}>();
const modalOpen = ref(false);
const loading = ref(false);

const editOrCreateRef = useTemplateRef('editOrCreateRef');
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
      <ClientEditOrCreate
        :client
        ref="editOrCreateRef"
        @update:loading="loading = $event"
        @submitted="modalOpen = false"
      />
      <ShadDialogFooter>
        <ShadButton :disabled="loading" variant="secondary" @click.prevent="modalOpen = false">Cancel</ShadButton>
        <ShadButton :disabled="loading" :loading="loading" @click.prevent="editOrCreateRef?.submit()">Save</ShadButton>
      </ShadDialogFooter>
    </ShadDialogContent>
  </ShadDialog>
</template>
