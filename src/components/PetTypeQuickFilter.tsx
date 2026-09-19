'use client';

import { PET_TYPE_OPTIONS } from '@/lib/pet-types';
import { cn } from '@/lib/utils';
import { PetType } from '@/types/enums';

export type PetTypeFilterValue = 'all' | PetType;

interface PetTypeQuickFilterProps {
  value: PetTypeFilterValue;
  onChange: (value: PetTypeFilterValue) => void;
}

const FILTER_OPTIONS: Array<{ value: PetTypeFilterValue; label: string }> = [
  { value: 'all', label: 'Semua' },
  ...PET_TYPE_OPTIONS,
];

export default function PetTypeQuickFilter({ value, onChange }: PetTypeQuickFilterProps) {
  return (
    <div className="overflow-x-auto pb-1" role="group" aria-label="Filter cepat jenis hewan">
      <div className="inline-flex min-w-max gap-1 rounded-button border border-border bg-surface2 p-1">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'min-h-10 rounded-md px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-hover',
              value === option.value
                ? 'bg-white text-text shadow-sm'
                : 'text-muted hover:bg-white/70 hover:text-text'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}