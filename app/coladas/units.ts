import { mutateUnitSchema, type MutateUnitSchema } from '~~/shared/schemas/measurement';

export const getUnitsColada = defineQueryOptions(() => ({
  key: ['units'],
  query: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getUnitService().fetch();
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

export const getUnitBySymbolSingularColada = defineQueryOptions((params: { symbol: string }) => ({
  key: ['units', 'singular', params.symbol],
  query: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getUnitService().fetchBySymbolSingular(params.symbol);
  },
  staleTime: DEFAULT_STALE_TIME,
}));

export const getUnitBySymbolPluralColada = defineQueryOptions((params: { symbol: string }) => ({
  key: ['units', 'plural', params.symbol],
  query: async () => {
    const dataGateway = await useDataGateway();
    return dataGateway.getUnitService().fetchBySymbolPlural(params.symbol);
  },
  staleTime: DEFAULT_STALE_TIME,
}));

export const useCreateUnitMutation = () => {
  const { refetch } = useQuery(getUnitsColada());
  return useMutation({
    async mutation(rawParams: MutateUnitSchema) {
      const params = mutateUnitSchema.parse(rawParams);
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

export const useUpdateUnitMutation = ({ id }: { id: string }) => {
  const { refetch: refetchUnit } = useQuery(getUnitByIdColada({ id }));
  const { refetch: refetchUnits } = useQuery(getUnitsColada());
  return useMutation({
    async mutation(rawParams: MutateUnitSchema) {
      const params = mutateUnitSchema.parse(rawParams);
      const dataGateway = await useDataGateway();
      return dataGateway.getUnitService().update(id, params);
    },
    onSuccess: () => {
      refetchUnit();
      refetchUnits();
    },
    onError: (error) => {
      console.error('Error updating unit', error);
    },
  });
};

export const useDeleteUnitMutation = (params: { id: string }) => {
  const { refetch: refetchUnit } = useQuery(getUnitByIdColada(params));
  const { refetch: refetchUnits } = useQuery(getUnitsColada());
  return useMutation({
    async mutation() {
      const dataGateway = await useDataGateway();
      return dataGateway.getUnitService().delete(params.id);
    },
    onSuccess: () => {
      refetchUnit();
      refetchUnits();
    },
    onError: (error) => {
      console.error('Error deleting unit', error);
    },
  });
};
