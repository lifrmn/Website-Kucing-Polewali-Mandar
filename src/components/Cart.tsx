'use client'

import { CircleAlert, Minus, Package, Plus, ShoppingBag, ShoppingCart, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import type { CartItem } from '@/types';

export default function Cart() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotal,
  } = useCartStore();
  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside className="fixed inset-y-0 right-0 z-[60] flex h-full w-full max-w-md flex-col bg-white shadow-2xl" role="dialog" aria-modal="true" aria-label="Keranjang belanja">
        <div className="flex items-center justify-between border-b border-border bg-white p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-button bg-primary">
              <ShoppingCart className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text">Keranjang</h2>
              <p className="text-xs text-muted">{items.length} item</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="flex h-11 w-11 items-center justify-center rounded-button text-muted transition-colors hover:bg-surface2 hover:text-text"
            aria-label="Tutup keranjang"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-bg p-5 sm:p-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-surface2">
                <ShoppingBag className="h-9 w-9 text-muted" />
              </div>
              <p className="mb-2 text-xl font-semibold text-text">Keranjang Anda masih kosong</p>
              <p className="mb-6 max-w-xs text-sm text-muted">Temukan kebutuhan terbaik untuk kucing Anda di halaman produk.</p>
              <button onClick={() => { closeCart(); router.push('/produk'); }} className="btn-primary">Lihat Produk</button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item: CartItem) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="rounded-card border border-border bg-white p-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    {item.image_url && (
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-button bg-surface2">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    {!item.image_url && (
                      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-button bg-surface2">
                        <Package className="h-7 w-7 text-muted" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 line-clamp-2 font-semibold text-text">
                        {item.name}
                      </h3>
                      <p className="mb-3 font-semibold text-dark-gold">
                        {formatPrice(item.price)}
                      </p>

                      <div className="inline-flex items-center rounded-button border border-border bg-white">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.type, item.quantity - 1, item.variantId)
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-l-button text-text hover:bg-surface2"
                          aria-label={`Kurangi jumlah ${item.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-bold text-lg text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.type, item.quantity + 1, item.variantId)
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-r-button text-text hover:bg-surface2 disabled:cursor-not-allowed disabled:opacity-40"
                          disabled={item.stock ? item.quantity >= item.stock : false}
                          aria-label={`Tambah jumlah ${item.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {item.stock && item.quantity >= item.stock && (
                        <p className="mt-2 flex items-center gap-1 text-xs font-medium text-danger">
                          <CircleAlert className="h-3.5 w-3.5" /> Stok maksimal: {item.stock}
                        </p>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id, item.type, item.variantId)}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-button text-danger transition-colors hover:bg-red-50"
                      title="Hapus item"
                      aria-label={`Hapus ${item.name} dari keranjang`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3 border-t border-border bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6">
            <div className="flex items-center justify-between rounded-button bg-surface2 p-4">
              <span className="font-medium text-text">Total Belanja</span>
              <span className="text-xl font-bold text-dark-gold">{formatPrice(getTotal())}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-button bg-primary px-5 font-semibold text-[#2A2A1A] shadow-sm transition-colors hover:bg-primary-hover"
            >
              <ShoppingCart className="h-5 w-5" />
              Lanjut ke Checkout
            </button>

            <button
              onClick={closeCart}
              className="min-h-12 w-full rounded-button border border-border px-5 font-semibold text-text transition-colors hover:bg-surface2"
            >
              Lanjut Belanja
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
