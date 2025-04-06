<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useVModel } from '@vueuse/core';
import { Trash2 } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { discountEntrySchema, taxEntrySchema, type AdjustmentEntrySchema } from '~~/shared/schemas/invoice';

const props = defineProps<{
  entryType: 'tax' | 'discount';
  modelValue: AdjustmentEntrySchema[];
}>();

const adjustmentEntries = useVModel(props, 'modelValue');

const form = useForm({
  validationSchema: toTypedSchema(z.array(props.entryType === 'tax' ? taxEntrySchema : discountEntrySchema)),
  initialValues: adjustmentEntries.value,
});

const submit = form.handleSubmit((values) => {
  adjustmentEntries.value = values;
  console.log('Form submitted!', values);
});

// Add a new item entry
const addAdjustmentEntry = () => {
  adjustmentEntries.value = [
    ...adjustmentEntries.value,
    {
      label: '',
      isAbsolute: undefined,
      amount: undefined,
      currency: undefined,
      rate: 0,
    },
  ];
};

// Remove an item entry
const removeAdjustmentEntry = (index: number) => {
  adjustmentEntries.value = adjustmentEntries.value.filter((_, i) => i !== index);
};

defineExpose({ submit, addAdjustmentEntry, removeAdjustmentEntry });
</script>

<template>
  <form class="space-y-4" @submit="submit">
    <ShadAccordion type="single" class="w-full" collapsible>
      <ShadAccordionItem v-for="(_, index) in adjustmentEntries" :key="index" :value="index.toString()">
        <ShadAccordionTrigger>
          <div class="flex items-center justify-between w-full">
            <span>Adjustment {{ index + 1 }}</span>
            <ShadButton
              type="button"
              variant="outline-subtle"
              size="xs"
              class="h-6 w-6 mr-2"
              @click.stop="removeAdjustmentEntry(index)"
            >
              <Trash2 class="text-rose-500" />
            </ShadButton>
          </div>
        </ShadAccordionTrigger>
        <ShadAccordionContent>
          <div class="space-y-4 p-2 border rounded-md">
            <ShadFormField v-slot="{ componentField }" :name="`${index}.label`">
              <ShadFormItem>
                <ShadFormLabel>Label<span class="text-red-700">*</span></ShadFormLabel>
                <ShadFormControl>
                  <ItemSelect v-bind="componentField" />
                </ShadFormControl>
                <ShadFormMessage />
              </ShadFormItem>
            </ShadFormField>
            <ShadFormField v-slot="{ componentField }" :name="`${index}.amount`">
              <ShadFormItem>
                <ShadFormLabel>Amount</ShadFormLabel>
                <ShadFormControl>
                  <ShadInput type="number" min="1" v-bind="componentField" />
                </ShadFormControl>
                <ShadFormMessage />
              </ShadFormItem>
            </ShadFormField>
            <ShadFormField v-slot="{ componentField }" :name="`${index}.currency`">
              <ShadFormItem>
                <ShadFormLabel>Currency</ShadFormLabel>
                <ShadFormControl>
                  <SelectCurrency v-bind="componentField" />
                </ShadFormControl>
                <ShadFormMessage />
              </ShadFormItem>
            </ShadFormField>
          </div>
        </ShadAccordionContent>
      </ShadAccordionItem>
    </ShadAccordion>
  </form>
</template>
