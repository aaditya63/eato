import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  discountPrice?: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const loadFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("cart", JSON.stringify(items));
};

const calculateTotal = (items: CartItem[]) =>
  items.reduce(
    (sum, item) => sum + (item.discountPrice ?? item.price) * item.quantity,
    0
  );

const initialState: CartState = {
  items: loadFromStorage(),
  total: calculateTotal(loadFromStorage()),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      state.total = calculateTotal(state.items);
      saveToStorage(state.items);
    },


    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) existing.quantity += action.payload.quantity;
      else state.items.push(action.payload);
      state.total = calculateTotal(state.items);
      saveToStorage(state.items);
    },


    updateQuantity(state, action: PayloadAction<{ id: number; quantity: number }>) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) item.quantity = Math.max(1, action.payload.quantity);
      state.total = calculateTotal(state.items);
      saveToStorage(state.items);
    },


    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      state.total = calculateTotal(state.items);
      saveToStorage(state.items);
    },

    
    clearCart(state) {
      state.items = [];
      state.total = 0;
      localStorage.removeItem("cart");
    },
  },
});

export const { setCart, addItem, updateQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
