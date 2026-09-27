"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types/product";
import { useCart } from "@/context/cart-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { StarRating } from "@/components/ui/star-rating";

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge variant="error">Out of stock</Badge>;
  if (stock <= 10) return <Badge variant="warning">Only {stock} left</Badge>;
  return <Badge variant="success">In stock</Badge>;
}

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-8"
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
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        Back to products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
            className="object-cover"
            priority
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="mt-1 text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <StarRating rating={product.rating} />
            <span className="text-sm text-gray-500 font-medium">
              {product.rating}
            </span>
            <span className="text-sm text-gray-400">
              ({product.reviewCount} reviews)
            </span>
          </div>

          <p className="text-3xl font-bold text-gray-900">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          <div>
            <StockBadge stock={product.stock} />
          </div>

          {product.stock > 0 && (
            <>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Quantity</span>
                <QuantitySelector
                  value={quantity}
                  max={product.stock}
                  onChange={setQuantity}
                />
              </div>

              <Button
                size="lg"
                onClick={handleAdd}
                className="w-full sm:w-auto"
              >
                {added ? "Added to Cart!" : "Add to Cart"}
              </Button>
            </>
          )}

          {product.stock === 0 && (
            <p className="text-sm text-gray-500">
              This item is currently out of stock. Check back soon.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
