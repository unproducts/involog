<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { createItemSchema, updateItemSchema, type ItemSchema } from '~~/shared/schemas/item';

const props = defineProps<{
  item?: ItemSchema;
}>();

const emit = defineEmits<{
  (e: 'update:loading', loading: boolean): void;
  (e: 'submitted'): void;
}>();

const { stopHandles } = useStopHandles();

const { mutate: createItem, status: createStatus, isLoading: isCreatingItem } = useCreateItemMutation();
const { mutate: updateItem, status: updateStatus, isLoading: isUpdatingItem } = useUpdateItemMutation();

const loading = computed(() => isCreatingItem.value || isUpdatingItem.value);
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

const isUpdating = !!props.item;

const formSchema = toTypedSchema(isUpdating ? updateItemSchema : createItemSchema);
const form = useForm({
  validationSchema: formSchema,
});

if (isUpdating) {
  form.setValues(props.item || {});
}

const submit = form.handleSubmit((values) => {
  if (isUpdating) {
    updateItem({ ...values, id: props.item!.id });
  } else {
    createItem(values);
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
