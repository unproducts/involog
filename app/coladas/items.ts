import {
  createItemSchema,
  deleteItemSchema,
  updateItemSchema,
  type CreateItemSchema,
  type DeleteItemSchema,
  type UpdateItemSchema,
} from '~~/shared/schemas/item';

export const getItemsColada = defineQueryOptions(() => ({
  key: ['items'],
  query: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getItemService().fetch({});
  },
  staleTime: DEFAULT_STALE_TIME,
}));

export const getItemByIdColada = defineQueryOptions((params: { id: string }) => ({
  key: ['items', params.id],
  query: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getItemService().fetchById(params.id);
  },
  staleTime: DEFAULT_STALE_TIME,
}));

export const useCreateItemMutation = () => {
  const { refetch } = useQuery(getItemsColada());
  return useMutation({
    async mutation(rawParams: CreateItemSchema) {
      const params = createItemSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getItemService().create(params);
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error creating item', error);
    },
  });
};

export const useUpdateItemMutation = () => {
  return useMutation({
    async mutation(rawParams: UpdateItemSchema) {
      const params = updateItemSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getItemService().update(params);
    },
    onSuccess: (_, vars) => {
      const { refetch: refetchItem } = useQuery(getItemByIdColada({ id: vars.id }));
      const { refetch: refetchItems } = useQuery(getItemsColada());
      refetchItem();
      refetchItems();
    },
    onError: (error) => {
      console.error('Error updating item', error);
    },
  });
};

export const useDeleteItemMutation = () => {
  const { refetch: refetchItems } = useQuery(getItemsColada());
  return useMutation({
    async mutation(rawParams: DeleteItemSchema) {
      const params = deleteItemSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getItemService().delete(params);
    },
    onSuccess: () => {
      refetchItems();
    },
    onError: (error) => {
      console.error('Error deleting item', error);
    },
  });
};
