import { useLocalStorage } from '@vueuse/core';
import { v4 as uuid } from 'uuid';
import type { ClientService } from '~~/lib/api';
import { type MutateClientSchema, type ClientSchema, mutateClientSchema } from '~~/shared/schemas/client';

export class ClientServiceImpl implements ClientService {
  private clients: Ref<ClientSchema[]>;

  constructor() {
    this.clients = useLocalStorage('clients', []);
  }

  async create(params: MutateClientSchema): Promise<void> {
    const createClientArgs = mutateClientSchema.parse(params);
    const client = {
      ...createClientArgs,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.clients.value.push(client);
  }

  async fetch(): Promise<ClientSchema[]> {
    return this.clients.value;
  }

  async fetchById(id: string): Promise<ClientSchema | null> {
    return this.clients.value.find((c) => c.id === id) || null;
  }

  async update(id: string, params: MutateClientSchema): Promise<void> {
    const updateClientArgs = mutateClientSchema.parse(params);
    const client = this.clients.value.find((c) => c.id === id);
    if (!client) {
      throw new Error('Client not found');
    }
    this.clients.value = this.clients.value.map((c) => (c.id === id ? { ...c, ...updateClientArgs } : c));
  }

  async delete(id: string): Promise<void> {
    this.clients.value = this.clients.value.filter((c) => c.id !== id);
  }

  async archive(id: string): Promise<ClientSchema> {
    const client = this.clients.value.find((c) => c.id === id);
    if (!client) {
      throw new Error('Client not found');
    }
    client.isArchived = true;
    client.updatedAt = new Date().toISOString();
    return client;
  }

  async unarchive(id: string): Promise<ClientSchema> {
    const client = this.clients.value.find((c) => c.id === id);
    if (!client) {
      throw new Error('Client not found');
    }
    client.isArchived = false;
    client.updatedAt = new Date().toISOString();
    return client;
  }
}
