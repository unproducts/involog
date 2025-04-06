<script setup lang="ts">
import { Users } from 'lucide-vue-next';
</script>

<template>
  <AppPage title="Clients" :icon="Users">
    <ClientTable />
  </AppPage>
</template>
