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
import { ArrowUpDown, MoreVertical, User2, ReceiptText } from 'lucide-vue-next';
import { ShadButton, ShadCheckbox } from '#components';
import type { InvoiceSchema } from '~~/shared/schemas/invoice';
import { calculateInvoiceTotal } from '~~/lib/valuation';
import { formatCurrency } from '~~/lib/formatting';
import { formatDateFromStr } from '~~/shared/utils/general';

const { invoices } = storeToRefs(useInvoicesStore());
const clientsStore = useClientsStore();
const invoicePrefixesStore = useInvoicePrefixesStore();
const itemsStore = useItemsStore();

const columns: ColumnDef<InvoiceSchema>[] = [
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
    accessorKey: 'clientId',
    header: () => h('div', { class: 'capitalize' }, 'Client'),
    cell: ({ row }) => {
      const client = clientsStore.findById(row.original.clientId);
      return client
        ? h(
            ShadButton,
            {
              variant: 'ghost',
              class: '-ml-4',
            },
            () => [h(User2, { class: 'h-4 w-4' }), client.name]
          )
        : h('div', { class: 'italic' }, 'Unknown Client');
    },
  },
  {
    accessorKey: 'subject',
    header: ({ column }) => {
      return h(
        ShadButton,
        {
          variant: 'ghost',
          class: '!pl-0',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Subject', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      );
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('subject')),
  },
  {
    accessorKey: 'number',
    header: ({ column }) => {
      return h(
        ShadButton,
        {
          variant: 'ghost',
          class: '!pl-0',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Invoice Number', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      );
    },
    cell: ({ row }) => {
      const prefix = invoicePrefixesStore.findById(row.original.prefixId) ?? { name: 'Unknown' };
      return h('div', { class: 'capitalize' }, `${prefix.name}-${row.original.number}`);
    },
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
    cell: ({ row }) => {
      const date = formatDateFromStr(row.getValue('date'));
      return h('div', { class: 'capitalize' }, date);
    },
  },
  {
    accessorKey: 'total',
    header: ({ column }) => {
      return h(
        ShadButton,
        {
          variant: 'ghost',
          class: '!pl-0',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Total', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      );
    },
    cell: ({ row }) => {
      const total = calculateInvoiceTotal(row.original, itemsStore.findById);
      return h('div', { class: 'capitalize' }, formatCurrency(row.original.currency, total));
    },
  },
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
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;
      return h('div', { class: 'capitalize' }, dueDate ? formatDateFromStr(dueDate) : '');
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return h(
        ShadButton,
        {
          variant: 'ghost',
          class: 'w-8 h-8 p-0',
        },
        () => [h(MoreVertical, { class: 'h-4 w-4' })]
      );
    },
  },
];

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});

const table = useVueTable({
  data: invoices.value,
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
          :model-value="table.getColumn('subject')?.getFilterValue() as string"
          @update:model-value="table.getColumn('subject')?.setFilterValue($event)"
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
      <div class="flex items-center gap-2">
        <ShadButton>
          <ReceiptText />
          New Invoice
        </ShadButton>
      </div>
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
