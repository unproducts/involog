<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import type { ClientSchema } from '~~/shared/schemas/client';

const props = defineProps<{
  clients: ClientSchema[];
}>();
defineEmits<{
  done: [];
}>();

const dropdownOpen = ref(false);

const deleteActionOpen = ref(false);
const archiveActionOpen = ref(false);
const unarchiveActionOpen = ref(false);

const ids = computed(() => props.clients.map((c) => c.id));

const { mutateAsync: updateBulkAction, isPending: updateBulkActionLoading } = useUpdateClientBulkMutation();
</script>

<template>
  <ShadDropdownMenu v-model:open="dropdownOpen">
    <ShadDropdownMenuTrigger as-child>
      <ShadButton variant="secondary" class="ml-auto">Actions <ChevronDown /> </ShadButton>
    </ShadDropdownMenuTrigger>
    <ShadDropdownMenuContent align="end">
      <ShadDropdownMenuLabel>Actions</ShadDropdownMenuLabel>
      <ShadDropdownMenuItem> View Invoices </ShadDropdownMenuItem>
      <ShadDropdownMenuItem @select.prevent="archiveActionOpen = true">
        <AbstractConfirmationBox
          variant="default"
          confirm-action="Archive"
          v-model:open="archiveActionOpen"
          v-model:loading="updateBulkActionLoading"
          @cancel="archiveActionOpen = false"
          @confirm="
            updateBulkAction({ ids, action: 'archive' }).then(() => {
              archiveActionOpen = false;
              dropdownOpen = false;
              $emit('done');
            })
          "
        >
          <template #default> Archive All </template>
          <template #title> Archiving {{ clients.length }} clients </template>
          <template #description>
            Are you sure you want to continue with archival of {{ clients.length }} clients?
          </template>
        </AbstractConfirmationBox>
      </ShadDropdownMenuItem>
      <ShadDropdownMenuItem @select.prevent="unarchiveActionOpen = true">
        <AbstractConfirmationBox
          variant="default"
          confirm-action="Unarchive"
          v-model:open="unarchiveActionOpen"
          v-model:loading="updateBulkActionLoading"
          @cancel="unarchiveActionOpen = false"
          @confirm="
            updateBulkAction({ ids, action: 'unarchive' }).then(() => {
              unarchiveActionOpen = false;
              dropdownOpen = false;
              $emit('done');
            })
          "
        >
          <template #default> Unarchive All </template>
          <template #title> Unarchiving {{ clients.length }} clients </template>
          <template #description>
            Are you sure you want to continue with unarchival of {{ clients.length }} clients?
          </template>
        </AbstractConfirmationBox>
      </ShadDropdownMenuItem>
      <ShadDropdownMenuItem @select.prevent="deleteActionOpen = true">
        <AbstractConfirmationBox
          variant="danger"
          confirm-action="Delete"
          v-model:open="deleteActionOpen"
          v-model:loading="updateBulkActionLoading"
          @cancel="deleteActionOpen = false"
          @confirm="
            updateBulkAction({ ids, action: 'delete' }).then(() => {
              deleteActionOpen = false;
              dropdownOpen = false;
              $emit('done');
            })
          "
        >
          <template #default> Delete All </template>
          <template #title> Deleting {{ clients.length }} clients </template>
          <template #description>
            Are you sure you want to continue with deletion of {{ clients.length }} clients?
          </template>
        </AbstractConfirmationBox>
      </ShadDropdownMenuItem>
    </ShadDropdownMenuContent>
  </ShadDropdownMenu>
</template>
