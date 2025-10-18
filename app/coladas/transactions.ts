import {
    type MutateTransactionSchema,
    mutateTransactionSchema
} from '~~/shared/schemas/transaction';



export const getTransactionColada = defineQueryOptions(() => ({
  key: ['transactions'],
  query: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getTransactionService().fetch();
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
  const { refetch } = useQuery(getTransactionColada());
  return useMutation({
    async mutation(rawParams: MutateTransactionSchema) {
      const params = mutateTransactionSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      if(params.type == 'I'){
            return dataGateway.getTransactionService().createIncome(params);
        }
        else if(params.type == 'E') {
            return dataGateway.getTransactionService().createExpense(params);
        }
        else {
            return dataGateway.getTransactionService().create(params);
        }
      
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error creating Transaction', error);
    },
  });
};

export const useUpdateTransactionMutation = ({ id }: { id: string }) => {
  const { refetch: refetchTransaction } = useQuery(getTransactionByIdColada({ id }));
  const { refetch: refetchTransactions } = useQuery(getTransactionColada());
  return useMutation({
    async mutation(rawParams: MutateTransactionSchema) {
      const params = mutateTransactionSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
        if(params.type == 'I'){
            return dataGateway.getTransactionService().updateIncome(id, params);
        }
        else if(params.type == 'E') {
            return dataGateway.getTransactionService().updateExpense(id, params);
        }
        else {
            return dataGateway.getTransactionService().update(id, params);
        }
      
    },
    onSuccess: () => {
      refetchTransaction();
      refetchTransactions();
    },
    onError: (error) => {
      console.error('Error updating Transaction', error);
    },
  });
};

export const useDeleteTransactionMutation = (params: { id: string }) => {
  const { refetch: refetchTransaction } = useQuery(getTransactionByIdColada(params));
  const { refetch: refetchTransactions } = useQuery(getTransactionColada());
  return useMutation({
    async mutation() {
      const dataGateway = await useDataGateway();
      return dataGateway.getTransactionService().delete(params.id);
    },
    onSuccess: () => {
      refetchTransaction();
      refetchTransactions();
    },
    onError: (error) => {
      console.error('Error deleting Transaction', error);
    },
  });
};


export const useArchiveTransactiontMutation = (params: { id: string }) => {
  const { refetch: refetchTransaction } = useQuery(getTransactionByIdColada(params));
  const { refetch: refetchTransactions } = useQuery(getTransactionColada());
  return useMutation({
    async mutation() {
      const dataGateway = await useDataGateway();
      return dataGateway.getTransactionService().archive(params.id);
    },
    onSuccess: () => {
      refetchTransaction();
      refetchTransactions();
    },
    onError: (error) => {
      console.error('Error archiving Transaction', error);
    },
  });
};


export const useUnarchiveTransactionMutation = (params: { id: string }) => {
  const { refetch: refetchTransaction } = useQuery(getTransactionByIdColada(params));
  const { refetch: refetchTransactions } = useQuery(getTransactionColada());
  return useMutation({
    async mutation() {
      const dataGateway = await useDataGateway();
      return dataGateway.getTransactionService().unarchive(params.id);
    },
    onSuccess: () => {
      refetchTransaction();
      refetchTransactions();
    },
    onError: (error) => {
      console.error('Error unarchiving Transaction', error);
    },
  });
};
