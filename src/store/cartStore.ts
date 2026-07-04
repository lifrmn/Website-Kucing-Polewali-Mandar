import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from '@/types';

// Cart version for schema migration
const CART_VERSION = 1;

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  version: number;
  
  // Core Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string, type: 'product' | 'service', variantId?: string) => void;
  updateQuantity: (id: string, type: 'product' | 'service', quantity: number, variantId?: string) => void;
  clearCart: () => void;
  
  // Enhanced Actions
  validateStock: () => Promise<{ valid: boolean; errors: string[] }>;
  syncWithServer: () => Promise<void>;
  
  // Calculations
  getTotal: () => number;
  getItemCount: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  
  // UI Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      version: CART_VERSION,

      addItem: (item) => {
        const existingItemIndex = get().items.findIndex(
          (i) => 
            i.id === item.id && 
            i.type === item.type &&
            i.variantId === item.variantId
        );

        if (existingItemIndex !== -1) {
          // Update existing item quantity
          set((state) => ({
            items: state.items.map((i, index) =>
              index === existingItemIndex
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            ),
          }));
        } else {
          // Add new item
          set((state) => ({
            items: [...state.items, { ...item, quantity: item.quantity || 1 }],
          }));
        }
        
        // Show success toast in client component
        if (typeof window !== 'undefined') {
          const event = new CustomEvent('cart:item-added', { detail: item });
          window.dispatchEvent(event);
        }
      },

      removeItem: (id, type, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(
              item.id === id && 
              item.type === type &&
              item.variantId === variantId
            )
          ),
        }));
        
        if (typeof window !== 'undefined') {
          const event = new CustomEvent('cart:item-removed');
          window.dispatchEvent(event);
        }
      },

      updateQuantity: (id, type, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(id, type, variantId);
        } else {
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id && 
              item.type === type &&
              item.variantId === variantId
                ? { ...item, quantity }
                : item
            ),
          }));
        }
      },

      clearCart: () => {
        set({ items: [], isOpen: false });
      },

      // Enhanced: Validate stock before checkout
      validateStock: async () => {
        const items = get().items;
        
        try {
          // Call API to validate stock
          const response = await fetch('/api/cart/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
          });
          
          const data = await response.json();
          
          if (!data.valid) {
            return { valid: false, errors: data.errors || ['Stock validation failed'] };
          }
          
          return { valid: true, errors: [] };
        } catch (error) {
          console.error('Stock validation error:', error);
          return { valid: false, errors: ['Unable to validate stock. Please try again.'] };
        }
      },

      // Enhanced: Sync cart with server (for logged-in users)
      syncWithServer: async () => {
        const items = get().items;
        
        try {
          await fetch('/api/cart/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
          });
        } catch (error) {
          console.error('Cart sync error:', error);
        }
      },

      getTotal: () => {
        return get().getSubtotal() + get().getShipping();
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        // Free shipping over Rp 100,000
        return subtotal >= 100000 ? 0 : 10000;
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
    }),
    {
      name: 'cikal-pet-care-cart',
      version: CART_VERSION,
      storage: createJSONStorage(() => localStorage),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      migrate: (persistedState: any, version: number) => {
        // Handle cart schema migrations
        if (version < CART_VERSION) {
          // Migration logic for future versions
          return {
            ...persistedState,
            version: CART_VERSION,
          };
        }
        return persistedState;
      },
    }
  )
);

