<script setup lang="ts">
import EditOrCreate from './EditOrCreate.vue';
import type { ProductSchema } from '~~/shared/schemas/products';

defineProps<{
  product?: ProductSchema;
}>();

const editForm = ref<null | InstanceType<typeof EditOrCreate>>(null);
const modalOpen = ref(false);

const save = () => {
  editForm.value?.submit();
};

const openModal = () => {
  modalOpen.value = true;
};

defineExpose({
  openModal,
});
</script>

<template>
  <ShadDialog v-model:open="modalOpen">
    <ShadDialogTrigger class="ml-auto">
      <slot />
    </ShadDialogTrigger>
    <ShadDialogContent>
      <ShadDialogHeader>
        <ShadDialogTitle v-if="product">Update {{ product.name }}</ShadDialogTitle>
        <ShadDialogTitle v-else>Register Product</ShadDialogTitle>
      </ShadDialogHeader>
      <ProductEditOrCreate :product ref="editForm" />
      <ShadDialogFooter>
        <ShadButton variant="secondary" @click.prevent="modalOpen = false">Cancel</ShadButton>
        <ShadButton @click.prevent="save">Save</ShadButton>
      </ShadDialogFooter>
    </ShadDialogContent>
  </ShadDialog>
</template>
