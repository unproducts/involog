<script setup lang="ts">
import { Folder, Forward, type LucideIcon, MoreHorizontal, Trash2 } from 'lucide-vue-next';
import { useSidebar } from '@/components/Ui/sidebar';
defineProps<{
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}>();
const { isMobile } = useSidebar();
</script>
<template>
  <ShadSidebarGroup class="group-data-[collapsible=icon]:hidden">
    <ShadSidebarGroupLabel>Menu</ShadSidebarGroupLabel>
    <ShadSidebarMenu>
      <ShadSidebarMenuItem v-for="item in projects" :key="item.name">
        <ShadSidebarMenuButton as-child>
          <a :href="item.url">
            <component :is="item.icon" />
            <span>{{ item.name }}</span>
          </a>
        </ShadSidebarMenuButton>
        <ShadDropdownMenu>
          <ShadDropdownMenuTrigger as-child>
            <ShadSidebarMenuAction show-on-hover>
              <MoreHorizontal />
              <span class="sr-only">More</span>
            </ShadSidebarMenuAction>
          </ShadDropdownMenuTrigger>
          <ShadDropdownMenuContent
            class="w-48 rounded-lg"
            :side="isMobile ? 'bottom' : 'right'"
            :align="isMobile ? 'end' : 'start'"
          >
            <ShadDropdownMenuItem>
              <Folder class="text-muted-foreground" />
              <span>View Project</span>
            </ShadDropdownMenuItem>
            <ShadDropdownMenuItem>
              <Forward class="text-muted-foreground" />
              <span>Share Project</span>
            </ShadDropdownMenuItem>
            <ShadDropdownMenuSeparator />
            <ShadDropdownMenuItem>
              <Trash2 class="text-muted-foreground" />
              <span>Delete Project</span>
            </ShadDropdownMenuItem>
          </ShadDropdownMenuContent>
        </ShadDropdownMenu>
      </ShadSidebarMenuItem>
    </ShadSidebarMenu>
  </ShadSidebarGroup>
</template>
