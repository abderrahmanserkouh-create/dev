import { createContext, useState, useCallback, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './useAuth';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    try {
      const res = await cartAPI.get();
      setItems(res.data);
    } catch { setItems([]); }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await cartAPI.add(productId, quantity);
    setItems(res.data);
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    const res = await cartAPI.update(id, quantity);
    setItems(res.data);
  };

  const removeItem = async id => {
    const res = await cartAPI.remove(id);
    setItems(res.data);
  };

  const total = items.reduce((sum, item) => sum + (item.sale_price || item.price) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, total, fetchCart, addToCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};


