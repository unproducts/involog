import { DataGatewayImpl as LocalDataGatewayImpl } from '~/services/local-impl';
import type { DataGateway } from '~~/lib/api';

export async function useDataGateway(): Promise<DataGateway> {
  const dataGatewayConfig = useAppConfig().dataGateway;

  if (dataGatewayConfig.implementation === 'local') {
    return new LocalDataGatewayImpl();
  }

  throw new Error('Data gateway implementation not found');
}
