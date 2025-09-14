import { DataGatewayImpl } from '~/services/local-impl';
import type { DataGateway } from '~~/lib/api';

export async function useDataGateway(): Promise<DataGateway> {
  const dataGatewayConfig = useAppConfig().dataGateway;

  if (dataGatewayConfig.implementation === 'local') {
    return new DataGatewayImpl();
  }

  throw new Error('Data gateway implementation not found');
}
