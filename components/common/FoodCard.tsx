"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Minus, Plus } from "lucide-react";
import { useCart } from "../../lib/redux/cart/useCart";
import { useEffect, useState } from "react";

interface FoodItem {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  imageUrl: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  preparationTime: number;
  calories: number;
}

const FoodCard = ({ item }: { item: FoodItem }) => {
  const { items, addToCart, changeQuantity, removeFromCart } = useCart();

  //quantity of current item in cart
  const currentCartItem = items.find((i) => i.id === item.id);
  const quantity = currentCartItem ? currentCartItem.quantity : 0;

  //handle cart actions
  const handleCartAction = (action: "add" | "increase" | "decrease" | "remove") => {
    if (action === "add") {
      addToCart(
        {
          id: item.id,
          name: item.name,
          imageUrl: item.imageUrl,
          price: parseFloat(item.price),
          discountPrice: parseFloat(item.discountPrice),
        },
        1
      );
    } else if (action === "increase") {
      changeQuantity(item.id, quantity + 1);
    } else if (action === "decrease") {
      if (quantity > 1) changeQuantity(item.id, quantity - 1);
      else removeFromCart(item.id);
    } else if (action === "remove") {
      removeFromCart(item.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="bg-card rounded-2xl overflow-hidden shadow-card group"
    >
      <div className="relative overflow-hidden h-48">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl  font-bold mb-2">{item.name}</h3>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-textxsecondary mr-2">
              ₹{parseFloat(item.discountPrice).toFixed(2)}
            </span>
            <span className="text-textxsecondary line-through text-sm">
              ₹{parseFloat(item.price).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          {quantity > 0 ? (
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCartAction("decrease")}
                className="p-2 cursor-pointer bg-textxsecondary hover:bg-textxsecondary/90 text-bgxbase hover:text-bgxbase"
              >
                <Minus size={16} />
              </Button>
              <span className="font-semibold text-lg">{quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCartAction("increase")}
                className="p-2 cursor-pointer bg-textxsecondary hover:bg-textxsecondary/90 text-bgxbase hover:text-bgxbase"
              >
                <Plus size={16} />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="bg-textxsecondary text-bgxbase hover:bg-textxsecondary/90 cursor-pointer"
              onClick={() => handleCartAction("add")}
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;
