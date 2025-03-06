<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { type TransactionType } from '~~/shared/consts/transactions';
import {
  createExpenseTransactionSchema,
  createIncomeTransactionSchema,
  updateExpenseTransactionSchema,
  updateIncomeTransactionSchema,
  type TransactionSchema,
} from '~~/shared/schemas/transactions';

const props = defineProps<{
  transaction?: TransactionSchema;
  type?: TransactionType;
}>();

const isUpdating = !!props.transaction;

if (props.transaction && props.type) {
  if (props.transaction.type !== props.type) {
    throw new Error('Transaction type does not match the type prop');
  }
} else if (!props.transaction && !props.type) {
  throw new Error('Either transaction or type prop is required');
}

const transactionType = props.type || (props.transaction?.type as TransactionType);

const transactionSchema = isUpdating
  ? transactionType == 'I'
    ? updateIncomeTransactionSchema
    : updateExpenseTransactionSchema
  : transactionType == 'I'
  ? createIncomeTransactionSchema
  : createExpenseTransactionSchema;

const formSchema = toTypedSchema(transactionSchema);
const form = useForm({
  validationSchema: formSchema,
});

if (isUpdating) {
  form.setValues(props.transaction || {});
} else {
  form.setValues({ type: transactionType });
}

const submit = form.handleSubmit((values) => {
  console.log('Form submitted!', values);
});

const chooseClient = ref(false);
if (props.transaction) {
  chooseClient.value = !!props.transaction.clientId;
}
watch(chooseClient, () => {
  form.setFieldValue('merchant', undefined);
  form.setFieldValue('clientId', undefined);
});

defineExpose({ submit });
</script>

<template>
  <form class="space-y-2" @submit="submit">
    <ShadFormField v-slot="{ componentField }" name="description">
      <ShadFormItem>
        <ShadFormLabel>Description<span class="text-red-700">*</span></ShadFormLabel>
        <ShadFormControl>
          <ShadInput type="text" placeholder="Tony from Knackline" v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="amount">
      <ShadFormItem>
        <ShadFormLabel>Amount<span class="text-red-700">*</span></ShadFormLabel>
        <ShadFormControl>
          <ShadInput type="number" placeholder="1000" v-bind="componentField" />
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
    <ShadFormField v-slot="{ componentField }" name="category">
      <ShadFormItem>
        <ShadFormLabel>Category<span class="text-red-700">*</span></ShadFormLabel>
        <ShadFormControl>
          <SelectIncomeCategory v-bind="componentField" v-if="transactionType == 'I'" />
          <SelectExpenseCategory v-bind="componentField" v-else />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="date">
      <ShadFormItem>
        <ShadFormLabel> Date<span class="text-red-700">*</span> </ShadFormLabel><br />
        <ShadFormControl>
          <SelectDate v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="merchant" v-if="!chooseClient">
      <ShadFormItem>
        <ShadFormLabel>Merchant</ShadFormLabel>
        <ShadFormControl>
          <ShadInput type="text" placeholder="Tony from Knackline" v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <ShadFormField v-slot="{ componentField }" name="clientId" v-else>
      <ShadFormItem>
        <ShadFormLabel>Client</ShadFormLabel>
        <ShadFormControl>
          <ClientSelect v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
    <div class="flex space-x-1 items-center">
      <ShadCheckbox v-model="chooseClient" id="chooseClient" />
      <ShadLabel for="chooseClient">Select from clients</ShadLabel>
    </div>
    <ShadFormField v-slot="{ componentField }" name="notes">
      <ShadFormItem>
        <ShadFormLabel>Notes</ShadFormLabel>
        <ShadFormControl>
          <ShadTextarea v-bind="componentField" />
        </ShadFormControl>
        <ShadFormMessage />
      </ShadFormItem>
    </ShadFormField>
  </form>
</template>
