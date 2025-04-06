<script setup lang="ts">
import type { InvoiceAdjustmentEntries, InvoiceItemEntries } from '#components';
import type { DiscountEntrySchema, ItemEntrySchema, TaxEntrySchema } from '~~/shared/schemas/invoice';

const clientsStore = useClientsStore();
const { clients } = storeToRefs(clientsStore);
const clientId = ref<string>();
const client = computed(() => (clientId.value ? clientsStore.findById(clientId.value) : null));
const showDueDate = ref(false);
const itemEntries = ref<ItemEntrySchema[]>([]);

const taxEntries = ref<TaxEntrySchema[]>([]);
const discountEntries = ref<DiscountEntrySchema[]>([]);

const invoiceItemEntryComponent = ref<InstanceType<typeof InvoiceItemEntries>>();
const invoiceTaxEntryAdjustmentComponent = ref<InstanceType<typeof InvoiceAdjustmentEntries>>();
const invoiceDiscountEntryAdjustmentComponent = ref<InstanceType<typeof InvoiceAdjustmentEntries>>();
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
          <SelectCurrency class="w-full" />
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
          <ShadButton
            type="button"
            size="xs"
            variant="outline-subtle"
            @click="invoiceItemEntryComponent.addItemEntry"
            v-if="invoiceItemEntryComponent"
          >
            Add
          </ShadButton>
        </div>
        <InvoiceItemEntries ref="invoiceItemEntryComponent" v-model="itemEntries" />
      </section>
      <section class="space-y-2 border-zinc-200" :class="{ 'border-b': taxEntries.length === 0 }">
        <div class="flex justify-between items-center">
          <div class="text-base font-semibold">Taxes</div>
          <ShadButton
            type="button"
            size="xs"
            variant="outline-subtle"
            @click="invoiceTaxEntryAdjustmentComponent.addAdjustmentEntry"
            v-if="invoiceTaxEntryAdjustmentComponent"
          >
            Add
          </ShadButton>
        </div>
        <InvoiceAdjustmentEntries ref="invoiceTaxEntryAdjustmentComponent" v-model="taxEntries" entry-type="tax" />
      </section>
      <section class="space-y-2 border-zinc-200" :class="{ 'border-b': discountEntries.length === 0 }">
        <div class="flex justify-between items-center">
          <div class="text-base font-semibold">Discounts</div>
          <ShadButton
            type="button"
            size="xs"
            variant="outline-subtle"
            @click="invoiceDiscountEntryAdjustmentComponent.addAdjustmentEntry"
            v-if="invoiceDiscountEntryAdjustmentComponent"
          >
            Add
          </ShadButton>
        </div>
        <InvoiceAdjustmentEntries
          ref="invoiceDiscountEntryAdjustmentComponent"
          v-model="discountEntries"
          entry-type="discount"
        />
      </section>
    </form>
    <div class="w-2/3 bg-zinc-50"></div>
  </section>
</template>
