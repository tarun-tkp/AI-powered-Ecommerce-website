import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, token } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && token) fetchCart();
    else setCart({ items: [], total: 0, itemCount: 0 });
  }, [user, token]);

  const fetchCart = async () => {
    try {
      const data = await cartAPI.getCart();
      setCart(data);
    } catch (e) { /* silent */ }
  };

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const data = await cartAPI.addItem({ productId, quantity });
      setCart(data);
      return true;
    } catch (e) { return false; }
    finally { setLoading(false); }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const data = await cartAPI.updateItem(itemId, { quantity });
      setCart(data);
    } catch (e) { /* silent */ }
  };

  const removeItem = async (itemId) => {
    try {
      const data = await cartAPI.removeItem(itemId);
      setCart(data);
    } catch (e) { /* silent */ }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart({ items: [], total: 0, itemCount: 0 });
    } catch (e) { /* silent */ }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
