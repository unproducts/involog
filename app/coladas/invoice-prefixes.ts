import {
  createInvoicePrefixSchema,
  deleteInvoicePrefixSchema,
  updateInvoicePrefixSchema,
  type CreateInvoicePrefixSchema,
  type DeleteInvoicePrefixSchema,
  type FilterInvoicePrefixesSchema,
  type UpdateInvoicePrefixSchema,
} from '~~/shared/schemas/invoice';

export const getInvoicePrefixesColada = defineQueryOptions((params: FilterInvoicePrefixesSchema = {}) => ({
  key: ['invoicePrefixes', params],
  query: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getInvoicePrefixService().fetch(params);
  },
  staleTime: DEFAULT_STALE_TIME,
}));

export const getInvoicePrefixByIdColada = defineQueryOptions((params: { id: string }) => ({
  key: ['invoicePrefixes', params.id],
  query: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getInvoicePrefixService().fetchById(params.id);
  },
  staleTime: DEFAULT_STALE_TIME,
}));

export const useCreateInvoicePrefixMutation = () => {
  const { refetch } = useQuery(getInvoicePrefixesColada({}));
  return useMutation({
    async mutation(rawParams: CreateInvoicePrefixSchema) {
      const params = createInvoicePrefixSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getInvoicePrefixService().create(params);
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error creating invoice prefix', error);
    },
  });
};

export const useUpdateInvoicePrefixMutation = () => {
  return useMutation({
    async mutation(rawParams: UpdateInvoicePrefixSchema) {
      const params = updateInvoicePrefixSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getInvoicePrefixService().update(params);
    },
    onSuccess: (_, vars) => {
      const { refetch: refetchPrefixes } = useQuery(getInvoicePrefixesColada({}));
      const { refetch: refetchPrefix } = useQuery(getInvoicePrefixByIdColada({ id: vars.id }));
      refetchPrefix();
      refetchPrefixes();
    },
    onError: (error, vars) => {
      console.error('Error updating invoice prefix', error, vars);
    },
  });
};

export const useDeleteInvoicePrefixMutation = () => {
  const { refetch: refetchPrefixes } = useQuery(getInvoicePrefixesColada({}));
  return useMutation({
    async mutation(rawParams: DeleteInvoicePrefixSchema) {
      const params = deleteInvoicePrefixSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getInvoicePrefixService().delete(params);
    },
    onSuccess: () => {
      refetchPrefixes();
    },
    onError: (error, vars) => {
      console.error('Error deleting invoice prefix', error, vars);
    },
  });
};
