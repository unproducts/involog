<script setup lang="ts">
import type { ListboxRootEmits, ListboxRootProps } from 'reka-ui';
import { cn } from '@/lib/utils';
import { ListboxRoot, useFilter, useForwardPropsEmits } from 'reka-ui';
import { computed, type HTMLAttributes, reactive, ref, watch } from 'vue';
import { provideCommandContext } from '.';
import { useVModel } from '@vueuse/core';

const props = withDefaults(defineProps<ListboxRootProps & { class?: HTMLAttributes['class']; query?: string }>(), {
  modelValue: '',
  query: '',
});

const emits = defineEmits<
  ListboxRootEmits & {
    'update:query': (value: string) => void;
  }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);

const allItems = ref<Map<string, string | null>>(new Map());
const allGroups = ref<Map<string, Set<string>>>(new Map());

const { contains } = useFilter({ sensitivity: 'base' });
const filterState = reactive({
  search: '',
  filtered: {
    /** The count of all visible items. */
    count: 0,
    /** Map from visible item id to its search score. */
    items: new Map() as Map<string, number>,
    /** Set of groups with at least one visible item. */
    groups: new Set() as Set<string>,
  },
});

const query = useVModel(props, 'query');
watch(
  () => filterState.search,
  () => (query.value = filterState.search)
);

function filterItems() {
  if (!filterState.search) {
    filterState.filtered.count = allItems.value.size;
    // Do nothing, each item will know to show itself because search is empty
    return;
  }

  // Reset the groups
  filterState.filtered.groups = new Set();
  let itemCount = 0;

  // Check which items should be included
  for (const [id, value] of allItems.value) {
    let score = false;
    if (value === null) {
      // If value is null, it means it's a special item that should always be shown,
      // except if exact same item exists;
      // score = !allItems.value.values().some((v) => v === filterState.search);
      console.log('Item with id:', id, 'is null', filterState.search, !!filterState.search);
      score = !!filterState.search;
    } else {
      score = contains(value, filterState.search);
    }
    filterState.filtered.items.set(id, score ? 1 : 0);
    if (score) itemCount++;
  }

  // Check which groups have at least 1 item shown
  for (const [groupId, group] of allGroups.value) {
    for (const itemId of group) {
      if (filterState.filtered.items.get(itemId)! > 0) {
        filterState.filtered.groups.add(groupId);
        break;
      }
    }
  }

  filterState.filtered.count = itemCount;
}

function handleSelect() {
  filterState.search = '';
}

watch(
  () => filterState.search,
  () => {
    filterItems();
  }
);

provideCommandContext({
  allItems,
  allGroups,
  filterState,
});
</script>

<template>
  <ListboxRoot
    v-bind="forwarded"
    :class="
      cn(
        'flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-stone-950 dark:bg-stone-950 dark:text-stone-50',
        props.class
      )
    "
  >
    <slot />
  </ListboxRoot>
</template>
