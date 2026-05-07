import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const exists = state.find((i) => i._id === action.product._id);
      if (exists) {
        return state.map((i) =>
          i._id === action.product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...state, { ...action.product, quantity: 1 }];
    }
    case 'REMOVE':
      return state.filter((i) => i._id !== action.id);
    case 'UPDATE_QTY':
      return state.map((i) =>
        i._id === action.id ? { ...i, quantity: action.qty } : i
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const saved = JSON.parse(localStorage.getItem('cart') || '[]');
  const [items, dispatch] = useReducer(cartReducer, saved);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  const addToCart = (product) => dispatch({ type: 'ADD', product });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE', id });
  const updateQty = (id, qty) => {
    if (qty < 1) return dispatch({ type: 'REMOVE', id });
    dispatch({ type: 'UPDATE_QTY', id, qty });
  };
  const clearCart = () => dispatch({ type: 'CLEAR' });

  return (
    <CartContext.Provider
      value={{ items, total, count, addToCart, removeFromCart, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
