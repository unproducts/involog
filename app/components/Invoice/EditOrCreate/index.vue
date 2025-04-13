<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';
import type { AdjustmentEntrySchema, ItemEntrySchema } from '~~/shared/schemas/invoice';

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

const clientId = ref<string>();
const showDueDate = ref(false);
const itemEntries = ref<ItemEntryHolder[]>([]);
const currency = ref<string>();
const taxAdjustmentEntries = ref<AdjustmentEntryHolder[]>([]);
const discountAdjustmentEntries = ref<AdjustmentEntryHolder[]>([]);

// Add a new item entry
const addItemEntry = () => {
  itemEntries.value = [...itemEntries.value, { entry: {} as ItemEntrySchema, hasErrors: false, subtotalFormatted: '' }];
};

// Remove an item entry
const removeItemEntry = (index: number) => {
  itemEntries.value = itemEntries.value.filter((_, i) => i !== index);
};

// Add a new item entry
const addAdjustmentEntry = (adjustmentEntries: Ref<AdjustmentEntryHolder[]>) => {
  adjustmentEntries.value = [
    ...adjustmentEntries.value,
    { entry: {} as AdjustmentEntrySchema, hasErrors: false, adjustmentFormatted: '' },
  ];
};

// Remove an item entry
const removeAdjustmentEntry = (adjustmentEntries: Ref<AdjustmentEntryHolder[]>, index: number) => {
  adjustmentEntries.value = adjustmentEntries.value.filter((_, i) => i !== index);
};

const addTaxAdjustmentEntry = () => addAdjustmentEntry(taxAdjustmentEntries);
const removeTaxAdjustmentEntry = (index: number) => removeAdjustmentEntry(taxAdjustmentEntries, index);

const addDiscountAdjustmentEntry = () => addAdjustmentEntry(discountAdjustmentEntries);
const removeDiscountAdjustmentEntry = (index: number) => removeAdjustmentEntry(discountAdjustmentEntries, index);
</script>

<template>
  <section class="flex w-full min-w-96">
    <form class="flex flex-col w-1/3 p-2 space-y-4" @submit="() => {}">
      <section class="space-y-2 border-b border-zinc-200 pb-4">
        <div class="text-base font-bold">Details</div>
        <div class="space-y-1">
          <ShadLabel for="invoice-client">Client</ShadLabel>
          <ClientSelect id="invoice-client" v-model="clientId" />
        </div>
        <div class="flex gap-2">
          <div class="space-y-1 w-1/2">
            <ShadLabel for="invoice-prefix">Invoice Prefix</ShadLabel>
            <InvoiceSelectPrefix id="invoice-prefix" class="w-full" />
          </div>
          <div class="space-y-1 w-1/2">
            <ShadLabel for="invoice-number">Invoice number</ShadLabel>
            <ShadInput id="invoice-number" type="string" placeholder="2/3-ABC" />
          </div>
        </div>
        <div class="space-y-1">
          <ShadLabel for="currency">Currency</ShadLabel>
          <SelectCurrency class="w-full" v-model="currency" />
        </div>
        <div class="flex gap-2">
          <div class="space-y-1 w-1/2">
            <ShadLabel for="issue-date">Issue Date</ShadLabel>
            <SelectDate class="w-full" />
          </div>
          <div class="space-y-1 w-1/2">
            <ShadLabel for="due-date">Due Date</ShadLabel>
            <SelectDate :disabled="!showDueDate" class="w-full" />
          </div>
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
          <ShadAccordion type="single" class="w-full" collapsible :unmount-on-hide="false">
            <ShadAccordionItem v-for="(_, index) in itemEntries" :key="index" :value="index.toString()">
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
                  v-model="itemEntries[index]!.entry"
                  v-model:has-errors="itemEntries[index]!.hasErrors"
                  v-model:subtotal-formatted="itemEntries[index]!.subtotalFormatted"
                  :currency="currency"
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
          <ShadAccordion type="single" class="w-full" collapsible :unmount-on-hide="false">
            <ShadAccordionItem v-for="(_, index) in taxAdjustmentEntries" :key="index" :value="index.toString()">
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
                  entry-type="tax"
                  v-model="taxAdjustmentEntries[index]!.entry"
                  v-model:has-errors="taxAdjustmentEntries[index]!.hasErrors"
                  v-model:adjustment-formatted="taxAdjustmentEntries[index]!.adjustmentFormatted"
                  :currency="currency"
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
          <ShadAccordion type="single" class="w-full" collapsible :unmount-on-hide="false">
            <ShadAccordionItem v-for="(_, index) in discountAdjustmentEntries" :key="index" :value="index.toString()">
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
                  entry-type="discount"
                  v-model="discountAdjustmentEntries[index]!.entry"
                  v-model:has-errors="discountAdjustmentEntries[index]!.hasErrors"
                  v-model:adjustment-formatted="discountAdjustmentEntries[index]!.adjustmentFormatted"
                  :currency="currency"
                />
              </ShadAccordionContent>
            </ShadAccordionItem>
          </ShadAccordion>
        </section>
      </section>
    </form>
    <div class="w-2/3 bg-zinc-50"></div>
  </section>
</template>
