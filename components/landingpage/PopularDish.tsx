"use client";
import { useEffect, useState } from "react";
import FoodCard from "../common/FoodCard";
import axios from "axios";

export interface FoodItem {
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

export default function PopularDish() {

  const [FoodItems, setFoodItems] = useState<FoodItem[]>([]);

  useEffect(() => {
    async function fetchPopularDishes() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/food`
        );
        if(res.data.success) {
          setFoodItems(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching popular dishes:", err);
      }
    }
    fetchPopularDishes();
  }, []);


  return (
    <div className="p-8 bg-bgxsurface grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FoodItems.map((item) => <FoodCard key={item.id} item={item} />)}
    </div>
  );
}