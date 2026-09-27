"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";

export function CartSummary() {
  const { items, totalPrice, totalItems, clearCart } = useCart();

  const subtotal = totalPrice;
  const shipping = subtotal > 0 ? (subtotal >= 999 ? 0 : 99) : 0;
  const total = subtotal + shipping;

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
      <h2 className="text-base font-semibold text-gray-900">Order Summary</h2>

      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-600">
            Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})
          </dt>
          <dd className="font-medium text-gray-900">
            ₹{subtotal.toLocaleString("en-IN")}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-600">Shipping</dt>
          <dd className="font-medium text-gray-900">
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `₹${shipping}`
            )}
          </dd>
        </div>
        {shipping > 0 && (
          <p className="text-xs text-gray-400">
            Free shipping on orders over ₹999
          </p>
        )}
        <div className="flex justify-between border-t border-gray-200 pt-3 mt-1">
          <dt className="font-semibold text-gray-900">Total</dt>
          <dd className="font-bold text-gray-900 text-base">
            ₹{total.toLocaleString("en-IN")}
          </dd>
        </div>
      </dl>

      <Button size="lg" className="w-full" disabled>
        Checkout (coming soon)
      </Button>

      {items.length > 0 && (
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors text-center"
        >
          Empty cart
        </button>
      )}
    </div>
  );
}
