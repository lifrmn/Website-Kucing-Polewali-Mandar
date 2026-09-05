import type { Product, ProductVariant } from '@prisma/client';

export type ProductResponse = Omit<Product, never> & {
  variants: Array<Omit<ProductVariant, 'attributes'> & {
    attributes: Record<string, string>;
  }>;
};

export function toProductResponse(
  product: Product & { variants: ProductVariant[] }
): ProductResponse {
  return {
    ...product,
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
