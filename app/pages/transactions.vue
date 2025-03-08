<script setup lang="ts">
import { ArrowRightLeft, MoveDownRight, MoveUpLeft } from 'lucide-vue-next';
const { transactions } = useTransactions();
</script>

<template>
  <AppPage title="Transactions" :icon="ArrowRightLeft">
    <div class="space-x-2">
      <TransactionEditOrCreateTrigger type="I">
        <ShadButton as="span"> <MoveDownRight /> New Income </ShadButton>
      </TransactionEditOrCreateTrigger>
      <TransactionEditOrCreateTrigger type="E">
        <ShadButton variant="secondary" as="span"> <MoveUpLeft /> New Expense </ShadButton>
      </TransactionEditOrCreateTrigger>
    </div>
    <TransactionTable class="mt-4" :transactions />
  </AppPage>
</template>
