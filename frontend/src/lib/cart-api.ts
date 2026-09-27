import type { CartItem } from "@/types/product";

const CART_SERVICE_URL =
  process.env.NEXT_PUBLIC_CART_SERVICE_URL || "http://localhost:4002";

export const CART_USER_ID = "user-123";

type CartApiItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  quantity: number;
  subtotal: number;
};

type CartApiResponse = {
  userId: string;
  items: CartApiItem[];
  totalItems: number;
  subtotal: number;
};

function toCartItem(item: CartApiItem): CartItem {
  return {
    product: {
      id: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      stock: item.stock,
      description: "",
      rating: 0,
      reviewCount: 0,
    },
    quantity: item.quantity,
  };
}

export async function fetchCart(): Promise<CartItem[]> {
  const res = await fetch(`${CART_SERVICE_URL}/api/cart/${CART_USER_ID}`);
  if (!res.ok) throw new Error("Failed to fetch cart");
  const data = (await res.json()) as CartApiResponse;
  return data.items.map(toCartItem);
}

export async function addToCartApi(
  productId: string,
  quantity: number
): Promise<CartItem[]> {
  const res = await fetch(
    `${CART_SERVICE_URL}/api/cart/${CART_USER_ID}/items`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    }
  );
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error || "Failed to add to cart");
  }
  const data = (await res.json()) as CartApiResponse;
  return data.items.map(toCartItem);
}

export async function updateCartItemApi(
  productId: string,
  quantity: number
): Promise<CartItem[]> {
  const res = await fetch(
    `${CART_SERVICE_URL}/api/cart/${CART_USER_ID}/items/${productId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    }
  );
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error || "Failed to update cart");
  }
  const data = (await res.json()) as CartApiResponse;
  return data.items.map(toCartItem);
}

export async function removeCartItemApi(productId: string): Promise<CartItem[]> {
  const res = await fetch(
    `${CART_SERVICE_URL}/api/cart/${CART_USER_ID}/items/${productId}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error("Failed to remove cart item");
  const data = (await res.json()) as CartApiResponse;
  return data.items.map(toCartItem);
}

export async function clearCartApi(): Promise<void> {
  const res = await fetch(
    `${CART_SERVICE_URL}/api/cart/${CART_USER_ID}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error("Failed to clear cart");
}
