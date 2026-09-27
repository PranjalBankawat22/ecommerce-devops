import type { Product } from "@/types/product";
import { ProductCard } from "./product-card";

type ProductGridProps = {
  products: Product[];
  emptyMessage?: string;
};

export function ProductGrid({
  products,
  emptyMessage = "No products found.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
        <p className="text-gray-400 text-sm mt-1">
          Try a different search term or category.
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Product list">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
