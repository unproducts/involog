<script setup lang="ts">
import type { SidebarProps } from '@/components/Ui/sidebar';

import {
  Command,
  LifeBuoy,
  Send,
  House,
  Users,
  ReceiptText,
  ArrowRightLeft,
  ChartNoAxesGantt,
  Settings,
} from 'lucide-vue-next';

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: 'inset',
});
const data = {
  user: {
    name: 'Aman Desai',
    email: 'aman@knackline.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
  projects: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: House,
    },
    {
      name: 'Clients',
      url: '/clients',
      icon: Users,
    },
    {
      name: 'Invoices',
      url: '/invoices',
      icon: ReceiptText,
    },
    {
      name: 'Transactions',
      url: '/transactions',
      icon: ArrowRightLeft,
    },
    {
      name: 'Items',
      url: '/items',
      icon: ChartNoAxesGantt,
    },
    {
      name: 'Preferences',
      url: '/preferences',
      icon: Settings,
    },
  ],
};
</script>
<template>
  <ShadSidebar v-bind="props">
    <ShadSidebarHeader>
      <ShadSidebarMenu>
        <ShadSidebarMenuItem>
          <div class="flex items-center gap-1">
            <img src="../assets/icon.svg" class="size-12" />
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-bold">Involog</span>
              <span class="truncate text-xs">v1.0.0</span>
            </div>
          </div>
        </ShadSidebarMenuItem>
      </ShadSidebarMenu>
    </ShadSidebarHeader>
    <ShadSidebarContent>
      <NavPrimary :items="data.projects" />
      <NavSecondary :items="data.navSecondary" class="mt-auto" />
    </ShadSidebarContent>
    <ShadSidebarFooter>
      <NavUser :user="data.user" />
    </ShadSidebarFooter>
  </ShadSidebar>
</template>
