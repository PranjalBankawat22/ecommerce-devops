import type { Product } from "@/types/product";

const PRODUCT_SERVICE_URL =
  process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:4001";

export async function getProducts(
  category?: string,
  search?: string
): Promise<Product[]> {
  const url = new URL(`${PRODUCT_SERVICE_URL}/api/products`);
  if (category) url.searchParams.set("category", category);
  if (search) url.searchParams.set("search", search);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Product Service error: ${res.status}`);
  }
  return res.json() as Promise<Product[]>;
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${PRODUCT_SERVICE_URL}/api/products/${id}`, {
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return res.json() as Promise<Product>;
  } catch {
    console.error(`[api] Failed to fetch product ${id}`);
    return null;
  }
}
