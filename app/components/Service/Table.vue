<script setup lang="ts">
import type { ColumnDef, ColumnFiltersState, ExpandedState, SortingState, VisibilityState } from '@tanstack/vue-table';
import { valueUpdater } from '~/lib/utils';
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import { ArrowUpDown, MoreVertical } from 'lucide-vue-next';
import { ShadButton, ShadCheckbox } from '#components';
import DropdownAction from './EditDropdown.vue';
import type { ServiceSchema } from '~~/shared/schemas/services';

const props = defineProps<{
  services: ServiceSchema[];
}>();

const columns: ColumnDef<ServiceSchema>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(ShadCheckbox, {
        modelValue: table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
        'onUpdate:modelValue': (value) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all services',
      }),
    cell: ({ row }) =>
      h(ShadCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value) => row.toggleSelected(!!value),
        ariaLabel: 'Select service',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return h(
        ShadButton,
        {
          variant: 'ghost',
          class: '!pl-0',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Name', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      );
    },
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('name')),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return h(
        ShadButton,
        {
          variant: 'ghost',
          class: '!pl-0',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Price', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      );
    },
    cell: ({ row }) => {
      let priceRaw = row.getValue('price') as string | number | undefined;
      if (!priceRaw) {
        return h('div', { class: 'italic' }, 'Unknown Price');
      }

      try {
        priceRaw = Number(priceRaw);
      } catch (e) {
        return h('div', { class: 'italic' }, 'Invalid Price');
      }

      const currency = row.original.currency;
      const price = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(priceRaw);

      return h('div', {}, price);
    },
  },

  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return h(DropdownAction, {
        service: row.original,
      });
    },
  },
];

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});

const showBulkActions = computed(() => Object.keys(rowSelection.value).length > 0);
const selectedServices = computed(
  () => Object.keys(rowSelection.value).map((index) => props.services[Number(index)]) || []
) as ComputedRef<ServiceSchema[]>;

const table = useVueTable({
  data: props.services,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
    get expanded() {
      return expanded.value;
    },
  },
});
</script>

<template>
  <div class="w-full">
    <div class="flex items-center pb-4">
      <ShadInput
        class="max-w-sm"
        placeholder="Filter services..."
        :model-value="table.getColumn('name')?.getFilterValue() as string"
        @update:model-value="table.getColumn('name')?.setFilterValue($event)"
      />
      <ShadDropdownMenu>
        <ShadDropdownMenuTrigger as-child>
          <ShadButton variant="ghost" class="w-8 h-8 p-0 ml-2">
            <span class="sr-only">Open menu</span>
            <MoreVertical class="w-4 h-4" />
          </ShadButton>
        </ShadDropdownMenuTrigger>
        <ShadDropdownMenuContent align="end">
          <ShadDropdownMenuCheckboxItem
            v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
            :key="column.id"
            class="capitalize"
            :model-value="column.getIsVisible()"
            @update:model-value="
              (value) => {
                column.toggleVisibility(!!value);
              }
            "
          >
            {{ column.id }}
          </ShadDropdownMenuCheckboxItem>
        </ShadDropdownMenuContent>
      </ShadDropdownMenu>
      <ServiceEditDropdownBulk :services="selectedServices" v-if="showBulkActions" />
      <ServiceEditOrCreateTrigger v-else>
        <ShadButton as="span"> New Service </ShadButton>
      </ServiceEditOrCreateTrigger>
    </div>
    <div class="rounded-md border w-full overflow-auto">
      <ShadTable>
        <ShadTableHeader>
          <ShadTableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <ShadTableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </ShadTableHead>
          </ShadTableRow>
        </ShadTableHeader>
        <ShadTableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <ShadTableRow :data-state="row.getIsSelected() && 'selected'">
                <ShadTableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </ShadTableCell>
              </ShadTableRow>
              <ShadTableRow v-if="row.getIsExpanded()">
                <ShadTableCell :colspan="row.getAllCells().length">
                  {{ JSON.stringify(row.original) }}
                </ShadTableCell>
              </ShadTableRow>
            </template>
          </template>

          <ShadTableRow v-else>
            <ShadTableCell :colspan="columns.length" class="h-24 text-center"> No results. </ShadTableCell>
          </ShadTableRow>
        </ShadTableBody>
      </ShadTable>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredSelectedRowModel().rows.length }} of {{ table.getFilteredRowModel().rows.length }} row(s)
        selected.
      </div>
      <div class="space-x-2">
        <ShadButton variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
          Previous
        </ShadButton>
        <ShadButton variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
          Next
        </ShadButton>
      </div>
    </div>
  </div>
</template>
