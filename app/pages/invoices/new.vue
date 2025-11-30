<script setup lang="ts">
import { ReceiptText } from 'lucide-vue-next';
</script>

<template>
  <AppPage title="New Invoice" :icon="ReceiptText">
    <InvoiceEditOrCreate @submitted="navigateTo('/invoices')" />
  </AppPage>
</template>
