import {
  createClientSchema,
  deleteClientSchema,
  updateClientSchema,
  type CreateClientSchema,
  type DeleteClientSchema,
  type UpdateClientSchema,
} from '~~/shared/schemas/client';

export const getClientsColada = defineQueryOptions(() => ({
  key: ['clients'],
  query: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getClientService().fetch({});
  },
  staleTime: DEFAULT_STALE_TIME,
}));

export const getClientByIdColada = defineQueryOptions((params: { id: string }) => ({
  key: ['clients', params.id],
  query: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getClientService().fetchById(params.id);
  },
  staleTime: DEFAULT_STALE_TIME,
}));

export const useCreateClientMutation = () => {
  const { refetch } = useQuery(getClientsColada());
  return useMutation({
    async mutation(rawParams: CreateClientSchema) {
      const params = createClientSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getClientService().create(params);
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error creating client', error);
    },
  });
};

export const useUpdateClientMutation = () => {
  return useMutation({
    async mutation(rawParams: UpdateClientSchema) {
      const params = updateClientSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getClientService().update(params);
    },
    onSuccess: (_, vars) => {
      const { refetch: refetchClient } = useQuery(getClientByIdColada({ id: vars.id }));
      const { refetch: refetchClients } = useQuery(getClientsColada());

      refetchClient();
      refetchClients();
    },
    onError: (error, vars) => {
      console.error('Error updating client', error, vars);
    },
  });
};

export const useDeleteClientMutation = () => {
  const { refetch: refetchClients } = useQuery(getClientsColada());
  return useMutation({
    async mutation(rawParams: DeleteClientSchema) {
      const params = deleteClientSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getClientService().delete(params);
    },
    onSuccess: () => {
      refetchClients();
    },
    onError: (error, vars) => {
      console.error('Error deleting client', error, vars);
    },
  });
};
