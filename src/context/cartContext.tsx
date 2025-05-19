"use client";

import { OrderItem } from "@/services/orderService";
import { MenuItemUI } from "@/components/restaurantes/MenuTab";
import React, { createContext, useState, useContext, useEffect } from "react";

interface CartContextType {
  cartItems: OrderItem[];
  addToCart: (item: MenuItemUI) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
  calculateTotal: () => number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    const count = cartItems.reduce((acc, item) => acc + item.quantidade, 0);
    setItemCount(count);

    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: MenuItemUI) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.itemId === item.id);
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.itemId === item.id
            ? { ...cartItem, quantidade: cartItem.quantidade + 1 }
            : cartItem
        );
      } else {
        return [
          ...prev,
          {
            itemId: item.id,
            quantidade: 1,
            precoUnit: item.preco,
            itemName: item.nome,
            restauranteId: item.restauranteId,
            imageUrl: item.imagemUrl,
          },
        ];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.itemId === itemId);
      if (existingItem && existingItem.quantidade > 1) {
        return prev.map((item) =>
          item.itemId === itemId
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        );
      } else {
        return prev.filter((item) => item.itemId !== itemId);
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemQuantity = (itemId: string) => {
    const item = cartItems.find((item) => item.itemId === itemId);
    return item ? item.quantidade : 0;
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.precoUnit * item.quantidade,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getItemQuantity,
        calculateTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
