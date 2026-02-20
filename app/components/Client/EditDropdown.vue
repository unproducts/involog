<script setup lang="ts">
import { MoreHorizontal, Edit3 } from 'lucide-vue-next';
import type { ClientSchema } from '~~/shared/schemas/client';

defineProps<{
  client: ClientSchema;
}>();
const deleteActionOpen = ref(false);
const archiveActionOpen = ref(false);

const { mutateAsync: deleteAction, isPending: deleteActionLoading } = useDeleteClientMutation();
const { mutateAsync: archiveAction, isPending: archiveActionLoading } = useUpdateClientMutation();
</script>

<template>
  <div class="flex space-x-1 items-center">
    <ClientEditOrCreateTrigger :client="client">
      <ShadButton variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Edit client</span>
        <Edit3 class="w-4 h-4" />
      </ShadButton>
    </ClientEditOrCreateTrigger>
    <ShadDropdownMenu>
      <ShadDropdownMenuTrigger as-child>
        <ShadButton variant="ghost" class="w-8 h-8 p-0">
          <span class="sr-only">Open menu</span>
          <MoreHorizontal class="w-4 h-4" />
        </ShadButton>
      </ShadDropdownMenuTrigger>
      <ShadDropdownMenuContent align="end">
        <ShadDropdownMenuLabel>Actions</ShadDropdownMenuLabel>
        <ShadDropdownMenuItem> View Invoices </ShadDropdownMenuItem>
        <ShadDropdownMenuItem @select.prevent="archiveActionOpen = true">
          <AbstractConfirmationBox
            variant="default"
            confirm-action="Archive"
            v-model:open="archiveActionOpen"
            v-model:loading="archiveActionLoading"
            @cancel="archiveActionOpen = false"
            @confirm="
              archiveAction({ ...client, isArchived: !client.isArchived }).then(() => {
                archiveActionOpen = false;
              })
            "
          >
            <template #default> {{ client.isArchived ? 'Unarchive' : 'Archive' }} </template>
            <template #title> {{ client.isArchived ? 'Unarchiving' : 'Archiving' }} Client </template>
            <template #description>
              Are you sure you want to continue with {{ client.isArchived ? 'Unarchival' : 'Archival' }}?
            </template>
          </AbstractConfirmationBox>
        </ShadDropdownMenuItem>
        <ShadDropdownMenuItem class="text-rose-400" @select.prevent="deleteActionOpen = true">
          <AbstractConfirmationBox
            confirm-action="Delete"
            variant="danger"
            v-model:open="deleteActionOpen"
            v-model:loading="deleteActionLoading"
            @cancel="deleteActionOpen = false"
            @confirm="
              deleteAction({ id: client.id }).then(() => {
                deleteActionOpen = false;
              })
            "
          >
            <template #default> Delete </template>
            <template #title> Deleting Client </template>
            <template #description> Are you sure you want to continue with deletion? </template>
          </AbstractConfirmationBox>
        </ShadDropdownMenuItem>
      </ShadDropdownMenuContent>
    </ShadDropdownMenu>
  </div>
</template>
