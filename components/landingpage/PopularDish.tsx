"use client";
import { useEffect, useState } from "react";
import FoodCard from "../common/FoodCard";
import axios from "axios";
import LoadingSpinner from "../loader/Spinner";

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

  const [loading,setLoading] = useState(false)

  useEffect(() => {
    async function fetchPopularDishes() {
      try {
        setLoading(true)
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/food?page=1&limit=4`
        );
        if (res.data.success) {
          setFoodItems(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching popular dishes:", err);
      }finally{
        setLoading(false)
      }
    }
    fetchPopularDishes();
  }, []);
  return (
    <div className="bg-bgxsurface w-full">
      <p className="text-3xl w-full text-center pt-8 text-btnxprimary font-extrabold">Our Popular Dishes</p>
      {!loading ? <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          { FoodItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
      </div>:
      <div className="w-full flex items-center justify-center p-8">
        <LoadingSpinner size={50}/>
      </div>
      }
    </div>
  );
}
