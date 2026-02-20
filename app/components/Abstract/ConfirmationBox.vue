<script setup lang="ts">
import type { ButtonVariants } from '../Ui/button';

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'danger';
    confirmAction: string;
    cancelAction?: string;
  }>(),
  {
    variant: 'default',
    cancelAction: 'Cancel',
  }
);

const buttonVariant = computed<ButtonVariants['variant']>(() => {
  switch (props.variant) {
    case 'danger':
      return 'destructive';
    default:
      return 'default';
  }
});

defineEmits<{
  confirm: [];
  cancel: [];
}>();

const modalOpen = defineModel<boolean>('open', { required: false, default: false });
const loading = defineModel<boolean>('loading', { required: false, default: false });
</script>

<template>
  <ShadDialog v-model:open="modalOpen">
    <ShadDialogTrigger class="ml-auto" as-child>
      <slot />
    </ShadDialogTrigger>
    <ShadDialogContent>
      <ShadDialogHeader>
        <ShadDialogTitle><slot name="title" /></ShadDialogTitle>
      </ShadDialogHeader>
      <slot name="description" />
      <ShadDialogFooter>
        <ShadButton variant="ghost" :disabled="loading" @click.prevent="$emit('cancel')">{{ cancelAction }}</ShadButton>
        <ShadButton :variant="buttonVariant" :loading="loading" @click.prevent="$emit('confirm')">{{
          confirmAction
        }}</ShadButton>
      </ShadDialogFooter>
    </ShadDialogContent>
  </ShadDialog>
</template>
