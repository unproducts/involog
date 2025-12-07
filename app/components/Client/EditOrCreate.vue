<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { createClientSchema, updateClientSchema, type ClientSchema } from '~~/shared/schemas/client';

const props = defineProps<{
  client?: ClientSchema;
}>();

const emit = defineEmits<{
  (e: 'update:loading', loading: boolean): void;
  (e: 'submitted'): void;
}>();

const { stopHandles } = useStopHandles();

const { mutate: createClient, status: createStatus, isPending: isCreatingClient } = useCreateClientMutation();
const { mutate: updateClient, status: updateStatus, isPending: isUpdatingClient } = useUpdateClientMutation();

const loading = computed(() => isCreatingClient.value || isUpdatingClient.value);
const status = useCombinedStatus([createStatus, updateStatus]);

const s1 = watch(status, (newStatus) => {
  if (newStatus === 'success') {
    emit('submitted');
  }
});

const s2 = watch(loading, (newLoading) => {
  emit('update:loading', newLoading);
});

stopHandles.push(s1, s2);

const isUpdating = !!props.client;

const formSchema = toTypedSchema(isUpdating ? updateClientSchema : createClientSchema);
const form = useForm({
  validationSchema: formSchema,
});

if (isUpdating) {
  form.setValues(props.client || {});
} else {
  form.setValues({ isArchived: false });
}

const submit = form.handleSubmit((values) => {
  if (isUpdating) {
    updateClient({ ...values, id: props.client!.id });
  } else {
    createClient(values);
  }
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
