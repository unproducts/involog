<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import type { ItemSchema } from '~~/shared/schemas/item';

defineProps<{
  items: ItemSchema[];
}>();
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
      <ShadDropdownMenuItem class="text-rose-400"> Delete All </ShadDropdownMenuItem>
    </ShadDropdownMenuContent>
  </ShadDropdownMenu>
</template>
