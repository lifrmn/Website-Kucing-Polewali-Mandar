'use client';

import { PET_TYPE_OPTIONS } from '@/lib/pet-types';
import { PetType } from '@/types/enums';

interface PetTypeSelectorProps {
  value: PetType[];
  onChange: (value: PetType[]) => void;
  label?: string;
  error?: string;
}

export default function PetTypeSelector({
  value,
  onChange,
  label = 'Jenis hewan yang didukung',
  error,
}: PetTypeSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-text">{label} *</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PET_TYPE_OPTIONS.map((option) => (
          <label key={option.value} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-button border border-border bg-white px-3 text-sm text-text focus-within:ring-2 focus-within:ring-primary">
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={(event) => onChange(event.target.checked
                ? [...value, option.value]
                : value.filter((type) => type !== option.value))}
              className="h-4 w-4 accent-primary-hover"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-danger">{error}</p>}
    </fieldset>
  );
}