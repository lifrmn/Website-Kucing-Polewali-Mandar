import { PetType } from '@/types/enums';

export const PET_TYPE_LABELS: Record<PetType, string> = {
  [PetType.CAT]: 'Kucing',
  [PetType.DOG]: 'Anjing',
  [PetType.RABBIT]: 'Kelinci',
  [PetType.HAMSTER]: 'Hamster/Hewan Kecil',
  [PetType.BIRD]: 'Burung',
  [PetType.OTHER]: 'Lainnya',
};

export const PET_TYPE_OPTIONS = Object.values(PetType).map((value) => ({
  value,
  label: PET_TYPE_LABELS[value],
}));

const PET_TYPE_VALUES = new Set<string>(Object.values(PetType));

export function isPetType(value: unknown): value is PetType {
  return typeof value === 'string' && PET_TYPE_VALUES.has(value);
}

function normalizePetTypes(values: unknown[]): PetType[] {
  return [...new Set(values.filter(isPetType))];
}

export function getPetTypeLabel(type: PetType | string) {
  return isPetType(type) ? PET_TYPE_LABELS[type] : type;
}

export function parsePetTypes(value: string | string[] | null | undefined): PetType[] {
  if (Array.isArray(value)) return normalizePetTypes(value);
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? normalizePetTypes(parsed) : [];
  } catch {
    return normalizePetTypes(value.split(',').map((type) => type.trim()));
  }
}

export function serializePetTypes(types: PetType[]) {
  return JSON.stringify(normalizePetTypes(types));
}