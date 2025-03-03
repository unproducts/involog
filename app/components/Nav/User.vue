<script setup lang="ts">
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from 'lucide-vue-next';
import { useSidebar } from '@/components/Ui/sidebar';

defineProps<{
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}>();
const { isMobile } = useSidebar();
</script>
<template>
  <ShadSidebarMenu>
    <ShadSidebarMenuItem>
      <ShadDropdownMenu>
        <ShadDropdownMenuTrigger as-child>
          <ShadSidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <ShadAvatar class="h-8 w-8 rounded-lg">
              <ShadAvatarImage :src="user.avatar" :alt="user.name" />
              <ShadAvatarFallback class="rounded-lg"> AD </ShadAvatarFallback>
            </ShadAvatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{{ user.name }}</span>
              <span class="truncate text-xs">{{ user.email }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </ShadSidebarMenuButton>
        </ShadDropdownMenuTrigger>
        <ShadDropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <ShadDropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <ShadAvatar class="h-8 w-8 rounded-lg">
                <ShadAvatarImage :src="user.avatar" :alt="user.name" />
                <ShadAvatarFallback class="rounded-lg"> CN </ShadAvatarFallback>
              </ShadAvatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ user.name }}</span>
                <span class="truncate text-xs">{{ user.email }}</span>
              </div>
            </div>
          </ShadDropdownMenuLabel>
          <ShadDropdownMenuSeparator />
          <ShadDropdownMenuGroup>
            <ShadDropdownMenuItem>
              <Sparkles />
              Upgrade to Pro
            </ShadDropdownMenuItem>
          </ShadDropdownMenuGroup>
          <ShadDropdownMenuSeparator />
          <ShadDropdownMenuGroup>
            <ShadDropdownMenuItem>
              <BadgeCheck />
              Account
            </ShadDropdownMenuItem>
            <ShadDropdownMenuItem>
              <CreditCard />
              Billing
            </ShadDropdownMenuItem>
            <ShadDropdownMenuItem>
              <Bell />
              Notifications
            </ShadDropdownMenuItem>
          </ShadDropdownMenuGroup>
          <ShadDropdownMenuSeparator />
          <ShadDropdownMenuItem>
            <LogOut />
            Log out
          </ShadDropdownMenuItem>
        </ShadDropdownMenuContent>
      </ShadDropdownMenu>
    </ShadSidebarMenuItem>
  </ShadSidebarMenu>
</template>
