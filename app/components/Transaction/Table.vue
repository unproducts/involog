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
import { ArrowUpDown, MoreVertical, MoveDownRight, MoveUpLeft, User, User2, Users } from 'lucide-vue-next';
import { ShadBadge, ShadButton, ShadCheckbox } from '#components';
import DropdownAction from './EditDropdown.vue';
import { countryDetailsMap } from '~~/shared/consts/countries';
import type { TransactionSchema } from '~~/shared/schemas/transactions';
import {
  expenseCategories,
  expenseCategoriesMap,
  incomeCategoriesMap,
  incomeCategoryDetails,
} from '~~/shared/consts/transactions';

const props = defineProps<{
  transactions: TransactionSchema[];
}>();

const transactions = toRef(() => props.transactions);

const { findById } = useClients();

const columns: ColumnDef<TransactionSchema>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(ShadCheckbox, {
        modelValue: table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
        'onUpdate:modelValue': (value) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all transactions',
      }),
    cell: ({ row }) =>
      h(ShadCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value) => row.toggleSelected(!!value),
        ariaLabel: 'Select transaction',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return h(
        ShadButton,
        {
          variant: 'ghost',
          class: '!pl-0',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Description', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      );
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('description')),
  },
  {
    accessorKey: 'merchant-client',
    header: () => h('div', { class: 'capitalize' }, 'Merchant/Client'),
    cell: ({ row }) => {
      // let displayValue = row.original.merchant;
      if (row.original.clientId) {
        const client = findById(row.original.clientId);
        return client
          ? h(
              ShadButton,
              {
                variant: 'ghost',
                class: '-ml-4',
                // TODO: implement this.
                // onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
              },
              () => [h(User2, { class: 'h-4 w-4' }), client.name]
            )
          : h('div', { class: 'italic' }, 'Unknown Client');
      } else if (row.original.merchant) {
        return h('div', { class: 'capitalize' }, row.original.merchant);
      }
      return h('div', { class: 'italic' }, 'No Merchant Specified');
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => {
      return h(
        ShadButton,
        {
          variant: 'ghost',
          class: '!pl-0',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Income/Expense', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      );
    },
    cell: ({ row }) => {
      const variant = row.getValue('type') === 'I' ? 'default' : 'secondary';
      const type = row.getValue('type') === 'I' ? 'Income' : 'Expense';
      return h(ShadBadge, { class: 'w-18 text-center', variant }, () => [
        h(type == 'Income' ? MoveDownRight : MoveUpLeft, { class: 'h-3 w-3 mr-1' }),
        type,
      ]);
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return h(
        ShadButton,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Category', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      );
    },
    cell: ({ row }) => {
      const categoryKey = row.getValue('category') as string;
      const type = row.getValue('type');
      // @ts-expect-error categoryKey type
      const category = type === 'I' ? incomeCategoriesMap[categoryKey] : expenseCategoriesMap[categoryKey];
      return h(ShadButton, { variant: 'ghost' }, () => category);
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return h(
        ShadButton,
        {
          variant: 'ghost',
          class: '!pl-0',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Amount', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      );
    },
    cell: ({ row }) => {
      const type = row.getValue('type') === 'I' ? 'Income' : 'Expense';
      let amountRaw = row.getValue('amount') as string | number | undefined;
      if (!amountRaw) {
        return h('div', { class: 'italic' }, 'Unknown Amount');
      }

      try {
        amountRaw = Number(amountRaw);
      } catch (e) {
        return h('div', { class: 'italic' }, 'Invalid Amount');
      }

      const currency = row.original.currency;
      const amount = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(amountRaw);

      return h('div', { class: [type === 'Expense' && 'text-rose-600'] }, amount);
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return h(DropdownAction, {
        transaction: row.original,
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
const selectedTransactions = computed(
  () => Object.keys(rowSelection.value).map((index) => props.transactions[Number(index)]) || []
) as ComputedRef<TransactionSchema[]>;

const table = useVueTable({
  data: transactions,
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
table.getColumn('description')?.toggleVisibility(false);
</script>

<template>
  <div class="w-full">
    <div class="flex items-center pb-4">
      <ShadInput
        class="max-w-sm"
        placeholder="Filter transactions..."
        :model-value="table.getColumn('description')?.getFilterValue() as string"
        @update:model-value="table.getColumn('description')?.setFilterValue($event)"
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
      <TransactionEditDropdownBulk :transactions="selectedTransactions" v-if="showBulkActions" />
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
