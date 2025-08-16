import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
  size?: string;
}

interface CartStore {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: number) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (product) => {
        const { items } = get();
        const existingItem = items.find(item => 
          item.id === product.id && 
          item.variant === product.variant && 
          item.size === product.size
        );

        if (existingItem) {
          set(state => ({
            items: state.items.map(item =>
              item.id === product.id && 
              item.variant === product.variant && 
              item.size === product.size
                ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                : item
            ),
          }));
        } else {
          set(state => ({
            items: [...state.items, { ...product, quantity: product.quantity || 1 }],
          }));
        }

        // Update totals
        const newState = get();
        set({
          totalItems: newState.items.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: newState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        });
      },

      removeItem: (id) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id),
        }));

        // Update totals
        const newState = get();
        set({
          totalItems: newState.items.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: newState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set(state => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));

        // Update totals
        const newState = get();
        set({
          totalItems: newState.items.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: newState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },

      getItemQuantity: (id) => {
        const item = get().items.find(item => item.id === id);
        return item?.quantity || 0;
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);