import { useLocalStorage } from '@vueuse/core';
import { v4 as uuid } from 'uuid';
import type { ItemService } from '~~/lib/api';
import {
  type ItemSchema,
  type CreateItemSchema,
  type DeleteItemSchema,
  type FilterItemsSchema,
  type UpdateItemSchema,
  createItemSchema,
  deleteItemSchema,
  filterItemsSchema,
  updateItemSchema,
} from '~~/shared/schemas/item';

export class ItemServiceImpl implements ItemService {
  private items: Ref<ItemSchema[]>;

  constructor() {
    this.items = useLocalStorage('items', []);
  }
  async fetch(params: FilterItemsSchema): Promise<ItemSchema[]> {
    const filterArgs = filterItemsSchema.parse(params);
    let filtered = [...this.items.value];

    if (filterArgs.id && filterArgs.id.length > 0) {
      filtered = filtered.filter((i) => filterArgs.id!.includes(i.id));
    }
    if (filterArgs.createdAt) {
      const { from, to } = filterArgs.createdAt;
      filtered = filtered.filter((i) => {
        const createdAt = new Date(i.createdAt);
        if (from && createdAt < new Date(from)) return false;
        if (to && createdAt > new Date(to)) return false;
        return true;
      });
    }
    if (filterArgs.updatedAt) {
      const { from, to } = filterArgs.updatedAt;
      filtered = filtered.filter((i) => {
        const updatedAt = new Date(i.updatedAt);
        if (from && updatedAt < new Date(from)) return false;
        if (to && updatedAt > new Date(to)) return false;
        return true;
      });
    }

    if (filterArgs.search) {
      const term = filterArgs.search.toLowerCase();
      filtered = filtered.filter(
        (i) => i.name.toLowerCase().includes(term) || i.description?.toLowerCase().includes(term)
      );
    }
    if (filterArgs.price) {
      filtered = filtered.filter((i) => {
        const { min, max } = filterArgs.price!;
        if (min !== undefined && i.price < min) return false;
        if (max !== undefined && i.price > max) return false;
        return true;
      });
    }
    if (filterArgs.isService !== undefined) {
      filtered = filtered.filter((i) => i.isService === filterArgs.isService);
    }
    if (filterArgs.unitId && filterArgs.unitId.length > 0) {
      filtered = filtered.filter((i) => filterArgs.unitId!.includes(i.unitId));
    }
    if (filterArgs.currency && filterArgs.currency.length > 0) {
      filtered = filtered.filter((i) => filterArgs.currency!.includes(i.currency));
    }

    return filtered;
  }
  async fetchById(id: string): Promise<ItemSchema | null> {
    return this.items.value.find((i) => i.id === id) || null;
  }
  async create(params: CreateItemSchema): Promise<void> {
    const args = createItemSchema.parse(params);
    const item: ItemSchema = {
      ...args,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.value.push(item);
  }
  async update(params: UpdateItemSchema): Promise<void> {
    const args = updateItemSchema.parse(params);
    const existing = this.items.value.find((i) => i.id === args.id);
    if (!existing) {
      throw new Error('Item not found');
    }
    const { id, ...rest } = args;
    this.items.value = this.items.value.map((i) =>
      i.id === id ? { ...i, ...rest, updatedAt: new Date().toISOString() } : i
    );
  }
  async delete(params: DeleteItemSchema): Promise<void> {
    const args = deleteItemSchema.parse(params);
    this.items.value = this.items.value.filter((i) => i.id !== args.id);
  }
}
