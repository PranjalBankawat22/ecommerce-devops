"use client";

import { useCart } from "@/context/cart-context";
import { CartItemRow } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyCart } from "@/components/cart/empty-cart";

export default function CartPage() {
  const { items, isLoading, error } = useCart();

  if (isLoading) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p className="text-red-700 font-medium mb-2">Unable to load cart</p>
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex-1">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Shopping Cart
        {items.length > 0 && (
          <span className="ml-2 text-base font-normal text-gray-400">
            ({items.length} item{items.length !== 1 ? "s" : ""})
          </span>
        )}
      </h1>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 px-4 sm:px-6">
            {items.map((item) => (
              <CartItemRow key={item.product.id} item={item} />
            ))}
          </div>
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      )}
    </main>
  );
}
