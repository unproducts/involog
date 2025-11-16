import {
  createInvoiceSchema,
  updateInvoiceSchema,
  deleteInvoiceSchema,
  type CreateInvoiceSchema,
  type UpdateInvoiceSchema,
  type DeleteInvoiceSchema,
  type FilterInvoicesSchema,
} from '~~/shared/schemas/invoice';

export const getInvoicesColada = defineQueryOptions((params: FilterInvoicesSchema = {}) => ({
  key: ['invoices', params],
  query: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getInvoiceService().fetch(params);
  },
  staleTime: DEFAULT_STALE_TIME,
}));

export const getInvoiceInfoByIdColada = defineQueryOptions((params: { id: string }) => ({
  key: ['invoices', 'info', params.id],
  query: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getInvoiceService().fetchById(params.id);
  },
  staleTime: DEFAULT_STALE_TIME,
}));

export const getInvoiceByIdColada = defineQueryOptions((params: { id: string }) => ({
  key: ['invoices', 'full', params.id],
  query: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getInvoiceService().loadById(params.id);
  },
  staleTime: DEFAULT_STALE_TIME,
}));

export const useCreateInvoiceMutation = () => {
  const { refetch } = useQuery(getInvoicesColada({}));
  return useMutation({
    async mutation(rawParams: CreateInvoiceSchema) {
      const params = createInvoiceSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getInvoiceService().create(params);
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error creating invoice', error);
    },
  });
};

export const useUpdateInvoiceMutation = () => {
  return useMutation({
    async mutation(rawParams: UpdateInvoiceSchema) {
      const params = updateInvoiceSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getInvoiceService().update(params);
    },
    onSuccess: (_, vars) => {
      const { refetch: refetchInvoices } = useQuery(getInvoicesColada({}));
      const { refetch: refetchInvoiceInfo } = useQuery(getInvoiceInfoByIdColada({ id: vars.id }));
      const { refetch: refetchInvoiceFull } = useQuery(getInvoiceByIdColada({ id: vars.id }));
      refetchInvoiceInfo();
      refetchInvoiceFull();
      refetchInvoices();
    },
    onError: (error, vars) => {
      console.error('Error updating invoice', error, vars);
    },
  });
};

export const useDeleteInvoiceMutation = () => {
  const { refetch: refetchInvoices } = useQuery(getInvoicesColada({}));
  return useMutation({
    async mutation(rawParams: DeleteInvoiceSchema) {
      const params = deleteInvoiceSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getInvoiceService().delete(params);
    },
    onSuccess: () => {
      refetchInvoices();
    },
    onError: (error, vars) => {
      console.error('Error deleting invoice', error, vars);
    },
  });
};
