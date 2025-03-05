<script setup lang="ts">
import type { LucideIcon } from 'lucide-vue-next';

defineProps<{
  title: string;
  icon: LucideIcon;
}>();
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2">
    <div class="flex items-center gap-2 px-4">
      <ShadSidebarTrigger class="-ml-1 text-stone-900" />
      <ShadSeparator orientation="vertical" class="mr-2 h-4" />
      <span class="text-xl font-bold text-stone-900">{{ title }}</span>
    </div>
  </header>
  <section class="w-full h-full p-4">
    <slot />
  </section>
</template>
