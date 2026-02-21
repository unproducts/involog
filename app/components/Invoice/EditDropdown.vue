<script setup lang="ts">
import { NuxtLink } from '#components';
import { MoreHorizontal, Edit3 } from 'lucide-vue-next';
import type { InvoiceInfoSchema, InvoiceSchema } from '~~/shared/schemas/invoice';

defineProps<{
  info: InvoiceInfoSchema;
}>();
const dropdownOpen = ref(false);

const deleteActionOpen = ref(false);
const archiveActionOpen = ref(false);

const { mutateAsync: deleteAction, isPending: deleteActionLoading } = useDeleteInvoiceMutation();
const { mutateAsync: archiveAction, isPending: archiveActionLoading } = useUpdateInvoiceInfoMutation();
</script>

<template>
  <div class="flex space-x-1 items-center">
    <ShadButton :as="NuxtLink" :to="`/invoices/edit?id=${info.id}`" variant="ghost" class="w-8 h-8 p-0">
      <span class="sr-only">Edit invoice</span>
      <Edit3 class="w-4 h-4" />
    </ShadButton>
    <ShadDropdownMenu v-model:open="dropdownOpen">
      <ShadDropdownMenuTrigger as-child>
        <ShadButton variant="ghost" class="w-8 h-8 p-0">
          <span class="sr-only">Open menu</span>
          <MoreHorizontal class="w-4 h-4" />
        </ShadButton>
      </ShadDropdownMenuTrigger>
      <ShadDropdownMenuContent align="end">
        <ShadDropdownMenuLabel>Actions</ShadDropdownMenuLabel>
        <ShadDropdownMenuItem @select.prevent="archiveActionOpen = true">
          <AbstractConfirmationBox
            variant="default"
            confirm-action="Archive"
            v-model:open="archiveActionOpen"
            v-model:loading="archiveActionLoading"
            @cancel="archiveActionOpen = false"
            @confirm="
              archiveAction({ ...info, isArchived: !info.isArchived }).then(() => {
                archiveActionOpen = false;
                dropdownOpen = false;
              })
            "
          >
            <template #default> {{ info.isArchived ? 'Unarchive' : 'Archive' }} </template>
            <template #title> {{ info.isArchived ? 'Unarchiving' : 'Archiving' }} Invoice </template>
            <template #description>
              Are you sure you want to continue with {{ info.isArchived ? 'Unarchival' : 'Archival' }}?
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
              deleteAction({ id: info.id }).then(() => {
                deleteActionOpen = false;
                dropdownOpen = false;
              })
            "
          >
            <template #default> Delete </template>
            <template #title> Deleting Invoice </template>
            <template #description> Are you sure you want to continue with deletion? </template>
          </AbstractConfirmationBox>
        </ShadDropdownMenuItem>
      </ShadDropdownMenuContent>
    </ShadDropdownMenu>
  </div>
</template>
