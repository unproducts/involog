<script setup lang="ts">
import type { ItemSchema } from '~~/shared/schemas/item';

const props = defineProps<{
  item?: ItemSchema;
}>();

const modalOpen = ref(false);
const loading = ref(false);

const editOrCreateRef = useTemplateRef('editOrCreateRef');
</script>

<template>
  <ShadDialog v-model:open="modalOpen">
    <ShadDialogTrigger as-child>
      <slot />
    </ShadDialogTrigger>
    <ShadDialogContent class="sm:max-w-[425px]">
      <ShadDialogHeader>
        <ShadDialogTitle>{{ item ? 'Edit' : 'New' }} {{ item?.name || 'Item' }}</ShadDialogTitle>
        <ShadDialogDescription sr-only>
          {{ item ? 'Make changes to your item here.' : 'Add a new item to your system.' }}
          {{ item?.name || 'Item' }}
          Click save when you're done.
        </ShadDialogDescription>
      </ShadDialogHeader>
      <ItemEditOrCreate
        ref="editOrCreateRef"
        :item="item"
        @update:loading="loading = $event"
        @submitted="modalOpen = false"
      />
      <ShadDialogFooter>
        <ShadButton type="submit" @click="editOrCreateRef?.submit()" :disabled="loading">
          {{ item ? 'Update' : 'Create' }}
        </ShadButton>
      </ShadDialogFooter>
    </ShadDialogContent>
  </ShadDialog>
</template>
