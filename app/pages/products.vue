<script setup lang="ts">
import { ShoppingCart } from 'lucide-vue-next';

const { products } = useProducts();
</script>

<template>
  <AppPage title="Products" :icon="ShoppingCart">
    <ProductTable :products />
  </AppPage>
</template>
