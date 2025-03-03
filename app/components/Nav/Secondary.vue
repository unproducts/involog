<script setup lang="ts">
import type { LucideIcon } from 'lucide-vue-next';
const props = defineProps<{
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
}>();
</script>
<template>
  <ShadSidebarGroup>
    <ShadSidebarGroupContent>
      <ShadSidebarMenu>
        <ShadSidebarMenuItem v-for="item in items" :key="item.title">
          <ShadSidebarMenuButton as-child size="sm">
            <a :href="item.url">
              <component :is="item.icon" />
              <span>{{ item.title }}</span>
            </a>
          </ShadSidebarMenuButton>
        </ShadSidebarMenuItem>
      </ShadSidebarMenu>
    </ShadSidebarGroupContent>
  </ShadSidebarGroup>
</template>
