import {
  createTransactionSchema,
  updateTransactionSchema,
  deleteTransactionSchema,
  type CreateTransactionSchema,
  type UpdateTransactionSchema,
  type FilterTransactionsSchema,
} from '~~/shared/schemas/transaction';

export const getTransactionsColada = defineQueryOptions((params: FilterTransactionsSchema = {}) => ({
  key: ['transactions', params],
  query: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getTransactionService().fetch(params);
  },
  staleTime: DEFAULT_STALE_TIME,
}));

export const getTransactionByIdColada = defineQueryOptions((params: { id: string }) => ({
  key: ['transactions', params.id],
  query: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getTransactionService().fetchById(params.id);
  },
  staleTime: DEFAULT_STALE_TIME,
}));

export const useCreateTransactionMutation = () => {
  const { refetch } = useQuery(getTransactionsColada({}));
  return useMutation({
    async mutation(rawParams: CreateTransactionSchema) {
      const params = createTransactionSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getTransactionService().create(params);
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error creating transaction', error);
    },
  });
};

export const useUpdateTransactionMutation = () => {
  return useMutation({
    async mutation(rawParams: UpdateTransactionSchema) {
      const params = updateTransactionSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getTransactionService().update(params);
    },
    onSuccess: (_, vars) => {
      const { refetch: refetchTransactions } = useQuery(getTransactionsColada({}));
      const { refetch: refetchTransaction } = useQuery(getTransactionByIdColada({ id: vars.id }));
      refetchTransaction();
      refetchTransactions();
    },
    onError: (error) => {
      console.error('Error updating transaction', error);
    },
  });
};

export const useDeleteTransactionMutation = (params: { id: string }) => {
  const { refetch: refetchTransaction } = useQuery(getTransactionByIdColada(params));
  const { refetch: refetchTransactions } = useQuery(getTransactionsColada({}));
  return useMutation({
    async mutation() {
      const deleteParams = deleteTransactionSchema.parse({ id: params.id });
      const dataGateway = await useDataGateway();
      return dataGateway.getTransactionService().delete(deleteParams);
    },
    onSuccess: () => {
      refetchTransaction();
      refetchTransactions();
    },
    onError: (error) => {
      console.error('Error deleting transaction', error);
    },
  });
};
