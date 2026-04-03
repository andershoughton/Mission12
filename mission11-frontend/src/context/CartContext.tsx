import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface CartItem {
  bookId: number;
  title: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: { bookId: number; title: string; price: number }) => void;
  clearCart: () => void;
}

// create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// provider wraps the whole app so any component can access the cart
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  function addToCart(book: { bookId: number; title: string; price: number }) {
    setCart(prev => {
      const existing = prev.find(item => item.bookId === book.bookId);
      if (existing) {
        // if already in cart just bump the quantity
        return prev.map(item =>
          item.bookId === book.bookId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// custom hook to use the cart anywhere
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
