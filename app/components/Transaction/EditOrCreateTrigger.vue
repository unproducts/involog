<script setup lang="ts">
import type { TransactionType } from '~~/shared/consts/transactions';
import EditOrCreate from './EditOrCreate.vue';
import type { TransactionSchema } from '~~/shared/schemas/transactions';

defineProps<{
  transaction?: TransactionSchema;
  type?: TransactionType;
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
        <ShadDialogTitle v-if="transaction">Update Transaction</ShadDialogTitle>
        <ShadDialogTitle v-else>New {{ type == 'I' ? 'Income' : 'Expense' }}</ShadDialogTitle>
      </ShadDialogHeader>
      <TransactionEditOrCreate :transaction :type ref="editForm" />
      <ShadDialogFooter>
        <ShadButton variant="secondary" @click.prevent="modalOpen = false">Cancel</ShadButton>
        <ShadButton @click.prevent="save">Save</ShadButton>
      </ShadDialogFooter>
    </ShadDialogContent>
  </ShadDialog>
</template>
