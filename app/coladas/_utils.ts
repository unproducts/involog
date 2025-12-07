export const DEFAULT_STALE_TIME = 1000 * 60 * 24;

export type BaselineMutation = { mutate: (params: any) => void; isPending: boolean };

export type { MutationStatus, QueryStatus } from '@tanstack/vue-query';
