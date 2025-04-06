<script setup lang="ts">
import { SelectIcon, type SelectIconProps } from 'reka-ui';

const props = defineProps<SelectIconProps>();
</script>

<template>
  <SelectIcon v-bind="props">
    <slot />
  </SelectIcon>
</template>
