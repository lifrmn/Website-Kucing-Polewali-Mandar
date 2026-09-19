export const FULFILLMENT_TYPES = ['DELIVERY', 'PICKUP'] as const;
export type FulfillmentType = typeof FULFILLMENT_TYPES[number];

export const DELIVERY_AREAS = ['POLEWALI', 'WONOMULYO', 'TINAMBUNG', 'OTHER'] as const;
export type DeliveryArea = typeof DELIVERY_AREAS[number];

export const DELIVERY_AREA_LABELS: Record<DeliveryArea, string> = {
  POLEWALI: 'Polewali',
  WONOMULYO: 'Wonomulyo',
  TINAMBUNG: 'Tinambung',
  OTHER: 'Kecamatan lainnya',
};

export interface ShippingRates {
  freeShippingThreshold: number;
  polewaliDeliveryFee: number;
  wonomulyoDeliveryFee: number;
  tinambungDeliveryFee: number;
  otherDeliveryFee: number;
}

export const DEFAULT_SHIPPING_RATES: ShippingRates = {
  freeShippingThreshold: 100_000,
  polewaliDeliveryFee: 10_000,
  wonomulyoDeliveryFee: 15_000,
  tinambungDeliveryFee: 20_000,
  otherDeliveryFee: 25_000,
};

export function calculateShipping(
  subtotal: number,
  fulfillmentType: FulfillmentType = 'DELIVERY',
  deliveryArea: DeliveryArea = 'POLEWALI',
  rates: ShippingRates = DEFAULT_SHIPPING_RATES
) {
  if (fulfillmentType === 'PICKUP' || subtotal >= rates.freeShippingThreshold) return 0;
  const fees: Record<DeliveryArea, number> = {
    POLEWALI: rates.polewaliDeliveryFee,
    WONOMULYO: rates.wonomulyoDeliveryFee,
    TINAMBUNG: rates.tinambungDeliveryFee,
    OTHER: rates.otherDeliveryFee,
  };
  return fees[deliveryArea];
}