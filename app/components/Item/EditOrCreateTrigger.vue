<script setup lang="ts">
import type { ItemSchema } from '~~/shared/schemas/item';
import type EditOrCreate from './EditOrCreate.vue';

const props = defineProps<{
  item?: ItemSchema;
}>();

const editOrCreateRef = ref<InstanceType<typeof EditOrCreate>>();

const isUpdating = !!props.item;

const open = ref(false);
const status = ref<DataStateStatus>('pending');
const loading = ref(false);

watch(status, (newStatus) => {
  if (newStatus === 'success') {
    open.value = false;
  }
});
</script>

<template>
  <ShadDialog v-model:open="open">
    <ShadDialogTrigger as-child>
      <slot />
    </ShadDialogTrigger>
    <ShadDialogContent class="sm:max-w-[425px]">
      <ShadDialogHeader>
        <ShadDialogTitle>{{ isUpdating ? 'Edit' : 'New' }} {{ item?.name || 'Item' }}</ShadDialogTitle>
        <ShadDialogDescription sr-only>
          {{ isUpdating ? 'Make changes to your item here.' : 'Add a new item to your system.' }}
          {{ item?.name || 'Item' }}
          Click save when you're done.
        </ShadDialogDescription>
      </ShadDialogHeader>
      <ItemEditOrCreate ref="editOrCreateRef" :item="item" v-model:status="status" v-model:loading="loading" />
      <ShadDialogFooter>
        <ShadButton type="submit" @click="editOrCreateRef?.submit()" :disabled="loading">
          {{ isUpdating ? 'Update' : 'Create' }}
        </ShadButton>
      </ShadDialogFooter>
    </ShadDialogContent>
  </ShadDialog>
</template>
