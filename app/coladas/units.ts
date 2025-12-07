import { queryOptions } from '@tanstack/vue-query';
import {
  createUnitSchema,
  updateUnitSchema,
  deleteUnitSchema,
  type CreateUnitSchema,
  type UpdateUnitSchema,
  type DeleteUnitSchema,
  type FilterUnitsSchema,
} from '~~/shared/schemas/unit';

export const unitsQueryOptions = (params: FilterUnitsSchema = {}) =>
  queryOptions({
    queryKey: ['units', params],
    queryFn: async () => {
      const dataGateway = await useDataGateway();
      return dataGateway.getUnitService().fetch(params);
    },
    staleTime: DEFAULT_STALE_TIME,
  });

export const unitByIdQueryOptions = (params: { id: string }) =>
  queryOptions({
    queryKey: ['units', params.id],
    queryFn: async () => {
      const dataGateway = await useDataGateway();
      return dataGateway.getUnitService().fetchById(params.id);
    },
    staleTime: DEFAULT_STALE_TIME,
  });

export const useCreateUnitMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rawParams: CreateUnitSchema) => {
      const params = createUnitSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getUnitService().create(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
    onError: (error) => {
      console.error('Error creating unit', error);
    },
  });
};

export const useUpdateUnitMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rawParams: UpdateUnitSchema) => {
      const params = updateUnitSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getUnitService().update(params);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['units', vars.id] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
    onError: (error) => {
      console.error('Error updating unit', error);
    },
  });
};

export const useDeleteUnitMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rawParams: DeleteUnitSchema) => {
      const params = deleteUnitSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getUnitService().delete(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
    onError: (error) => {
      console.error('Error deleting unit', error);
    },
  });
};
