import { Bird, Cat, Dog, PawPrint, Rabbit, Rat, type LucideIcon } from 'lucide-react';

import AppIcon from '@/components/AppIcon';
import { cn } from '@/lib/utils';
import { getPetTypeLabel } from '@/lib/pet-types';
import { PetType } from '@/types/enums';

const PET_TYPE_ICONS: Record<PetType, LucideIcon> = {
  [PetType.CAT]: Cat,
  [PetType.DOG]: Dog,
  [PetType.RABBIT]: Rabbit,
  [PetType.HAMSTER]: Rat,
  [PetType.BIRD]: Bird,
  [PetType.OTHER]: PawPrint,
};

interface PetTypeBadgeProps {
  type: PetType | string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export default function PetTypeBadge({
  type,
  size = 'sm',
  showLabel = true,
  className,
}: PetTypeBadgeProps) {
  const normalizedType = type in PET_TYPE_ICONS ? type as PetType : PetType.OTHER;
  const Icon = PET_TYPE_ICONS[normalizedType];
  const label = getPetTypeLabel(type);

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-[#DED6C9] bg-[#F7F1EA] font-medium text-text',
        size === 'sm' ? 'min-h-7 gap-1.5 px-2.5 text-xs' : 'min-h-9 gap-2 px-3 text-sm',
        className
      )}
      aria-label={showLabel ? undefined : label}
      title={showLabel ? undefined : label}
    >
      <AppIcon icon={Icon} size={size === 'sm' ? 'xs' : 'sm'} aria-hidden="true" />
      {showLabel && <span>{label}</span>}
    </span>
  );
}