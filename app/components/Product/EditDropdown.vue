<script setup lang="ts">
import { MoreHorizontal, Edit3 } from 'lucide-vue-next';
import type { ProductSchema } from '~~/shared/schemas/products';

defineProps<{
  product: ProductSchema;
}>();
</script>

<template>
  <div class="flex space-x-1 items-center">
    <ProductEditOrCreateTrigger :product="product">
      <ShadButton variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Edit product</span>
        <Edit3 class="w-4 h-4" />
      </ShadButton>
    </ProductEditOrCreateTrigger>
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
        <ShadDropdownMenuItem> Archive </ShadDropdownMenuItem>
        <ShadDropdownMenuItem class="text-rose-400"> Delete </ShadDropdownMenuItem>
      </ShadDropdownMenuContent>
    </ShadDropdownMenu>
  </div>
</template>
