"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { CartItem, Product } from "@/types/product";
import {
  fetchCart,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi,
} from "@/lib/cart-api";

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    try {
      const cartItems = await fetchCart();
      setItems(cartItems);
      setError(null);
    } catch {
      setError(
        "Unable to load cart. Please ensure the cart service is running."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = useCallback(async (product: Product, quantity = 1) => {
    try {
      const updated = await addToCartApi(product.id, quantity);
      setItems(updated);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add to cart";
      setError(msg);
      console.error("[cart] addToCart failed:", err);
    }
  }, []);

  const removeFromCart = useCallback(async (productId: string) => {
    try {
      const updated = await removeCartItemApi(productId);
      setItems(updated);
      setError(null);
    } catch (err) {
      console.error("[cart] removeFromCart failed:", err);
    }
  }, []);

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity < 0) return;
      try {
        const updated = await updateCartItemApi(productId, quantity);
        setItems(updated);
        setError(null);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to update cart";
        setError(msg);
        console.error("[cart] updateQuantity failed:", err);
      }
    },
    []
  );

  const clearCart = useCallback(async () => {
    try {
      await clearCartApi();
      setItems([]);
      setError(null);
    } catch (err) {
      console.error("[cart] clearCart failed:", err);
    }
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
