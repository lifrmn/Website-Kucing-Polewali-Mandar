import type { Service } from '@prisma/client';
import { parsePetTypes } from '@/lib/pet-types';
import type { PetType } from '@/types/enums';

export type ServiceResponse = Omit<Service, 'supported_pet_types'> & {
  supported_pet_types: PetType[];
};

export function toServiceResponse(service: Service): ServiceResponse {
  return {
    ...service,
    supported_pet_types: parsePetTypes(service.supported_pet_types),
  };
}