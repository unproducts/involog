<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useVModel } from '@vueuse/core';
import { useForm } from 'vee-validate';
import { formatCurrency } from '~~/lib/formatting';
import { calculateItemSubtotal } from '~~/lib/valuation';
import { itemEntrySchema, type ItemEntrySchema } from '~~/shared/schemas/invoice';

const props = defineProps<{
  modelValue: ItemEntrySchema;
  hasErrors: boolean;
  subtotalFormatted: string;
  currency?: string;
}>();

const itemEntry = useVModel(props, 'modelValue');
const hasErrors = useVModel(props, 'hasErrors');
const subtotalFormatted = useVModel(props, 'subtotalFormatted');

const { data: items } = useQuery(getItemsColada());

const { errors, values, handleSubmit } = useForm({
  validationSchema: toTypedSchema(itemEntrySchema),
  initialValues: itemEntry.value,
});

watch(errors, (value) => {
  hasErrors.value = Object.keys(value).length > 0;
});

const submit = handleSubmit((values) => {
  itemEntry.value = values;
});

defineExpose({
  submit,
});

const onFormValuesChange = () => {
  if (!values.itemId) {
    // This is a new item entry, so we don't need to calculate the subtotal
    return;
  }
  if (!props.currency) {
    return;
  }
  const item = items.value?.find((i) => i.id === values.itemId);
  if (!item) {
    return;
  }
  const itemSubtotal = calculateItemSubtotal(item, values.quantity ?? 0);
  subtotalFormatted.value = formatCurrency(props.currency, itemSubtotal);
};

watch(values, onFormValuesChange, { deep: true, immediate: true });
watch(() => props.currency, onFormValuesChange);
</script>

<template>
  <div class="space-y-4 p-2 border rounded-md">
    <ShadFormField v-slot="{ componentField }" name="itemId">
      <ShadFormItem>
        <ShadFormLabel>Item<span class="text-red-700">*</span></ShadFormLabel>
        <ShadFormControl>
          <ItemSelect v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="quantity">
      <ShadFormItem>
        <ShadFormLabel>Quantity<span class="text-red-700">*</span></ShadFormLabel>
        <ShadFormControl>
          <ShadInput type="number" min="1" v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="narration">
      <ShadFormItem>
        <ShadFormLabel>Narration</ShadFormLabel>
        <ShadFormControl>
          <ShadTextarea v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
  </div>
</template>
