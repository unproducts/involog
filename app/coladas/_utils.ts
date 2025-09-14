export const DEFAULT_STALE_TIME = 1000 * 60 * 24;

export type BaselineMutation = { mutate: (params: any) => void; isLoading: boolean };

export type { DataStateStatus } from '@pinia/colada';
