import type { DataGateway } from '~~/lib/api';

// @ts-expect-error
export function useDataGatewayService(): { dataGateway: DataGateway } {}
