<script setup lang="ts">
import { MoreHorizontal, Edit3 } from 'lucide-vue-next';
import type { TransactionSchema } from '~~/shared/schemas/transaction';

defineProps<{
  transaction: TransactionSchema;
}>();

const dropdownOpen = ref(false);

const deleteActionOpen = ref(false);
const archiveActionOpen = ref(false);

const { mutateAsync: deleteAction, isPending: deleteActionLoading } = useDeleteTransactionMutation();
const { mutateAsync: archiveAction, isPending: archiveActionLoading } = useUpdateTransactionMutation();
</script>

<template>
  <div class="flex space-x-1 items-center">
    <TransactionEditOrCreateTrigger :transaction="transaction">
      <ShadButton variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Edit transaction</span>
        <Edit3 class="w-4 h-4" />
      </ShadButton>
    </TransactionEditOrCreateTrigger>
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
              archiveAction({ ...transaction, isArchived: !transaction.isArchived }).then(() => {
                archiveActionOpen = false;
                dropdownOpen = false;
              })
            "
          >
            <template #default> {{ transaction.isArchived ? 'Unarchive' : 'Archive' }} </template>
            <template #title> {{ transaction.isArchived ? 'Unarchiving' : 'Archiving' }} Transaction </template>
            <template #description>
              Are you sure you want to continue with {{ transaction.isArchived ? 'Unarchival' : 'Archival' }}?
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
              deleteAction({ id: transaction.id }).then(() => {
                deleteActionOpen = false;
                dropdownOpen = false;
              })
            "
          >
            <template #default> Delete </template>
            <template #title> Deleting Transaction </template>
            <template #description> Are you sure you want to continue with deletion? </template>
          </AbstractConfirmationBox>
        </ShadDropdownMenuItem>
      </ShadDropdownMenuContent>
    </ShadDropdownMenu>
  </div>
</template>
~~/shared/schemas/transaction
