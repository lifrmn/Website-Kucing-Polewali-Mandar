'use client'

import { X, ShoppingCart, Trash2 } from 'lucide-react';
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
      {/* Overlay with animation */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300 animate-fadeInUp"
        onClick={closeCart}
      ></div>

      {/* Cart Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-br from-white via-gray-50 to-primary-50 shadow-2xl z-[60] flex flex-col animate-slideInLeft">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-primary-100 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Keranjang</h2>
              <p className="text-xs text-gray-500">{items.length} item</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-300 hover:rotate-90 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fadeInUp">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 animate-float">
                <ShoppingCart className="w-20 h-20 text-gray-400" />
              </div>
              <p className="text-gray-700 text-xl font-bold mb-2">Keranjang Kosong</p>
              <p className="text-gray-500 text-sm">
                Yuk tambahkan produk favorit Anda!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item: CartItem, index) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="group bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary-200 animate-fadeInUp"
                  style={{animationDelay: `${index * 50}ms`}}
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    {item.image_url && (
                      <div className="relative overflow-hidden rounded-xl">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-20 h-20 object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1 group-hover:text-primary-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-primary-600 font-bold text-lg mb-2">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Control */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.type, item.quantity - 1)
                          }
                          className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 rounded-lg hover:from-primary-500 hover:to-emerald-600 hover:text-white hover:border-primary-500 transition-all duration-300 font-bold hover:scale-110 active:scale-95"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-bold text-lg text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.type, item.quantity + 1)
                          }
                          className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-primary-500 to-emerald-600 text-white border-2 border-primary-500 rounded-lg hover:from-primary-600 hover:to-emerald-700 transition-all duration-300 font-bold hover:scale-110 active:scale-95"
                          disabled={item.stock ? item.quantity >= item.stock : false}
                        >
                          +
                        </button>
                      </div>

                      {/* Stock Warning */}
                      {item.stock && item.quantity >= item.stock && (
                        <p className="text-red-500 text-xs mt-1 font-semibold animate-pulse">
                          ⚠️ Stok maksimal: {item.stock}
                        </p>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id, item.type)}
                      className="w-10 h-10 flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95"
                      title="Hapus item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t-2 border-primary-100 p-6 space-y-4 bg-white/80 backdrop-blur-sm">
            {/* Total */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary-50 to-emerald-50 rounded-xl">
              <span className="text-lg font-bold text-gray-700">Total Belanja:</span>
              <span className="text-3xl font-bold text-gradient-primary">{formatPrice(getTotal())}</span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-primary-500 via-emerald-600 to-primary-600 hover:from-primary-600 hover:via-emerald-700 hover:to-primary-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>🛒</span>
                <span>Lanjut ke Checkout</span>
              </span>
              {/* Shine effect */}
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>

            {/* Continue Shopping */}
            <button
              onClick={closeCart}
              className="w-full border-2 border-primary-300 text-primary-700 py-3 rounded-xl font-bold hover:bg-primary-50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              🛍️ Lanjut Belanja
            </button>
          </div>
        )}
      </div>
    </>
  );
}
