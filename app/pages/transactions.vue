<script setup lang="ts">
import { ArrowRightLeft } from 'lucide-vue-next';
</script>

<template>
  <AppPage title="Transactions" :icon="ArrowRightLeft">
    <TransactionTable class="mt-4" />
  </AppPage>
</template>
