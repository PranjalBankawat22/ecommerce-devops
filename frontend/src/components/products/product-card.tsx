"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types/product";
import { useCart } from "@/context/cart-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return <Badge variant="error">Out of stock</Badge>;
  if (stock <= 10)
    return <Badge variant="warning">Only {stock} left</Badge>;
  return <Badge variant="success">In stock</Badge>;
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="group flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
            {product.category}
          </span>
          <StockBadge stock={product.stock} />
        </div>

        <Link href={`/products/${product.id}`} className="hover:text-indigo-600 transition-colors">
          <h2 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
            {product.name}
          </h2>
        </Link>

        <p className="text-xs text-gray-500 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-500">
            ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 mt-auto pt-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="shrink-0"
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? "Added!" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </article>
  );
}
