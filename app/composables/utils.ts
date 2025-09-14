import type { WatchStopHandle } from 'vue';

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
