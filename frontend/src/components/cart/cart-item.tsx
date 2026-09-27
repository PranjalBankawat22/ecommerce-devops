"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartItem } from "@/types/product";
import { useCart } from "@/context/cart-context";
import { QuantitySelector } from "@/components/ui/quantity-selector";

export function CartItemRow({ item }: { item: CartItem }) {
  const { removeFromCart, updateQuantity } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex gap-4 py-4">
      <Link
        href={`/products/${product.id}`}
        className="shrink-0 relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-100"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="80px"
          unoptimized
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${product.id}`}
            className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2"
          >
            {product.name}
          </Link>
          <button
            type="button"
            onClick={() => removeFromCart(product.id)}
            aria-label={`Remove ${product.name} from cart`}
            className="shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <span className="text-xs text-gray-500">{product.category}</span>

        <div className="flex items-center justify-between gap-3 mt-auto">
          <QuantitySelector
            value={quantity}
            max={product.stock}
            onChange={(q) => updateQuantity(product.id, q)}
          />
          <span className="text-sm font-semibold text-gray-900">
            ₹{(product.price * quantity).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}
