<script setup lang="ts">
import { cn } from '@/lib/utils';
import { useVModel } from '@vueuse/core';
import { Check, ReceiptText, Plus } from 'lucide-vue-next';

const props = defineProps<{
  modelValue?: string;
}>();

const selectedValue = useVModel(props, 'modelValue');

const invoicePrefixesStore = useInvoicePrefixesStore();
const { invoicePrefixes } = storeToRefs(invoicePrefixesStore);

const open = ref(false);
const query = ref('');

const createNewPrefix = async () => {
  if (query.value.length === 0) return;
  // const prefix = await create({ name: query.value });
  // selectedId.value = prefix.id;
  // open.value = false;
};

const showCreateNewPrefix = computed(
  () => query.value.length > 0 && !invoicePrefixes.value.map((p) => p.name).includes(query.value)
);
</script>

<template>
  <ShadPopover v-model:open="open">
    <ShadPopoverTrigger :value="selectedValue">
      <template #icon>
        <ReceiptText class="h-4 w-4 -ml-1" />
      </template>
      <template #trigger> Select prefix </template>
      <template #value>
        {{ invoicePrefixesStore.findById(selectedValue!)?.name }}
      </template>
    </ShadPopoverTrigger>
    <ShadPopoverContent align="start">
      <ShadCommand v-model="selectedValue" v-model:query="query" aria-label="Select prefix">
        <ShadCommandInput placeholder="Search prefix..." />
        <ShadCommandList>
          <ShadCommandGroup>
            <ShadCommandItem
              v-for="prefix in invoicePrefixes"
              :key="prefix.id"
              :value="prefix.id"
              @select="open = false"
            >
              <Check :class="cn('mr-2 h-4 w-4', selectedValue === prefix.id ? 'opacity-100' : 'opacity-0')" />
              {{ prefix.name }}
            </ShadCommandItem>
            <ShadCommandItem :value="null" @select="createNewPrefix" v-if="showCreateNewPrefix">
              <Plus class="mr-2 h-4 w-4" />
              Create "{{ query }}"
            </ShadCommandItem>
          </ShadCommandGroup>
        </ShadCommandList>
      </ShadCommand>
    </ShadPopoverContent>
  </ShadPopover>
</template>
