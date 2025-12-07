import { queryOptions } from '@tanstack/vue-query';
import {
  createInvoiceSchema,
  updateInvoiceSchema,
  deleteInvoiceSchema,
  type CreateInvoiceSchema,
  type UpdateInvoiceSchema,
  type DeleteInvoiceSchema,
  type FilterInvoicesSchema,
} from '~~/shared/schemas/invoice';

export const invoicesQueryOptions = (params: FilterInvoicesSchema = {}) =>
  queryOptions({
    queryKey: ['invoices', params],
    queryFn: async () => {
      const dataGateway = await useDataGateway();
      return dataGateway.getInvoiceService().fetch(params);
    },
    staleTime: DEFAULT_STALE_TIME,
  });

export const invoiceInfoByIdQueryOptions = (params: { id: string }) =>
  queryOptions({
    queryKey: ['invoices', 'info', params.id],
    queryFn: async () => {
      const dataGateway = await useDataGateway();
      return dataGateway.getInvoiceService().fetchById(params.id);
    },
    staleTime: DEFAULT_STALE_TIME,
  });

export const invoiceByIdQueryOptions = (params: { id: string }) =>
  queryOptions({
    queryKey: ['invoices', 'full', params.id],
    queryFn: async () => {
      const dataGateway = await useDataGateway();
      return dataGateway.getInvoiceService().loadById(params.id);
    },
    staleTime: DEFAULT_STALE_TIME,
  });

export const useCreateInvoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rawParams: CreateInvoiceSchema) => {
      const params = createInvoiceSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getInvoiceService().create(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (error) => {
      console.error('Error creating invoice', error);
    },
  });
};

export const useUpdateInvoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rawParams: UpdateInvoiceSchema) => {
      const params = updateInvoiceSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getInvoiceService().update(params);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['invoices', 'info', vars.id] });
      queryClient.invalidateQueries({ queryKey: ['invoices', 'full', vars.id] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (error, vars) => {
      console.error('Error updating invoice', error, vars);
    },
  });
};

export const useDeleteInvoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rawParams: DeleteInvoiceSchema) => {
      const params = deleteInvoiceSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getInvoiceService().delete(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (error, vars) => {
      console.error('Error deleting invoice', error, vars);
    },
  });
};
