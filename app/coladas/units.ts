import {
  createUnitSchema,
  updateUnitSchema,
  deleteUnitSchema,
  type CreateUnitSchema,
  type UpdateUnitSchema,
  type DeleteUnitSchema,
  type FilterUnitsSchema,
} from '~~/shared/schemas/unit';

export const getUnitsColada = defineQueryOptions((params: FilterUnitsSchema = {}) => ({
  key: ['units', params],
  query: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getUnitService().fetch(params);
  },
  staleTime: DEFAULT_STALE_TIME,
}));

export const getUnitByIdColada = defineQueryOptions((params: { id: string }) => ({
  key: ['units', params.id],
  query: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getUnitService().fetchById(params.id);
  },
  staleTime: DEFAULT_STALE_TIME,
}));

export const useCreateUnitMutation = () => {
  const { refetch } = useQuery(getUnitsColada());
  return useMutation({
    async mutation(rawParams: CreateUnitSchema) {
      const params = createUnitSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getUnitService().create(params);
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error creating unit', error);
    },
  });
};

export const useUpdateUnitMutation = () => {
  return useMutation({
    async mutation(rawParams: UpdateUnitSchema) {
      const params = updateUnitSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getUnitService().update(params);
    },
    onSuccess: (_, vars) => {
      const { refetch: refetchUnit } = useQuery(getUnitByIdColada({ id: vars.id }));
      const { refetch: refetchUnits } = useQuery(getUnitsColada());
      refetchUnit();
      refetchUnits();
    },
    onError: (error) => {
      console.error('Error updating unit', error);
    },
  });
};

export const useDeleteUnitMutation = () => {
  const { refetch: refetchUnits } = useQuery(getUnitsColada());
  return useMutation({
    async mutation(rawParams: DeleteUnitSchema) {
      const params = deleteUnitSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getUnitService().delete(params);
    },
    onSuccess: () => {
      refetchUnits();
    },
    onError: (error) => {
      console.error('Error deleting unit', error);
    },
  });
};
