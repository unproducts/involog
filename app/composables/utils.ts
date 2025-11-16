import type { WatchStopHandle } from 'vue';

export function useCombinedStatus(statuses: Ref<DataStateStatus>[]) {
  return computed<DataStateStatus>(() => {
    // If any of the statuses is error, return error
    if (statuses.some((status) => status.value === 'error')) {
      return 'error';
    } else if (
      // If any of the statuses is success and no error, return success
      statuses.some((status) => status.value === 'success') &&
      !statuses.some((status) => status.value === 'error')
    ) {
      return 'success';
    } else {
      // If no statuses are error or success, return pending
      return 'pending';
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
