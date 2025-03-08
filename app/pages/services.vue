<script setup lang="ts">
import { ChartNoAxesGantt } from 'lucide-vue-next';

const { services } = useServices();
</script>

<template>
  <AppPage title="Services" :icon="ChartNoAxesGantt">
    <ServiceTable :services />
  </AppPage>
</template>
