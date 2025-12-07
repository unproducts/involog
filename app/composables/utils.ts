import type { WatchStopHandle } from 'vue';
import type { MutationStatus } from '@tanstack/vue-query';

export function useCombinedStatus(statuses: Ref<MutationStatus>[]) {
  return computed<MutationStatus>(() => {
    // If any of the statuses is error, return error
    if (statuses.some((status) => status.value === 'error')) {
      return 'error';
    } else if (statuses.every((status) => status.value === 'success')) {
      return 'success';
    } else if (statuses.some((status) => status.value === 'pending')) {
      // If any status is pending, return pending
      return 'pending';
    } else {
      // Default to idle
      return 'idle';
    }
  });
}

export function useStopHandles() {
  const stopHandles: WatchStopHandle[] = [];

  onUnmounted(() => {
    if (stopHandles.length > 0) {
      stopHandles.forEach((stopHandle) => {
        stopHandle();
      });
    }
  });

  return {
    stopHandles,
  };
}
