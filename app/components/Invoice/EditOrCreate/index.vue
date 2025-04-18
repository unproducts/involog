<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import type { AdjustmentEntrySchema, ItemEntrySchema, InvoiceSchema } from '~~/shared/schemas/invoice';
import { createInvoiceSchema, updateInvoiceSchema } from '~~/shared/schemas/invoice';

interface ItemEntryHolder {
  entry: ItemEntrySchema;
  hasErrors: boolean;
  subtotalFormatted: string;
}

interface AdjustmentEntryHolder {
  entry: AdjustmentEntrySchema;
  hasErrors: boolean;
  adjustmentFormatted: string;
}

const props = defineProps<{
  invoice?: InvoiceSchema;
}>();

const isUpdating = !!props.invoice;

const formSchema = toTypedSchema(isUpdating ? updateInvoiceSchema : createInvoiceSchema);
const form = useForm({
  validationSchema: formSchema,
});

if (isUpdating) {
  form.setValues(props.invoice || {});
}

const showDueDate = ref(false);
const itemEntries = ref<ItemEntryHolder[]>([]);
const taxAdjustmentEntries = ref<AdjustmentEntryHolder[]>([]);
const discountAdjustmentEntries = ref<AdjustmentEntryHolder[]>([]);

const itemEntryRefs = ref<{ submit: () => Promise<void> }[]>([]);
const taxAdjustmentEntryRefs = ref<{ submit: () => Promise<void> }[]>([]);
const discountAdjustmentEntryRefs = ref<{ submit: () => Promise<void> }[]>([]);

const openEntryValue = ref<string | string[] | undefined>(undefined);

const scrollToOpenAccordionIfOpen = () => {
  const element = document.querySelector(`[data-state="open"]`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const scrollToFirstEntryError = () => {
  const firstItemErrorIndex = itemEntries.value.findIndex((entry) => entry.hasErrors);
  const firstTaxErrorIndex = taxAdjustmentEntries.value.findIndex((entry) => entry.hasErrors);
  const firstDiscountErrorIndex = discountAdjustmentEntries.value.findIndex((entry) => entry.hasErrors);

  if (firstItemErrorIndex !== -1) {
    openEntryValue.value = `item-${firstItemErrorIndex}`;
  } else if (firstTaxErrorIndex !== -1) {
    openEntryValue.value = `tax-${firstTaxErrorIndex}`;
  } else if (firstDiscountErrorIndex !== -1) {
    openEntryValue.value = `discount-${firstDiscountErrorIndex}`;
  } else if (firstDiscountErrorIndex !== -1) {
    openEntryValue.value = `discount-${firstDiscountErrorIndex}`;
  }

  nextTick(scrollToOpenAccordionIfOpen);
};

const addItemEntry = () => {
  itemEntries.value = [...itemEntries.value, { entry: {} as ItemEntrySchema, hasErrors: false, subtotalFormatted: '' }];
};

const removeItemEntry = (index: number) => {
  itemEntries.value = itemEntries.value.filter((_, i) => i !== index);
};

const addAdjustmentEntry = (adjustmentEntries: Ref<AdjustmentEntryHolder[]>) => {
  adjustmentEntries.value = [
    ...adjustmentEntries.value,
    { entry: {} as AdjustmentEntrySchema, hasErrors: false, adjustmentFormatted: '' },
  ];
};

const removeAdjustmentEntry = (adjustmentEntries: Ref<AdjustmentEntryHolder[]>, index: number) => {
  adjustmentEntries.value = adjustmentEntries.value.filter((_, i) => i !== index);
};

const addTaxAdjustmentEntry = () => addAdjustmentEntry(taxAdjustmentEntries);
const removeTaxAdjustmentEntry = (index: number) => removeAdjustmentEntry(taxAdjustmentEntries, index);

const addDiscountAdjustmentEntry = () => addAdjustmentEntry(discountAdjustmentEntries);
const removeDiscountAdjustmentEntry = (index: number) => removeAdjustmentEntry(discountAdjustmentEntries, index);

const submitForm = form.handleSubmit(async (values) => {
  console.log('Invoice form submitted!', values);
});

const submit = async () => {
  try {
    for (const ref of itemEntryRefs.value) {
      await ref.submit();
    }
    for (const ref of taxAdjustmentEntryRefs.value) {
      await ref.submit();
    }
    for (const ref of discountAdjustmentEntryRefs.value) {
      await ref.submit();
    }
    const hasItemErrors = itemEntries.value.some((entry) => entry.hasErrors);
    const hasTaxErrors = taxAdjustmentEntries.value.some((entry) => entry.hasErrors);
    const hasDiscountErrors = discountAdjustmentEntries.value.some((entry) => entry.hasErrors);

    if (hasItemErrors || hasTaxErrors || hasDiscountErrors) {
      scrollToFirstEntryError();
      return;
    }

    const items = itemEntries.value.map((entry) => entry.entry);
    const taxes = taxAdjustmentEntries.value.map((entry) => entry.entry);
    const discounts = discountAdjustmentEntries.value.map((entry) => entry.entry);

    // Update form values with child component values
    form.setValues({
      ...form.values,
      items,
      taxes,
      discounts,
    });

    await submitForm();
  } catch (error) {
    console.error('Error during form submission:', error);
  }
};

defineExpose({ submit });
</script>

<template>
  <section class="flex w-full min-w-96">
    <form class="flex flex-col w-1/3 p-2 space-y-4" @submit.prevent="submit">
      <section class="space-y-2 border-b border-zinc-200 pb-4">
        <div class="text-base font-bold">Details</div>
        <ShadFormField v-slot="{ componentField }" name="clientId">
          <ShadFormItem>
            <ShadFormLabel>Client<span class="text-red-700">*</span></ShadFormLabel>
            <ShadFormControl>
              <ClientSelect v-bind="componentField" />
            </ShadFormControl>
            <ShadFormMessage />
          </ShadFormItem>
        </ShadFormField>
        <div class="flex gap-2">
          <ShadFormField v-slot="{ componentField }" name="prefixId">
            <ShadFormItem class="w-1/2">
              <ShadFormLabel>Invoice Prefix<span class="text-red-700">*</span></ShadFormLabel>
              <ShadFormControl>
                <InvoiceSelectPrefix v-bind="componentField" class="w-full" />
              </ShadFormControl>
              <ShadFormMessage />
            </ShadFormItem>
          </ShadFormField>
          <ShadFormField v-slot="{ componentField }" name="number">
            <ShadFormItem class="w-1/2">
              <ShadFormLabel>Invoice number<span class="text-red-700">*</span></ShadFormLabel>
              <ShadFormControl>
                <ShadInput v-bind="componentField" type="string" placeholder="2/3-ABC" />
              </ShadFormControl>
              <ShadFormMessage />
            </ShadFormItem>
          </ShadFormField>
        </div>
        <ShadFormField v-slot="{ componentField }" name="subject">
          <ShadFormItem>
            <ShadFormLabel>Subject</ShadFormLabel>
            <ShadFormControl>
              <ShadInput v-bind="componentField" type="string" placeholder="Invoice for..." />
            </ShadFormControl>
            <ShadFormMessage />
          </ShadFormItem>
        </ShadFormField>
        <ShadFormField v-slot="{ componentField }" name="currency">
          <ShadFormItem>
            <ShadFormLabel>Currency<span class="text-red-700">*</span></ShadFormLabel>
            <ShadFormControl>
              <SelectCurrency v-bind="componentField" class="w-full" />
            </ShadFormControl>
            <ShadFormMessage />
          </ShadFormItem>
        </ShadFormField>
        <div class="flex gap-2">
          <ShadFormField v-slot="{ componentField }" name="date">
            <ShadFormItem class="w-1/2">
              <ShadFormLabel>Issue Date<span class="text-red-700">*</span></ShadFormLabel>
              <ShadFormControl>
                <SelectDate v-bind="componentField" class="w-full" />
              </ShadFormControl>
              <ShadFormMessage />
            </ShadFormItem>
          </ShadFormField>
          <ShadFormField v-slot="{ componentField }" name="dueDate">
            <ShadFormItem class="w-1/2">
              <ShadFormLabel>Due Date</ShadFormLabel>
              <ShadFormControl>
                <SelectDate v-bind="componentField" :disabled="!showDueDate" class="w-full" />
              </ShadFormControl>
              <ShadFormMessage />
            </ShadFormItem>
          </ShadFormField>
        </div>
        <div class="flex items-center space-x-2">
          <ShadCheckbox id="show-due-date" v-model="showDueDate" />
          <ShadLabel for="show-due-date">Include Due Date</ShadLabel>
        </div>
      </section>
      <section class="space-y-2 border-zinc-200" :class="{ 'border-b': itemEntries.length === 0 }">
        <div class="flex justify-between items-center">
          <div class="text-base font-semibold">Items</div>
          <ShadButton type="button" size="xs" variant="outline-subtle" @click="addItemEntry">Add</ShadButton>
        </div>
        <section class="space-y-4">
          <ShadAccordion v-model="openEntryValue" type="single" class="w-full" collapsible :unmount-on-hide="false">
            <ShadAccordionItem v-for="(_, index) in itemEntries" :key="index" :value="`item-${index}`">
              <ShadAccordionTrigger>
                <div class="flex items-center justify-between w-full pr-2">
                  <div class="flex items-center gap-2">
                    <ShadButton
                      type="button"
                      variant="outline-subtle"
                      size="xs"
                      class="h-6 w-6"
                      @click.stop="removeItemEntry(index)"
                    >
                      <Trash2 class="text-rose-500" />
                    </ShadButton>
                    <span>Item {{ index + 1 }}</span>
                  </div>
                  <span>{{ itemEntries[index]!.subtotalFormatted }}</span>
                </div>
              </ShadAccordionTrigger>
              <ShadAccordionContent>
                <InvoiceEditOrCreateItemEntry
                  ref="itemEntryRefs"
                  v-model="itemEntries[index]!.entry"
                  v-model:has-errors="itemEntries[index]!.hasErrors"
                  v-model:subtotal-formatted="itemEntries[index]!.subtotalFormatted"
                  :currency="form.values.currency"
                />
              </ShadAccordionContent>
            </ShadAccordionItem>
          </ShadAccordion>
        </section>
      </section>
      <section class="space-y-2 border-zinc-200" :class="{ 'border-b': taxAdjustmentEntries.length === 0 }">
        <div class="flex justify-between items-center">
          <div class="text-base font-semibold">Taxes</div>
          <ShadButton type="button" size="xs" variant="outline-subtle" @click="addTaxAdjustmentEntry"> Add </ShadButton>
        </div>
        <section class="space-y-4">
          <ShadAccordion v-model="openEntryValue" type="single" class="w-full" collapsible :unmount-on-hide="false">
            <ShadAccordionItem v-for="(_, index) in taxAdjustmentEntries" :key="index" :value="`tax-${index}`">
              <ShadAccordionTrigger>
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center">
                    <ShadButton
                      type="button"
                      variant="outline-subtle"
                      size="xs"
                      class="h-6 w-6 mr-2"
                      @click.stop="removeTaxAdjustmentEntry(index)"
                    >
                      <Trash2 class="text-rose-500" />
                    </ShadButton>
                    <span>Tax {{ index + 1 }}</span>
                  </div>
                  <span>{{ taxAdjustmentEntries[index]!.adjustmentFormatted }}</span>
                </div>
              </ShadAccordionTrigger>
              <ShadAccordionContent>
                <InvoiceEditOrCreateAdjustmentEntry
                  ref="taxAdjustmentEntryRefs"
                  entry-type="tax"
                  v-model="taxAdjustmentEntries[index]!.entry"
                  v-model:has-errors="taxAdjustmentEntries[index]!.hasErrors"
                  v-model:adjustment-formatted="taxAdjustmentEntries[index]!.adjustmentFormatted"
                  :currency="form.values.currency"
                />
              </ShadAccordionContent>
            </ShadAccordionItem>
          </ShadAccordion>
        </section>
      </section>
      <section class="space-y-2 border-zinc-200" :class="{ 'border-b': discountAdjustmentEntries.length === 0 }">
        <div class="flex justify-between items-center">
          <div class="text-base font-semibold">Discounts</div>
          <ShadButton type="button" size="xs" variant="outline-subtle" @click="addDiscountAdjustmentEntry">
            Add
          </ShadButton>
        </div>
        <section class="space-y-4">
          <ShadAccordion v-model="openEntryValue" type="single" class="w-full" collapsible :unmount-on-hide="false">
            <ShadAccordionItem
              v-for="(_, index) in discountAdjustmentEntries"
              :key="index"
              :value="`discount-${index}`"
            >
              <ShadAccordionTrigger>
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center">
                    <ShadButton
                      type="button"
                      variant="outline-subtle"
                      size="xs"
                      class="h-6 w-6 mr-2"
                      @click.stop="removeDiscountAdjustmentEntry(index)"
                    >
                      <Trash2 class="text-rose-500" />
                    </ShadButton>
                    <span>Discount {{ index + 1 }}</span>
                  </div>
                  <span>{{ discountAdjustmentEntries[index]!.adjustmentFormatted }}</span>
                </div>
              </ShadAccordionTrigger>
              <ShadAccordionContent>
                <InvoiceEditOrCreateAdjustmentEntry
                  ref="discountAdjustmentEntryRefs"
                  entry-type="discount"
                  v-model="discountAdjustmentEntries[index]!.entry"
                  v-model:has-errors="discountAdjustmentEntries[index]!.hasErrors"
                  v-model:adjustment-formatted="discountAdjustmentEntries[index]!.adjustmentFormatted"
                  :currency="form.values.currency"
                />
              </ShadAccordionContent>
            </ShadAccordionItem>
          </ShadAccordion>
        </section>
      </section>
      <section class="space-y-2 border-zinc-200" :class="{ 'border-b': itemEntries.length === 0 }">
        <div class="flex justify-between items-center">
          <div class="text-base font-semibold">Other Details</div>
        </div>
        <ShadFormField v-slot="{ componentField }" name="note">
          <ShadFormItem>
            <ShadFormLabel>Note</ShadFormLabel>
            <ShadFormControl>
              <ShadTextarea v-bind="componentField" placeholder="Add any additional notes here..." />
            </ShadFormControl>
            <ShadFormMessage />
          </ShadFormItem>
        </ShadFormField>
        <div class="flex justify-end">
          <ShadButton type="submit" variant="default">
            {{ isUpdating ? 'Update Invoice' : 'Create Invoice' }}
          </ShadButton>
        </div>
      </section>
    </form>
    <div class="w-2/3 bg-zinc-50"></div>
  </section>
</template>
