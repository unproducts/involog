<script setup lang="ts">
import EditOrCreate from './EditOrCreate.vue';
import type { ServiceSchema } from '~~/shared/schemas/services';

defineProps<{
  service?: ServiceSchema;
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
        <ShadDialogTitle v-if="service">Update {{ service.name }}</ShadDialogTitle>
        <ShadDialogTitle v-else>Register Service</ShadDialogTitle>
      </ShadDialogHeader>
      <ServiceEditOrCreate :service ref="editForm" />
      <ShadDialogFooter>
        <ShadButton variant="secondary" @click.prevent="modalOpen = false">Cancel</ShadButton>
        <ShadButton @click.prevent="save">Save</ShadButton>
      </ShadDialogFooter>
    </ShadDialogContent>
  </ShadDialog>
</template>
