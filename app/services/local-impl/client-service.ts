import { useLocalStorage } from '@vueuse/core';
import { v4 as uuid } from 'uuid';
import type { ClientService } from '~~/lib/api';
import {
  createClientSchema,
  updateClientSchema,
  deleteClientSchema,
  filterClientsSchema,
  type CreateClientSchema,
  type UpdateClientSchema,
  type DeleteClientSchema,
  type FilterClientsSchema,
  type ClientSchema,
} from '~~/shared/schemas/client';

export class ClientServiceImpl implements ClientService {
  private clients: Ref<ClientSchema[]>;

  constructor() {
    this.clients = useLocalStorage('clients', []);
  }

  async fetch(params: FilterClientsSchema): Promise<ClientSchema[]> {
    const filterArgs = filterClientsSchema.parse(params);
    let filtered = [...this.clients.value];

    if (filterArgs.id && filterArgs.id.length > 0) {
      filtered = filtered.filter((c) => filterArgs.id!.includes(c.id));
    }

    if (filterArgs.createdAt) {
      const { from, to } = filterArgs.createdAt;
      filtered = filtered.filter((c) => {
        const createdAt = new Date(c.createdAt);
        if (from && createdAt < new Date(from)) return false;
        if (to && createdAt > new Date(to)) return false;
        return true;
      });
    }

    if (filterArgs.updatedAt) {
      const { from, to } = filterArgs.updatedAt;
      filtered = filtered.filter((c) => {
        const updatedAt = new Date(c.updatedAt);
        if (from && updatedAt < new Date(from)) return false;
        if (to && updatedAt > new Date(to)) return false;
        return true;
      });
    }

    if (filterArgs.name) {
      const term = filterArgs.name.toLowerCase();
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(term));
    }
    if (filterArgs.email) {
      const term = filterArgs.email.toLowerCase();
      filtered = filtered.filter((c) => c.email?.toLowerCase().includes(term));
    }
    if (filterArgs.phone) {
      const term = filterArgs.phone.toLowerCase();
      filtered = filtered.filter((c) => c.phone?.toLowerCase().includes(term));
    }
    if (filterArgs.country && filterArgs.country.length > 0) {
      filtered = filtered.filter((c) => c.country && filterArgs.country!.includes(c.country));
    }
    if (filterArgs.currency && filterArgs.currency.length > 0) {
      filtered = filtered.filter((c) => c.currency && filterArgs.currency!.includes(c.currency));
    }
    if (filterArgs.isArchived !== undefined) {
      filtered = filtered.filter((c) => (c.isArchived ?? false) === filterArgs.isArchived);
    }

    return filtered;
  }

  async fetchById(id: string): Promise<ClientSchema | null> {
    return this.clients.value.find((c) => c.id === id) || null;
  }

  async create(params: CreateClientSchema): Promise<void> {
    const createArgs = createClientSchema.parse(params);
    const client: ClientSchema = {
      ...createArgs,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: createArgs.isArchived ?? false,
    };
    this.clients.value.push(client);
  }

  async update(params: UpdateClientSchema): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const updateArgs = updateClientSchema.parse(params);
    const client = this.clients.value.find((c) => c.id === updateArgs.id);
    if (!client) {
      throw new Error('Client not found');
    }
    const { id, ...rest } = updateArgs;
    this.clients.value = this.clients.value.map((c) =>
      c.id === id ? { ...c, ...rest, updatedAt: new Date().toISOString() } : c
    );
  }

  async delete(params: DeleteClientSchema): Promise<void> {
    const deleteArgs = deleteClientSchema.parse(params);
    this.clients.value = this.clients.value.filter((c) => c.id !== deleteArgs.id);
  }
}
