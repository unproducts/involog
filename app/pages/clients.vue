<script setup lang="ts">
import { Users } from 'lucide-vue-next';

const { clients } = useClients();
</script>

<template>
  <AppPage title="Clients" :icon="Users">
    <ClientTable :clients />
  </AppPage>
</template>
