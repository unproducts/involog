import { useLocalStorage } from '@vueuse/core';
import { v4 as uuid } from 'uuid';
import type { UnitService } from '~~/lib/api';
import {
  type CreateUnitSchema,
  type UpdateUnitSchema,
  type DeleteUnitSchema,
  type FilterUnitsSchema,
  type UnitSchema,
  createUnitSchema,
  updateUnitSchema,
  deleteUnitSchema,
  filterUnitsSchema,
} from '~~/shared/schemas/unit';

// Baseline static units that cannot be modified
const baselineUnits: UnitSchema[] = [
  {
    id: '2075574e-8ef1-42aa-ad5a-0ac7781a47c7',
    name: 'Hours',
    symbolSingular: 'Hr',
    symbolPlural: 'Hrs',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '9ff7dc7f-4ca7-4974-81a8-0d6a381c4a40',
    name: 'Days',
    symbolSingular: 'D',
    symbolPlural: 'Ds',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '0f79d84e-caa9-455e-9ae0-d8208d17d5f0',
    name: 'Weeks',
    symbolSingular: 'W',
    symbolPlural: 'Ws',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'b1f8fc58-3d90-4ff7-ae3e-93d9181fdf9c',
    name: 'Months',
    symbolSingular: 'M',
    symbolPlural: 'Ms',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '94cfbb6b-5e90-4024-a667-8540f690f4fa',
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

  async create(params: CreateUnitSchema): Promise<void> {
    const createUnitArgs = createUnitSchema.parse(params);
    const unit = {
      ...createUnitArgs,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.customUnits.value.push(unit);
  }

  async fetch(params: FilterUnitsSchema): Promise<UnitSchema[]> {
    const filterArgs = filterUnitsSchema.parse(params);
    let all = [...baselineUnits, ...this.customUnits.value];

    if (filterArgs.id && filterArgs.id.length > 0) {
      all = all.filter((u) => filterArgs.id!.includes(u.id));
    }
    if (filterArgs.createdAt) {
      const { from, to } = filterArgs.createdAt;
      all = all.filter((u) => {
        const createdAt = new Date(u.createdAt);
        if (from && createdAt < new Date(from)) return false;
        if (to && createdAt > new Date(to)) return false;
        return true;
      });
    }
    if (filterArgs.updatedAt) {
      const { from, to } = filterArgs.updatedAt;
      all = all.filter((u) => {
        const updatedAt = new Date(u.updatedAt);
        if (from && updatedAt < new Date(from)) return false;
        if (to && updatedAt > new Date(to)) return false;
        return true;
      });
    }
    if (filterArgs.name) {
      const term = filterArgs.name.toLowerCase();
      all = all.filter((u) => u.name.toLowerCase().includes(term));
    }
    if (filterArgs.symbolSingular && filterArgs.symbolSingular.length > 0) {
      all = all.filter((u) => filterArgs.symbolSingular!.includes(u.symbolSingular));
    }
    if (filterArgs.symbolPlural && filterArgs.symbolPlural.length > 0) {
      all = all.filter((u) => filterArgs.symbolPlural!.includes(u.symbolPlural));
    }

    return all;
  }

  async fetchById(id: string): Promise<UnitSchema | null> {
    const baselineUnit = baselineUnits.find((unit) => unit.id === id);
    if (baselineUnit) return baselineUnit;

    return this.customUnits.value.find((unit) => unit.id === id) || null;
  }

  async update(params: UpdateUnitSchema): Promise<void> {
    // Prevent updating baseline units
    if (this.isBaselineUnit(params.id)) {
      throw new Error('Cannot update baseline units');
    }

    const updateUnitArgs = updateUnitSchema.parse(params);
    const unit = this.customUnits.value.find((unit) => unit.id === updateUnitArgs.id);
    if (!unit) {
      throw new Error('Custom unit not found');
    }

    this.customUnits.value = this.customUnits.value.map((unit) =>
      unit.id === updateUnitArgs.id ? { ...unit, ...updateUnitArgs, updatedAt: new Date().toISOString() } : unit
    );
  }

  async delete(params: DeleteUnitSchema): Promise<void> {
    // Prevent deleting baseline units
    if (this.isBaselineUnit(params.id)) {
      throw new Error('Cannot delete baseline units');
    }

    const deleteArgs = deleteUnitSchema.parse(params);
    this.customUnits.value = this.customUnits.value.filter((unit) => unit.id !== deleteArgs.id);
  }
}
