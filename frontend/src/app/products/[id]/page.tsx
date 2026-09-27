import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";
import { ProductDetail } from "@/components/products/product-detail";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} — Shoply`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
