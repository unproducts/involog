<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { createClientSchema, updateClientSchema, type ClientSchema } from '~~/shared/schemas/clients';

const props = defineProps<{
  client?: ClientSchema;
}>();

const isUpdating = !!props.client;

const formSchema = toTypedSchema(isUpdating ? updateClientSchema : createClientSchema);
const form = useForm({
  validationSchema: formSchema,
});

if (isUpdating) {
  form.setValues(props.client || {});
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
          <ShadInput type="text" placeholder="Tony from Knackline" v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="email">
      <ShadFormItem>
        <ShadFormLabel>Email</ShadFormLabel>
        <ShadFormControl>
          <ShadInput type="text" placeholder="tony@knackline.com" v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="phone">
      <ShadFormItem>
        <ShadFormLabel>Phone Number</ShadFormLabel>
        <ShadFormControl>
          <ShadInput type="text" placeholder="+101 9012 2134" v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="country">
      <ShadFormItem>
        <ShadFormLabel>Country</ShadFormLabel>
        <ShadFormControl>
          <SelectCountry v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="billingAddress">
      <ShadFormItem>
        <ShadFormLabel>Billing Address</ShadFormLabel>
        <ShadFormControl>
          <ShadTextarea type="text" placeholder="13th Street. 47 W 13th St, New Yor.." v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="shippingAddress">
      <ShadFormItem>
        <ShadFormLabel>Shipping Address</ShadFormLabel>
        <ShadFormControl>
          <ShadTextarea type="text" placeholder="13th Street. 47 W 13th St, New Yor.." v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="currency">
      <ShadFormItem>
        <ShadFormLabel>Currency</ShadFormLabel>
        <ShadFormControl>
          <SelectCurrency v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
  </form>
</template>
