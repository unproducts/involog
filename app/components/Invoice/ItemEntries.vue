<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useVModel } from '@vueuse/core';
import { Trash2 } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { itemEntrySchema, type ItemEntrySchema } from '~~/shared/schemas/invoice';

const props = defineProps<{
  modelValue: ItemEntrySchema[];
}>();

const itemEntries = useVModel(props, 'modelValue');

const form = useForm({
  validationSchema: toTypedSchema(z.array(itemEntrySchema)),
  initialValues: itemEntries.value,
});

const submit = form.handleSubmit((values) => {
  itemEntries.value = values;
  console.log('Form submitted!', values);
});

// Add a new item entry
const addItemEntry = () => {
  itemEntries.value = [
    ...itemEntries.value,
    {
      itemId: '',
      quantity: undefined,
      narration: undefined,
    },
  ];
};

// Remove an item entry
const removeItemEntry = (index: number) => {
  itemEntries.value = itemEntries.value.filter((_, i) => i !== index);
};

watch(
  itemEntries,
  (value) => {
    if (value.length === 0) {
      addItemEntry();
    }
  },
  { deep: true, immediate: true }
);

defineExpose({ submit, addItemEntry, removeItemEntry });
</script>

<template>
  <form class="space-y-4" @submit="submit">
    <ShadAccordion type="single" class="w-full" collapsible>
      <ShadAccordionItem v-for="(_, index) in itemEntries" :key="index" :value="index.toString()">
        <ShadAccordionTrigger>
          <div class="flex items-center justify-between w-full">
            <span>Item {{ index + 1 }}</span>
            <ShadButton
              type="button"
              variant="outline-subtle"
              size="xs"
              class="h-6 w-6 mr-2"
              @click.stop="removeItemEntry(index)"
            >
              <Trash2 class="text-rose-500" />
            </ShadButton>
          </div>
        </ShadAccordionTrigger>
        <ShadAccordionContent>
          <div class="space-y-4 p-2 border rounded-md">
            <ShadFormField v-slot="{ componentField }" :name="`${index}.itemId`">
              <ShadFormItem>
                <ShadFormLabel>Item<span class="text-red-700">*</span></ShadFormLabel>
                <ShadFormControl>
                  <ItemSelect v-bind="componentField" />
                </ShadFormControl>
                <ShadFormMessage />
              </ShadFormItem>
            </ShadFormField>
            <ShadFormField v-slot="{ componentField }" :name="`${index}.quantity`">
              <ShadFormItem>
                <ShadFormLabel>Quantity</ShadFormLabel>
                <ShadFormControl>
                  <ShadInput type="number" min="1" v-bind="componentField" />
                </ShadFormControl>
                <ShadFormMessage />
              </ShadFormItem>
            </ShadFormField>
            <ShadFormField v-slot="{ componentField }" :name="`${index}.narration`">
              <ShadFormItem>
                <ShadFormLabel>Narration</ShadFormLabel>
                <ShadFormControl>
                  <ShadTextarea v-bind="componentField" />
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
