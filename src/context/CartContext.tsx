import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../types";

export interface CartLine {
  product: Product;
  qty: number;
}

interface CartContextValue {
  lines: CartLine[];
  totalQty: number;
  totalAmount: number;
  setQty: (product: Product, qty: number) => void;
  getQty: (productId: string) => number;
  clearCart: () => void;
}

const CART_KEY = "pyrotown_cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<string, CartLine>>(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) ?? "{}"); } catch { return {}; }
  });

  // Sync cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const setQty = (product: Product, qty: number) => {
    setItems((prev) => {
      const next = { ...prev };
      if (qty <= 0) {
        delete next[product.id];
      } else {
        next[product.id] = { product, qty };
      }
      return next;
    });
  };

  const getQty = (productId: string) => items[productId]?.qty ?? 0;
  const clearCart = () => setItems({});

  const lines = useMemo(() => Object.values(items), [items]);
  const totalQty = lines.reduce((sum, l) => sum + l.qty, 0);
  const totalAmount = lines.reduce(
    (sum, l) => sum + l.qty * l.product.discountPrice,
    0
  );

  return (
    <CartContext.Provider
      value={{ lines, totalQty, totalAmount, setQty, getQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
