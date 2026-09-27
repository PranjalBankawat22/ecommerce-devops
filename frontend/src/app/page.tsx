import Link from "next/link";
import { getProducts } from "@/lib/api";
import { ProductGrid } from "@/components/products/product-grid";

type HomePageProps = {
  searchParams: Promise<{ category?: string; q?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category, q } = await searchParams;
  const products = await getProducts(category, q);

  const heading = q
    ? `Results for "${q}"`
    : category
    ? category
    : "All Products";

  return (
    <>
      {/* Hero — only shown on the unfiltered home page */}
      {!category && !q && (
        <section className="bg-gradient-to-br from-indigo-50 to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
                Everything you need.{" "}
                <span className="text-indigo-600">One simple store.</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                Discover our curated range of electronics, fashion, and
                accessories — all in one place.
              </p>
              <div className="mt-8">
                <Link
                  href="#products"
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  Shop now
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
                      d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product listing */}
      <main
        id="products"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex-1"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{heading}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </p>
          </div>
          {(category || q) && (
            <Link
              href="/"
              className="text-sm text-indigo-600 hover:underline"
            >
              Clear filter
            </Link>
          )}
        </div>

        <ProductGrid products={products} />
      </main>
    </>
  );
}
