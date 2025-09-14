<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import type { ItemSchema } from '~~/shared/schemas/item';

const props = defineProps<{
  items: ItemSchema[];
}>();

const deleteItems = () => {
  props.items.forEach((item) => {
    const { mutate } = useDeleteItemMutation({ id: item.id });
    mutate();
  });
};
</script>

<template>
  <ShadDropdownMenu>
    <ShadDropdownMenuTrigger as-child>
      <ShadButton variant="secondary" class="ml-auto">Actions <ChevronDown /> </ShadButton>
    </ShadDropdownMenuTrigger>
    <ShadDropdownMenuContent align="end">
      <ShadDropdownMenuLabel>Actions</ShadDropdownMenuLabel>
      <ShadDropdownMenuItem> View Invoices </ShadDropdownMenuItem>
      <ShadDropdownMenuItem> Archive All </ShadDropdownMenuItem>
      <ShadDropdownMenuItem class="text-red-600" @click="deleteItems">
        Delete Selected ({{ items.length }})
      </ShadDropdownMenuItem>
    </ShadDropdownMenuContent>
  </ShadDropdownMenu>
</template>
