import { useLocalStorage } from '@vueuse/core';
import { v4 as uuid } from 'uuid';
import type { UnitService } from '~~/lib/api';
import { type MutateUnitSchema, type UnitSchema, mutateUnitSchema } from '~~/shared/schemas/measurement';

// Baseline static units that cannot be modified
const baselineUnits: UnitSchema[] = [
  {
    id: 'baseline-hours',
    name: 'Hours',
    symbolSingular: 'Hr',
    symbolPlural: 'Hrs',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'baseline-days',
    name: 'Days',
    symbolSingular: 'D',
    symbolPlural: 'Ds',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'baseline-weeks',
    name: 'Weeks',
    symbolSingular: 'W',
    symbolPlural: 'Ws',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'baseline-months',
    name: 'Months',
    symbolSingular: 'M',
    symbolPlural: 'Ms',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'baseline-years',
    name: 'Years',
    symbolSingular: 'Y',
    symbolPlural: 'Ys',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class UnitServiceImpl implements UnitService {
  private customUnits: Ref<UnitSchema[]>;

  constructor() {
    // Only store custom units in local storage
    this.customUnits = useLocalStorage('customUnits', []);
  }

  private isBaselineUnit(id: string): boolean {
    return id.startsWith('baseline-');
  }

  async create(params: MutateUnitSchema): Promise<void> {
    const createUnitArgs = mutateUnitSchema.parse(params);
    const unit = {
      ...createUnitArgs,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.customUnits.value.push(unit);
  }

  async fetch(): Promise<UnitSchema[]> {
    // Return baseline units + custom units
    return [...baselineUnits, ...this.customUnits.value];
  }

  async fetchById(id: string): Promise<UnitSchema | null> {
    // Check baseline units first, then custom units
    const baselineUnit = baselineUnits.find((unit) => unit.id === id);
    if (baselineUnit) return baselineUnit;

    return this.customUnits.value.find((unit) => unit.id === id) || null;
  }

  async fetchBySymbolSingular(symbol: string): Promise<UnitSchema | null> {
    // Check baseline units first, then custom units
    const baselineUnit = baselineUnits.find((unit) => unit.symbolSingular === symbol);
    if (baselineUnit) return baselineUnit;

    return this.customUnits.value.find((unit) => unit.symbolSingular === symbol) || null;
  }

  async fetchBySymbolPlural(symbol: string): Promise<UnitSchema | null> {
    // Check baseline units first, then custom units
    const baselineUnit = baselineUnits.find((unit) => unit.symbolPlural === symbol);
    if (baselineUnit) return baselineUnit;

    return this.customUnits.value.find((unit) => unit.symbolPlural === symbol) || null;
  }

  async update(id: string, params: MutateUnitSchema): Promise<void> {
    // Prevent updating baseline units
    if (this.isBaselineUnit(id)) {
      throw new Error('Cannot update baseline units');
    }

    const updateUnitArgs = mutateUnitSchema.parse(params);
    const unit = this.customUnits.value.find((unit) => unit.id === id);
    if (!unit) {
      throw new Error('Custom unit not found');
    }

    this.customUnits.value = this.customUnits.value.map((unit) =>
      unit.id === id ? { ...unit, ...updateUnitArgs, updatedAt: new Date().toISOString() } : unit
    );
  }

  async delete(id: string): Promise<void> {
    // Prevent deleting baseline units
    if (this.isBaselineUnit(id)) {
      throw new Error('Cannot delete baseline units');
    }

    this.customUnits.value = this.customUnits.value.filter((unit) => unit.id !== id);
  }
}
