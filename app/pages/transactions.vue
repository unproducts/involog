<script setup lang="ts">
import { ArrowRightLeft } from 'lucide-vue-next';
</script>

<template>
  <AppPage title="Transactions" :icon="ArrowRightLeft">
    <div class="space-x-2">
      <TransactionEditOrCreateTrigger type="I">
        <ShadButton as="span"> New Income </ShadButton>
      </TransactionEditOrCreateTrigger>
      <TransactionEditOrCreateTrigger type="E">
        <ShadButton variant="secondary" as="span"> New Expense </ShadButton>
      </TransactionEditOrCreateTrigger>
    </div>
  </AppPage>
</template>
