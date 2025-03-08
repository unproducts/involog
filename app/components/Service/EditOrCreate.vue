<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { createServiceSchema, updateServiceSchema, type ServiceSchema } from '~~/shared/schemas/services';

const props = defineProps<{
  service?: ServiceSchema;
}>();

const isUpdating = !!props.service;

const formSchema = toTypedSchema(isUpdating ? updateServiceSchema : createServiceSchema);
const form = useForm({
  validationSchema: formSchema,
});

if (isUpdating) {
  form.setValues(props.service || {});
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
          <ShadInput type="text" placeholder="Name of your service" v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="description">
      <ShadFormItem>
        <ShadFormLabel>Description</ShadFormLabel>
        <ShadFormControl>
          <ShadTextarea placeholder="Description of your service" v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="price">
      <ShadFormItem>
        <ShadFormLabel>Price<span class="text-red-700">*</span></ShadFormLabel>
        <ShadFormControl>
          <ShadInput type="number" placeholder="Price of your service" v-bind="componentField" />
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
  </form>
</template>
