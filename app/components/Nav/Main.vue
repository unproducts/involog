<script setup lang="ts">
import { ChevronRight, type LucideIcon } from 'lucide-vue-next';
defineProps<{
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}>();
</script>
<template>
  <ShadSidebarGroup>
    <ShadSidebarGroupLabel>Platform</ShadSidebarGroupLabel>
    <ShadSidebarMenu>
      <ShadCollapsible v-for="item in items" :key="item.title" as-child :default-open="item.isActive">
        <ShadSidebarMenuItem>
          <ShadSidebarMenuButton as-child :tooltip="item.title">
            <a :href="item.url">
              <component :is="item.icon" />
              <span>{{ item.title }}</span>
            </a>
          </ShadSidebarMenuButton>
          <template v-if="item.items?.length">
            <ShadCollapsibleTrigger as-child>
              <ShadSidebarMenuAction class="data-[state=open]:rotate-90">
                <ChevronRight />
                <span class="sr-only">Toggle</span>
              </ShadSidebarMenuAction>
            </ShadCollapsibleTrigger>
            <ShadCollapsibleContent>
              <ShadSidebarMenuSub>
                <ShadSidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                  <ShadSidebarMenuSubButton as-child>
                    <a :href="subItem.url">
                      <span>{{ subItem.title }}</span>
                    </a>
                  </ShadSidebarMenuSubButton>
                </ShadSidebarMenuSubItem>
              </ShadSidebarMenuSub>
            </ShadCollapsibleContent>
          </template>
        </ShadSidebarMenuItem>
      </ShadCollapsible>
    </ShadSidebarMenu>
  </ShadSidebarGroup>
</template>
