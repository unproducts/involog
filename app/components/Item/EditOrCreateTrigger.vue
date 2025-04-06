<script setup lang="ts">
import EditOrCreate from './EditOrCreate.vue';
import type { Item } from '~~/shared/schemas/item';

defineProps<{
  item?: Item;
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
        <ShadDialogTitle v-if="item">Update {{ item.name }}</ShadDialogTitle>
        <ShadDialogTitle v-else>Register Item</ShadDialogTitle>
      </ShadDialogHeader>
      <ItemEditOrCreate :item ref="editForm" />
      <ShadDialogFooter>
        <ShadButton variant="secondary" @click.prevent="modalOpen = false">Cancel</ShadButton>
        <ShadButton @click.prevent="save">Save</ShadButton>
      </ShadDialogFooter>
    </ShadDialogContent>
  </ShadDialog>
</template>
