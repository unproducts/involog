import { queryOptions } from '@tanstack/vue-query';
import {
  createItemSchema,
  deleteItemSchema,
  updateItemSchema,
  type CreateItemSchema,
  type DeleteItemSchema,
  type UpdateItemSchema,
} from '~~/shared/schemas/item';

export const itemsQueryOptions = queryOptions({
  queryKey: ['items'],
  queryFn: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getItemService().fetch({});
  },
  staleTime: DEFAULT_STALE_TIME,
});

export const itemByIdQueryOptions = (params: { id: string }) =>
  queryOptions({
    queryKey: ['items', params.id],
    queryFn: async () => {
      const dataGateway = await useDataGateway();
      return dataGateway.getItemService().fetchById(params.id);
    },
    staleTime: DEFAULT_STALE_TIME,
  });

export const useCreateItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rawParams: CreateItemSchema) => {
      const params = createItemSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getItemService().create(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
    onError: (error) => {
      console.error('Error creating item', error);
    },
  });
};

export const useUpdateItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rawParams: UpdateItemSchema) => {
      const params = updateItemSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getItemService().update(params);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['items', vars.id] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
    onError: (error) => {
      console.error('Error updating item', error);
    },
  });
};

export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rawParams: DeleteItemSchema) => {
      const params = deleteItemSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getItemService().delete(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
    onError: (error) => {
      console.error('Error deleting item', error);
    },
  });
};
