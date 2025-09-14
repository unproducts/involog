<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { syncRef } from '@vueuse/core';
import { useForm } from 'vee-validate';
import { mutateItemSchema, type ItemSchema } from '~~/shared/schemas/item';

const props = defineProps<{
  item?: ItemSchema;
}>();

const status = defineModel<DataStateStatus>('status', { default: 'pending' });
const loading = defineModel<boolean>('loading', { default: true });

const isUpdating = !!props.item;

const formSchema = toTypedSchema(mutateItemSchema);
const form = useForm({
  validationSchema: formSchema,
});

if (isUpdating) {
  form.setValues(props.item || {});
}

const { stopHandles } = useStopHandles();

const submit = form.handleSubmit((values) => {
  if (isUpdating) {
    const { mutate, status: updateStatus, isLoading } = useUpdateItemMutation({ id: props.item?.id! });
    mutate(values);
    stopHandles.push(syncRef(status, updateStatus, { direction: 'rtl' }));
    stopHandles.push(syncRef(loading, isLoading, { direction: 'rtl' }));
  } else {
    const { mutate, status: createStatus, isLoading } = useCreateItemMutation();
    mutate(values);
    stopHandles.push(syncRef(status, createStatus, { direction: 'rtl' }));
    stopHandles.push(syncRef(loading, isLoading, { direction: 'rtl' }));
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
    <ShadFormField v-slot="{ componentField }" name="isService">
      <ShadFormItem class="flex flex-col gap-1">
        <ShadFormLabel>Is Service?<span class="text-red-700">*</span></ShadFormLabel>
        <ShadFormControl>
          <ShadCheckbox
            :model-value="componentField.modelValue"
            @update:model-value="componentField['onUpdate:modelValue']"
          />
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
