<script setup lang="ts">
import { MoreHorizontal, Edit3 } from 'lucide-vue-next';
import type { ItemSchema } from '~~/shared/schemas/item';

const props = defineProps<{
  item: ItemSchema;
}>();
const dropdownOpen = ref(false);

const deleteActionOpen = ref(false);
const archiveActionOpen = ref(false);

const { mutateAsync: deleteAction, isPending: deleteActionLoading } = useDeleteItemMutation();
const { mutateAsync: archiveAction, isPending: archiveActionLoading } = useUpdateItemMutation();
</script>

<template>
  <div class="flex space-x-1 items-center">
    <ItemEditOrCreateTrigger :item="item">
      <ShadButton variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Edit item</span>
        <Edit3 class="w-4 h-4" />
      </ShadButton>
    </ItemEditOrCreateTrigger>
    <ShadDropdownMenu v-model:open="dropdownOpen">
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
              archiveAction({ ...item, isArchived: !item.isArchived }).then(() => {
                archiveActionOpen = false;
                dropdownOpen = false;
              })
            "
          >
            <template #default> {{ item.isArchived ? 'Unarchive' : 'Archive' }} </template>
            <template #title> {{ item.isArchived ? 'Unarchiving' : 'Archiving' }} Item </template>
            <template #description>
              Are you sure you want to continue with {{ item.isArchived ? 'Unarchival' : 'Archival' }}?
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
              deleteAction({ id: item.id }).then(() => {
                deleteActionOpen = false;
                dropdownOpen = false;
              })
            "
          >
            <template #default> Delete </template>
            <template #title> Deleting Item </template>
            <template #description> Are you sure you want to continue with deletion? </template>
          </AbstractConfirmationBox>
        </ShadDropdownMenuItem>
      </ShadDropdownMenuContent>
    </ShadDropdownMenu>
  </div>
</template>
