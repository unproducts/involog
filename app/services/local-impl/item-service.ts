import { useLocalStorage } from '@vueuse/core';
import { v4 as uuid } from 'uuid';
import type { ItemService } from '~~/lib/api';
import { type MutateItemSchema, type ItemSchema, mutateItemSchema } from '~~/shared/schemas/item';

export class ItemServiceImpl implements ItemService {
  private items: Ref<ItemSchema[]>;

  constructor() {
    this.items = useLocalStorage('items', []);
  }

  async create(params: MutateItemSchema): Promise<void> {
    const createItemArgs = mutateItemSchema.parse(params);
    const item = {
      ...createItemArgs,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.value.push(item);
  }

  async fetch(): Promise<ItemSchema[]> {
    return this.items.value;
  }

  async fetchById(id: string): Promise<ItemSchema | null> {
    return this.items.value.find((item) => item.id === id) || null;
  }

  async update(id: string, params: MutateItemSchema): Promise<void> {
    const updateItemArgs = mutateItemSchema.parse(params);
    const item = this.items.value.find((item) => item.id === id);
    if (!item) {
      throw new Error('Item not found');
    }
    this.items.value = this.items.value.map((item) =>
      item.id === id ? { ...item, ...updateItemArgs, updatedAt: new Date().toISOString() } : item
    );
  }

  async delete(id: string): Promise<void> {
    this.items.value = this.items.value.filter((item) => item.id !== id);
  }
}
