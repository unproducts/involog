<script setup lang="ts">
import type { ClientSchema } from '~~/shared/schemas/client';
import EditOrCreate from './EditOrCreate.vue';

defineProps<{
  client?: ClientSchema;
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
    <ShadDialogTrigger class="ml-auto" as-child>
      <slot />
    </ShadDialogTrigger>
    <ShadDialogContent>
      <ShadDialogHeader>
        <ShadDialogTitle v-if="client">Update {{ client.name }}</ShadDialogTitle>
        <ShadDialogTitle v-else>Register Client</ShadDialogTitle>
      </ShadDialogHeader>
      <ClientEditOrCreate :client ref="editForm" />
      <ShadDialogFooter>
        <ShadButton variant="secondary" @click.prevent="modalOpen = false">Cancel</ShadButton>
        <ShadButton @click.prevent="save">Save</ShadButton>
      </ShadDialogFooter>
    </ShadDialogContent>
  </ShadDialog>
</template>
