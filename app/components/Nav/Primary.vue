<script setup lang="ts">
import { type LucideIcon } from 'lucide-vue-next';

defineProps<{
  items: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}>();

const route = useRoute();
</script>
<template>
  <ShadSidebarGroup>
    <ShadSidebarGroupLabel>Menu</ShadSidebarGroupLabel>
    <ShadSidebarMenu>
      <ShadSidebarMenuItem v-for="item in items" :key="item.name" :is-active="item.url === route.path">
        <ShadSidebarMenuButton as-child>
          <NuxtLink :to="item.url">
            <component :is="item.icon" />
            <span>{{ item.name }}</span>
          </NuxtLink>
        </ShadSidebarMenuButton>
      </ShadSidebarMenuItem>
    </ShadSidebarMenu>
  </ShadSidebarGroup>
</template>
