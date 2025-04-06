<script setup lang="ts">
import { ReceiptText } from 'lucide-vue-next';
</script>

<template>
  <AppPage title="Invoices" :icon="ReceiptText">
    <InvoiceEditOrCreate />
  </AppPage>
</template>
