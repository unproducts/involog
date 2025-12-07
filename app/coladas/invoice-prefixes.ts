import { queryOptions } from '@tanstack/vue-query';
import {
  createInvoicePrefixSchema,
  deleteInvoicePrefixSchema,
  updateInvoicePrefixSchema,
  type CreateInvoicePrefixSchema,
  type DeleteInvoicePrefixSchema,
  type FilterInvoicePrefixesSchema,
  type UpdateInvoicePrefixSchema,
} from '~~/shared/schemas/invoice';

export const invoicePrefixesQueryOptions = (params: FilterInvoicePrefixesSchema = {}) =>
  queryOptions({
    queryKey: ['invoicePrefixes', params],
    queryFn: async () => {
      const dataGateway = await useDataGateway();
      return dataGateway.getInvoicePrefixService().fetch(params);
    },
    staleTime: DEFAULT_STALE_TIME,
  });

export const invoicePrefixByIdQueryOptions = (params: { id: string }) =>
  queryOptions({
    queryKey: ['invoicePrefixes', params.id],
    queryFn: async () => {
      const dataGateway = await useDataGateway();
      return dataGateway.getInvoicePrefixService().fetchById(params.id);
    },
    staleTime: DEFAULT_STALE_TIME,
  });

export const useCreateInvoicePrefixMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rawParams: CreateInvoicePrefixSchema) => {
      const params = createInvoicePrefixSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getInvoicePrefixService().create(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoicePrefixes'] });
    },
    onError: (error) => {
      console.error('Error creating invoice prefix', error);
    },
  });
};

export const useUpdateInvoicePrefixMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rawParams: UpdateInvoicePrefixSchema) => {
      const params = updateInvoicePrefixSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getInvoicePrefixService().update(params);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['invoicePrefixes', vars.id] });
      queryClient.invalidateQueries({ queryKey: ['invoicePrefixes'] });
    },
    onError: (error, vars) => {
      console.error('Error updating invoice prefix', error, vars);
    },
  });
};

export const useDeleteInvoicePrefixMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rawParams: DeleteInvoicePrefixSchema) => {
      const params = deleteInvoicePrefixSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getInvoicePrefixService().delete(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoicePrefixes'] });
    },
    onError: (error, vars) => {
      console.error('Error deleting invoice prefix', error, vars);
    },
  });
};
