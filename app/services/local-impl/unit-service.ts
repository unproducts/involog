import { useLocalStorage } from '@vueuse/core';
import { v4 as uuid } from 'uuid';
import type { UnitService } from '~~/lib/api';
import {
  type CreateUnitSchema,
  type UnitSchema,
  type UpdateUnitSchema,
  createUnitSchema,
  updateUnitSchema,
} from '~~/shared/schemas/measurement';

export class UnitServiceImpl implements UnitService {
  private units: Ref<UnitSchema[]>;

  constructor() {
    this.units = useLocalStorage('units', []);
  }

  async create(params: CreateUnitSchema): Promise<void> {
    const createUnitArgs = createUnitSchema.parse(params);
    const unit = {
      ...createUnitArgs,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.units.value.push(unit);
  }

  async fetch(): Promise<UnitSchema[]> {
    return this.units.value;
  }

  async fetchById(id: string): Promise<UnitSchema | null> {
    return this.units.value.find((unit) => unit.id === id) || null;
  }

  async fetchBySymbolSingular(symbol: string): Promise<UnitSchema | null> {
    return this.units.value.find((unit) => unit.symbolSingular === symbol) || null;
  }

  async fetchBySymbolPlural(symbol: string): Promise<UnitSchema | null> {
    return this.units.value.find((unit) => unit.symbolPlural === symbol) || null;
  }

  async update(params: UpdateUnitSchema): Promise<void> {
    const updateUnitArgs = updateUnitSchema.parse(params);
    const unit = this.units.value.find((unit) => unit.id === updateUnitArgs.id);
    if (!unit) {
      throw new Error('Unit not found');
    }
    this.units.value = this.units.value.map((unit) =>
      unit.id === updateUnitArgs.id ? { ...unit, ...updateUnitArgs, updatedAt: new Date().toISOString() } : unit
    );
  }

  async delete(id: string): Promise<void> {
    this.units.value = this.units.value.filter((unit) => unit.id !== id);
  }
}
