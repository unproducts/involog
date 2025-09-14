import { mutateItemSchema, type MutateItemSchema } from '~~/shared/schemas/item';

export const getItemsColada = defineQueryOptions(() => ({
  key: ['items'],
  query: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getItemService().fetch();
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
    async mutation(rawParams: MutateItemSchema) {
      const params = mutateItemSchema.parse(rawParams);
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

export const useUpdateItemMutation = ({ id }: { id: string }) => {
  const { refetch: refetchItem } = useQuery(getItemByIdColada({ id }));
  const { refetch: refetchItems } = useQuery(getItemsColada());
  return useMutation({
    async mutation(rawParams: MutateItemSchema) {
      const params = mutateItemSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getItemService().update(id, params);
    },
    onSuccess: () => {
      refetchItem();
      refetchItems();
    },
    onError: (error) => {
      console.error('Error updating item', error);
    },
  });
};

export const useDeleteItemMutation = (params: { id: string }) => {
  const { refetch: refetchItem } = useQuery(getItemByIdColada(params));
  const { refetch: refetchItems } = useQuery(getItemsColada());
  return useMutation({
    async mutation() {
      const dataGateway = await useDataGateway();
      return dataGateway.getItemService().delete(params.id);
    },
    onSuccess: () => {
      refetchItem();
      refetchItems();
    },
    onError: (error) => {
      console.error('Error deleting item', error);
    },
  });
};
