<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { createItemSchema, updateItemSchema, type ItemSchema } from '~~/shared/schemas/item';

const props = defineProps<{
  item?: ItemSchema;
}>();

const isUpdating = !!props.item;

const formSchema = toTypedSchema(isUpdating ? updateItemSchema : createItemSchema);
const form = useForm({
  validationSchema: formSchema,
});

if (isUpdating) {
  form.setValues(props.item || {});
}

const submit = form.handleSubmit((values) => {
  console.log('Form submitted!', values);
});

defineExpose({ submit });
</script>

<template>
  <form class="space-y-2" @submit="submit">
    <ShadFormField v-slot="{ componentField }" name="name">
      <ShadFormItem>
        <ShadFormLabel>Name<span class="text-red-700">*</span></ShadFormLabel>
        <ShadFormControl>
          <ShadInput type="text" placeholder="Name of your item" v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="description">
      <ShadFormItem>
        <ShadFormLabel>Description</ShadFormLabel>
        <ShadFormControl>
          <ShadTextarea placeholder="Description of your item" v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="price">
      <ShadFormItem>
        <ShadFormLabel>Price<span class="text-red-700">*</span></ShadFormLabel>
        <ShadFormControl>
          <ShadInput type="number" placeholder="Price of your item" v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="currency">
      <ShadFormItem>
        <ShadFormLabel>Currency<span class="text-red-700">*</span></ShadFormLabel>
        <ShadFormControl>
          <SelectCurrency v-bind="componentField" />
        </ShadFormControl>
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="unitId">
      <ShadFormItem>
        <ShadFormLabel>Unit<span class="text-red-700">*</span></ShadFormLabel>
        <ShadFormControl>
          <UnitSelect v-bind="componentField" />
        </ShadFormControl>
      </ShadFormItem>
    </ShadFormField>
  </form>
</template>
