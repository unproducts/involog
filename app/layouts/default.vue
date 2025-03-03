<template>
  <ShadSidebarProvider>
    <AppSidebar />
    <ShadSidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2">
        <div class="flex items-center gap-2 px-4">
          <ShadSidebarTrigger class="-ml-1" />
          <ShadSeparator orientation="vertical" class="mr-2 h-4" />
          <ShadBreadcrumb>
            <ShadBreadcrumbList>
              <ShadBreadcrumbItem class="hidden md:block">
                <ShadBreadcrumbLink href="#"> Dashboard </ShadBreadcrumbLink>
              </ShadBreadcrumbItem>
              <ShadBreadcrumbSeparator class="hidden md:block" />
              <ShadBreadcrumbItem>
                <ShadBreadcrumbPage>Overview</ShadBreadcrumbPage>
              </ShadBreadcrumbItem>
            </ShadBreadcrumbList>
          </ShadBreadcrumb>
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div class="grid auto-rows-min gap-4 md:grid-cols-3">
          <div class="aspect-video rounded-xl bg-muted/50" />
          <div class="aspect-video rounded-xl bg-muted/50" />
          <div class="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </ShadSidebarInset>
  </ShadSidebarProvider>
</template>
