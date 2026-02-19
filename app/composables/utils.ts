import type { WatchStopHandle } from 'vue';
import type { MutationStatus } from '@tanstack/vue-query';

export function useCombinedStatus(statuses: Ref<MutationStatus>[]) {
  return computed<MutationStatus>(() => {
    const values = statuses.map((status) => status.value);
    const hasPending = values.includes('pending');
    const hasError = values.includes('error');
    const hasSuccess = values.includes('success');

    if (hasPending) {
      return 'pending';
    }
    if (hasError) {
      return 'error';
    }
    if (hasSuccess) {
      return 'success';
    }
    return 'idle';
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
