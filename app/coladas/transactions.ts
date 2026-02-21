import { queryOptions } from '@tanstack/vue-query';
import {
  createTransactionSchema,
  updateTransactionSchema,
  deleteTransactionSchema,
  type CreateTransactionSchema,
  type UpdateTransactionSchema,
  type FilterTransactionsSchema,
  type DeleteTransactionSchema,
} from '~~/shared/schemas/transaction';

export const transactionsQueryOptions = (params: FilterTransactionsSchema = {}) =>
  queryOptions({
    queryKey: ['transactions', params],
    queryFn: async () => {
      const dataGateway = await useDataGateway();
      return dataGateway.getTransactionService().fetch(params);
    },
    staleTime: DEFAULT_STALE_TIME,
  });

export const transactionByIdQueryOptions = (params: { id: string }) =>
  queryOptions({
    queryKey: ['transactions', params.id],
    queryFn: async () => {
      const dataGateway = await useDataGateway();
      return dataGateway.getTransactionService().fetchById(params.id);
    },
    staleTime: DEFAULT_STALE_TIME,
  });

export const useCreateTransactionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rawParams: CreateTransactionSchema) => {
      const params = createTransactionSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getTransactionService().create(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      console.error('Error creating transaction', error);
    },
  });
};

export const useUpdateTransactionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rawParams: UpdateTransactionSchema) => {
      const params = updateTransactionSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getTransactionService().update(params);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['transactions', vars.id] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      console.error('Error updating transaction', error);
    },
  });
};

export const useDeleteTransactionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rawParams: DeleteTransactionSchema) => {
      const deleteParams = deleteTransactionSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getTransactionService().delete(deleteParams);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      console.error('Error deleting transaction', error);
    },
  });
};
