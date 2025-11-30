<script setup lang="ts">
import { ReceiptText } from 'lucide-vue-next';

const route = useRoute();

const id = route.query.id as string;

if (!id) {
  await navigateTo('/invoices/new');
}

const { data: invoice } = useQuery(getInvoiceByIdColada({ id }));
</script>

<template>
  <AppPage :title="`Edit Invoice ${invoice.number}`" :icon="ReceiptText" v-if="invoice">
    <InvoiceEditOrCreate :invoice @submitted="navigateTo('/invoices')" />
  </AppPage>
</template>
