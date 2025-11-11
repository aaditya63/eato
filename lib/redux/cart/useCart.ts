// /src/redux/hooks/useCart.ts
"use client";

import axios from "axios";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  addItem,
  removeItem,
  updateQuantity,
  setCart,
  clearCart,
} from "./cartSlice";

// interface UserInfo {
//   id?: number;
//   isLoggedIn?: boolean;
// }

export function useCart() {
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
    const { isUserLoggedIn, user } = useAppSelector((state) => state.auth);


  const fetchServerCart = async () => {
    if (!isUserLoggedIn) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`
      );

      if (res.data.success) {
        const serverItems = res.data.data.cartItems.map((ci: any) => ({
          id: ci.foodItemId,
          name: ci.foodItem.name,
          imageUrl: ci.foodItem.imageUrl,
          price: parseFloat(ci.foodItem.price),
          discountPrice: parseFloat(ci.foodItem.discountPrice),
          quantity: ci.quantity,
        }));
        dispatch(setCart(serverItems));
      }
    } catch (err) {
      console.error("Error fetching server cart:", err);
    }
  };

  const addToCart = async (item: any, qty = 1) => {
    dispatch(addItem({ ...item, quantity: qty }));

    if (isUserLoggedIn) {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
          foodItemId: item.id,
          quantity: qty,
        });
      } catch (err) {
        console.error(" Error syncing add:", err);
      }
    }
  };

  const changeQuantity = async (id: number, qty: number) => {
    dispatch(updateQuantity({ id, quantity: qty }));

    if (isUserLoggedIn) {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
          foodItemId: id,
          quantity: qty,
        });
      } catch (err) {
        console.error("Error syncing quantity:", err);
      }
    }
  };

  const removeFromCart = async (id: number) => {
    dispatch(removeItem(id));
    if (isUserLoggedIn) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
          data: { foodItemId: id },
        });
      } catch (err) {
        console.error("Error syncing remove:", err);
      }
    }
  };

  const mergeGuestCart = async () => {
    if (!isUserLoggedIn) return;
    try {
      const localItems = JSON.parse(localStorage.getItem("cart") || "[]");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`
      );
      const serverItems = res.data.data?.cartItems || [];

      const merged = [...serverItems];
      for (const local of localItems) {
        const found = merged.find((s: any) => s.foodItemId === local.id);

        //If present in server cart, increase quantity,.. we will reconfigure later
        if (found) found.quantity += local.quantity;
        else
          merged.push({
            //Else add new item
            foodItemId: local.id,
            quantity: local.quantity,
          });
      }

      // Sync merged cart to backend
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
        items: merged.map((m) => ({
            foodItemId: m.foodItemId,
            quantity: m.quantity,
        })),
      });

      // Clear guest storage and reload server cart
      localStorage.removeItem("cart");
      await fetchServerCart();
    } catch (err) {
      console.error("Error merging carts:", err);
    }
  };

  // Clear all (guest + redux)
  const clearAll = () => {
    dispatch(clearCart());
  };

  return {
    items,
    total,
    addToCart,
    changeQuantity,
    removeFromCart,
    clearAll,
    fetchServerCart,
    mergeGuestCart,
  };
}
