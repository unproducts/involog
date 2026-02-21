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
import { ArrowUpDown, MoreVertical, ReceiptText, Edit3, Filter } from 'lucide-vue-next';
import { NuxtLink, ShadButton, ShadCheckbox, ClientCell, InvoiceNumberCell, RawDateCell } from '#components';
import type { InvoiceInfoSchema, FilterInvoicesSchema } from '~~/shared/schemas/invoice';
import DropdownAction from './EditDropdown.vue';

const { data: invoicesData } = useQuery(invoicesQueryOptions({}));
const invoices = computed(() => invoicesData.value || []);

const columns: ColumnDef<InvoiceInfoSchema>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(ShadCheckbox, {
        modelValue: table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
        'onUpdate:modelValue': (value) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all invoices',
      }),
    cell: ({ row }) =>
      h(ShadCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value) => row.toggleSelected(!!value),
        ariaLabel: 'Select invoice',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'number',
    enableSorting: false,
    header: () => h('div', { class: 'font-medium' }, 'Invoice Number'),
    cell: ({ row }) => h(InvoiceNumberCell, { prefixId: row.original.prefixId, number: row.original.number }),
  },
  {
    accessorKey: 'clientId',
    enableSorting: false,
    header: () => h('div', { class: 'font-medium' }, 'Client'),
    cell: ({ row }) => h(ClientCell, { clientId: row.original.clientId, showIcon: true }),
  },
  {
    accessorKey: 'subject',
    enableSorting: false,
    header: () => h('div', { class: 'font-medium' }, 'Subject'),
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('subject')),
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return h(
        ShadButton,
        {
          variant: 'ghost',
          class: '!pl-0',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Date Issued', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      );
    },
    cell: ({ row }) => h(RawDateCell, { value: row.original.date }),
  },
  // Total requires full invoice with items; not available in info list
  {
    accessorKey: 'dueDate',
    header: ({ column }) => {
      return h(
        ShadButton,
        {
          variant: 'ghost',
          class: '!pl-0',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Due Date', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      );
    },
    cell: ({ row }) => h(RawDateCell, { value: row.original.dueDate }),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return h(DropdownAction, {
        info: row.original,
      });
    },
  },
];

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});
const showFilter = ref(false);
const filter = ref<FilterInvoicesSchema>({});
const searchString = ref('');

const table = useVueTable({
  data: invoices,
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

// Disable unnecessary columns initially.
table.getColumn('subject')?.toggleVisibility(false);
table.getColumn('dueDate')?.toggleVisibility(false);
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between gap-2 pb-4 w-full">
      <div class="flex items-center w-full gap-2">
        <ShadInput
          class="w-1/2"
          placeholder="Filter invoices..."
          :model-value="searchString"
          @update:model-value="(value) => (searchString = value.toString())"
        />
        <ShadDropdownMenu>
          <ShadDropdownMenuTrigger as-child>
            <ShadButton variant="ghost" class="w-8 h-8 p-0">
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
      </div>
      <ShadToggle variant="outline" v-model="showFilter" as-child>
        <ShadButton variant="ghost" class="w-8 h-8 p-0">
          <span class="sr-only">Toggle filter</span>
          <Filter class="w-4 h-4" />
        </ShadButton>
      </ShadToggle>
      <div class="flex items-center gap-2">
        <ShadButton :as="NuxtLink" to="/invoices/new">
          <ReceiptText />
          New Invoice
        </ShadButton>
      </div>
    </div>
    <FrameTransition>
      <InvoiceTableFilter v-if="showFilter" v-model="filter" v-model:search-string="searchString" />
    </FrameTransition>
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
