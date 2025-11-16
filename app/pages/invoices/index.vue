<script setup lang="ts">
import { ReceiptText } from 'lucide-vue-next';
</script>

<template>
  <AppPage title="Invoices" :icon="ReceiptText">
    <InvoiceTable class="mt-4" />
  </AppPage>
</template>
