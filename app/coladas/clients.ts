import { queryOptions } from '@tanstack/vue-query';
import {
  createClientSchema,
  deleteClientSchema,
  updateClientSchema,
  type CreateClientSchema,
  type DeleteClientSchema,
  type UpdateClientSchema,
} from '~~/shared/schemas/client';

export const clientsQueryOptions = queryOptions({
  queryKey: ['clients'],
  queryFn: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getClientService().fetch({});
  },
  staleTime: DEFAULT_STALE_TIME,
});

export const clientByIdQueryOptions = (params: { id: string }) =>
  queryOptions({
    queryKey: ['clients', params.id],
    queryFn: async () => {
      const dataGateway = await useDataGateway();
      return dataGateway.getClientService().fetchById(params.id);
    },
    staleTime: DEFAULT_STALE_TIME,
  });

export const useCreateClientMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rawParams: CreateClientSchema) => {
      const params = createClientSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getClientService().create(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error) => {
      console.error('Error creating client', error);
    },
  });
};

export const useUpdateClientMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rawParams: UpdateClientSchema) => {
      const params = updateClientSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getClientService().update(params);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['clients', vars.id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error, vars) => {
      console.error('Error updating client', error, vars);
    },
  });
};

export const useDeleteClientMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rawParams: DeleteClientSchema) => {
      const params = deleteClientSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getClientService().delete(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error, vars) => {
      console.error('Error deleting client', error, vars);
    },
  });
};
