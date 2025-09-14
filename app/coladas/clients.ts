import { mutateClientSchema, type MutateClientSchema } from '~~/shared/schemas/client';

export const getClientsColada = defineQueryOptions(() => ({
  key: ['clients'],
  query: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getClientService().fetch();
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
    async mutation(rawParams: MutateClientSchema) {
      const params = mutateClientSchema.parse(rawParams);
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

export const useUpdateClientMutation = ({ id }: { id: string }) => {
  const { refetch: refetchClient } = useQuery(getClientByIdColada({ id }));
  const { refetch: refetchClients } = useQuery(getClientsColada());
  return useMutation({
    async mutation(rawParams: MutateClientSchema) {
      const params = mutateClientSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getClientService().update(id, params);
    },
    onSuccess: () => {
      refetchClient();
      refetchClients();
    },
    onError: (error) => {
      console.error('Error updating client', error);
    },
  });
};

export const useDeleteClientMutation = (params: { id: string }) => {
  const { refetch: refetchClient } = useQuery(getClientByIdColada(params));
  const { refetch: refetchClients } = useQuery(getClientsColada());
  return useMutation({
    async mutation() {
      const dataGateway = await useDataGateway();
      return dataGateway.getClientService().delete(params.id);
    },
    onSuccess: () => {
      refetchClient();
      refetchClients();
    },
    onError: (error) => {
      console.error('Error deleting client', error);
    },
  });
};

export const useArchiveClientMutation = (params: { id: string }) => {
  const { refetch: refetchClient } = useQuery(getClientByIdColada(params));
  const { refetch: refetchClients } = useQuery(getClientsColada());
  return useMutation({
    async mutation() {
      const dataGateway = await useDataGateway();
      return dataGateway.getClientService().archive(params.id);
    },
    onSuccess: () => {
      refetchClient();
      refetchClients();
    },
    onError: (error) => {
      console.error('Error archiving client', error);
    },
  });
};

export const useUnarchiveClientMutation = (params: { id: string }) => {
  const { refetch: refetchClient } = useQuery(getClientByIdColada(params));
  const { refetch: refetchClients } = useQuery(getClientsColada());
  return useMutation({
    async mutation() {
      const dataGateway = await useDataGateway();
      return dataGateway.getClientService().unarchive(params.id);
    },
    onSuccess: () => {
      refetchClient();
      refetchClients();
    },
    onError: (error) => {
      console.error('Error unarchiving client', error);
    },
  });
};
