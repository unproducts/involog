<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useVModel } from '@vueuse/core';
import { useForm } from 'vee-validate';
import { formatAdjustmentEntry } from '~~/lib/formatting';
import { discountEntrySchema, taxEntrySchema, type AdjustmentEntrySchema } from '~~/shared/schemas/invoice';

const props = defineProps<{
  entryType: 'tax' | 'discount';
  modelValue: AdjustmentEntrySchema;
  hasErrors: boolean;
  adjustmentFormatted: string;
  currency?: string;
}>();

const adjustmentEntry = useVModel(props, 'modelValue');
const hasErrors = useVModel(props, 'hasErrors');
const adjustmentFormatted = useVModel(props, 'adjustmentFormatted');

const { values, errors, handleSubmit } = useForm<AdjustmentEntrySchema>({
  validationSchema: toTypedSchema(props.entryType === 'tax' ? taxEntrySchema : discountEntrySchema),
  initialValues: adjustmentEntry.value,
});

watch(errors, (value: Record<string, string>) => {
  hasErrors.value = Object.keys(value).length > 0;
});

const submit = handleSubmit((formValues) => {
  adjustmentEntry.value = formValues;
});

defineExpose({ submit });

const onFormValuesChange = () => {
  if (!values.value) {
    return;
  }
  if (!props.currency) {
    return;
  }
  if (!values.label) {
    return;
  }
  adjustmentFormatted.value = formatAdjustmentEntry(values as AdjustmentEntrySchema, props.currency, props.entryType);
};

watch(values, onFormValuesChange, { deep: true, immediate: true });
watch(() => props.currency, onFormValuesChange);
</script>

<template>
  <div class="space-y-4 p-2 border rounded-md">
    <ShadFormField v-slot="{ componentField }" name="label">
      <ShadFormItem>
        <ShadFormLabel>Label<span class="text-red-700">*</span></ShadFormLabel>
        <ShadFormControl>
          <ShadInput v-bind="componentField" :placeholder="entryType === 'tax' ? 'GST/VAT' : 'Discount'" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="isAbsolute">
      <ShadFormItem>
        <div class="flex items-center space-x-2">
          <ShadFormControl>
            <ShadCheckbox
              :model-value="componentField.modelValue"
              @update:model-value="componentField['onUpdate:modelValue']"
            />
          </ShadFormControl>
          <ShadFormLabel>Absolute Amount</ShadFormLabel>
        </div>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="value">
      <ShadFormItem>
        <ShadFormLabel>{{ values.isAbsolute ? 'Amount' : 'Rate (%)' }}</ShadFormLabel>
        <ShadFormControl>
          <ShadInput
            type="number"
            :min="0"
            :max="values?.isAbsolute ? undefined : 100"
            :placeholder="values?.isAbsolute ? '120' : '12%'"
            v-bind="componentField"
          />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
  </div>
</template>
