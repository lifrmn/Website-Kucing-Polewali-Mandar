import type { Product, ProductVariant } from '@prisma/client';
import { parsePetTypes } from '@/lib/pet-types';
import type { PetType } from '@/types/enums';

export type ProductResponse = Omit<Product, 'pet_types'> & {
  pet_types: PetType[];
  variants: Array<Omit<ProductVariant, 'attributes'> & {
    attributes: Record<string, string>;
  }>;
};

export function toProductResponse(
  product: Product & { variants: ProductVariant[] }
): ProductResponse {
  return {
    ...product,
    pet_types: parsePetTypes(product.pet_types),
    variants: product.variants.map((variant) => {
      let attributes: Record<string, string> = {};
      try {
        const parsed = JSON.parse(variant.attributes);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          attributes = Object.fromEntries(
            Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
          );
        }
      } catch {
        attributes = {};
      }
      return { ...variant, attributes };
    }),
  };
}
