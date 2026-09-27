import { redis } from '../config/redis';

const CART_TTL = 60 * 60 * 24 * 7; // 7 days
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:4001';

export interface CartStoredItem {
  productId: string;
  quantity: number;
}

export interface CartData {
  userId: string;
  items: CartStoredItem[];
}

export interface ProductInfo {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export interface CartResponseItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  userId: string;
  items: CartResponseItem[];
  totalItems: number;
  subtotal: number;
}

function cartKey(userId: string): string {
  return `cart:${userId}`;
}

async function getCartData(userId: string): Promise<CartData> {
  const raw = await redis.get(cartKey(userId));
  if (!raw) return { userId, items: [] };
  return JSON.parse(raw) as CartData;
}

async function saveCartData(userId: string, data: CartData): Promise<void> {
  await redis.set(cartKey(userId), JSON.stringify(data), 'EX', CART_TTL);
}

export async function fetchProduct(productId: string): Promise<ProductInfo | null> {
  const res = await fetch(`${PRODUCT_SERVICE_URL}/api/products/${productId}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    const err = new Error('Product Service unavailable') as Error & { statusCode: number };
    err.statusCode = 503;
    throw err;
  }
  return res.json() as Promise<ProductInfo>;
}

async function enrichCart(data: CartData): Promise<CartResponse> {
  const enrichedItems: CartResponseItem[] = [];

  for (const item of data.items) {
    const product = await fetchProduct(item.productId);
    if (product) {
      enrichedItems.push({
        productId: item.productId,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      });
    }
  }

  const totalItems = enrichedItems.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = enrichedItems.reduce((sum, i) => sum + i.subtotal, 0);

  return { userId: data.userId, items: enrichedItems, totalItems, subtotal };
}

export async function getCart(userId: string): Promise<CartResponse> {
  const data = await getCartData(userId);
  return enrichCart(data);
}

export async function addItem(userId: string, productId: string, quantity: number): Promise<CartResponse> {
  const product = await fetchProduct(productId);
  if (!product) {
    const err = new Error('Product not found') as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }

  const data = await getCartData(userId);
  const existing = data.items.find((i) => i.productId === productId);
  const newQty = (existing?.quantity ?? 0) + quantity;

  if (newQty > product.stock) {
    const err = new Error(`Insufficient stock: only ${product.stock} units available`) as Error & { statusCode: number };
    err.statusCode = 400;
    throw err;
  }

  if (existing) {
    existing.quantity = newQty;
  } else {
    data.items.push({ productId, quantity });
  }

  await saveCartData(userId, data);
  return enrichCart(data);
}

export async function updateItem(userId: string, productId: string, quantity: number): Promise<CartResponse> {
  const data = await getCartData(userId);
  const existing = data.items.find((i) => i.productId === productId);

  if (!existing) {
    const err = new Error('Item not in cart') as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }

  if (quantity === 0) {
    data.items = data.items.filter((i) => i.productId !== productId);
  } else {
    const product = await fetchProduct(productId);
    if (!product) {
      const err = new Error('Product not found') as Error & { statusCode: number };
      err.statusCode = 404;
      throw err;
    }
    if (quantity > product.stock) {
      const err = new Error(`Insufficient stock: only ${product.stock} units available`) as Error & { statusCode: number };
      err.statusCode = 400;
      throw err;
    }
    existing.quantity = quantity;
  }

  await saveCartData(userId, data);
  return enrichCart(data);
}

export async function removeItem(userId: string, productId: string): Promise<CartResponse> {
  const data = await getCartData(userId);
  data.items = data.items.filter((i) => i.productId !== productId);
  await saveCartData(userId, data);
  return enrichCart(data);
}

export async function clearCart(userId: string): Promise<void> {
  await redis.del(cartKey(userId));
}
