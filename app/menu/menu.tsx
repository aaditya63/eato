"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Sprout, SlidersHorizontal, X } from "lucide-react";
import FoodCard from "@/components/common/FoodCard";
import LoadingSpinner from "@/components/loader/Spinner";
import { useSearchParams } from "next/navigation";


const Menu = () => {

  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDietType, setSelectedDietType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([100, 1000]);
  const [sortOrder, setSortOrder] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  // Data
  const [foods, setFoods] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  //lates fetch with api
  const categories = [
    { id: "9", name: "Burger" },
    { id: "8", name: "Pasta" },
  ];

  //check if called from category CTA and have to show specific category
  useEffect(() => {
  if (!q) return;
    setSelectedCategory(q);
}, [q]);

  // Build Query Params
  const buildQuery = (pageNum: number) => {
    const params = new URLSearchParams();

    params.set("page", String(pageNum));
    params.set("limit", "10");

    if (searchQuery.trim()) params.set("search", searchQuery.trim());

    if (selectedDietType === "all") {
    } else if (selectedDietType === "vegan") {
      params.set("isVegan", "true");
      params.set("isVegetarian", "false");
    } else if (selectedDietType === "vegetarian") {
      params.set("isVegan", "false");
      params.set("isVegetarian", "true");
    } else {
      params.set("isVegan", "false");
      params.set("isVegetarian", "false");
    }

    if (selectedCategory !== "all") params.set("categoryId", selectedCategory);

    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());

    if (sortOrder === "price-asc") {
      params.set("sortBy", "price");
      params.set("order", "asc");
    } else if (sortOrder === "price-desc") {
      params.set("sortBy", "price");
      params.set("order", "desc");
    }

    return params.toString();
  };

  // Fetch Foods
  const fetchFoods = async (
    pageNum = 1,
    append = false,
    controller?: AbortController
  ) => {
    try {
      setLoading(true);
      const query = buildQuery(pageNum);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/food?${query}`,
        { signal: controller?.signal }
      );

      const json = await res.json();

      if (json.success) {
        setFoods((prev) => (append ? [...prev, ...json.data] : json.data));
        setHasNextPage(json.pagination?.hasNextPage);
        setPage(json.pagination?.currentPage);
      }
    } catch (error: any) {
      if (error.name === "AbortError") return; // request was cancelled
      console.error("Error fetching foods:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetchFoods(1, false, controller);
    }, 700); // 0.7 sec debounce

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [searchQuery, selectedDietType, selectedCategory, priceRange, sortOrder]);

  // Infinite Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 400 &&
        hasNextPage &&
        !loading
      ) {
        fetchFoods(page + 1, true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, hasNextPage, loading]);

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="min-h-screen bg-bgxbase">
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Our Menu
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore our delicious selection of fresh, quality meals
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-5xl mx-auto mb-8 space-y-3"
        >
          {/* Search */}
          <div className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/40 rounded-2xl"
              />
            </div>

            {/* Filter toggle for mobile */}
            <Button
              variant="outline"
              className="flex lg:hidden h-9 text-sm bg-card/40"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? (
                <>
                  <X className="h-4 w-4" />{" "}
                  <span className="hidden sm:block">Close</span>
                </>
              ) : (
                <>
                  <SlidersHorizontal className="h-4 w-4" />{" "}
                  <span className="hidden sm:block">Filters</span>
                </>
              )}
            </Button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {(showFilters || isDesktop) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-end pt-2 mx-auto"
              >
                {/* Diet */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block ml-1">
                    Diet Type
                  </label>
                  <Select
                    value={selectedDietType}
                    onValueChange={setSelectedDietType}
                  >
                    <SelectTrigger className="bg-background/50 text-sm h-9 w-full cursor-pointer">
                      <SelectValue placeholder="Diet" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-sm border-white/10">
                      <SelectItem value="all" className="cursor-pointer">
                        All
                      </SelectItem>
                      <SelectItem value="vegetarian" className="cursor-pointer">
                        Vegetarian
                      </SelectItem>
                      <SelectItem value="non-veg" className="cursor-pointer">
                        Non-Veg
                      </SelectItem>
                      <SelectItem value="vegan" className="cursor-pointer">
                        Vegan
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block ml-1">
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="bg-background/50 text-sm h-9 w-full cursor-pointer">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-sm border-white/10">
                      <SelectItem className="cursor-pointer" value="all">
                        All
                      </SelectItem>
                      {categories.map((c) => (
                        <SelectItem
                          className="cursor-pointer"
                          key={c.id}
                          value={c.id}
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="flex flex-col col-span-2 sm:col-span-1 justify-between h-full m-0 p-0">
                  <label className="text-xs font-medium text-muted-foreground mb-1 ml-1">
                    Price Range
                  </label>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-foreground w-10 text-left">
                      ₹{priceRange[0]}
                    </span>

                    <div className="relative w-full h-2 rounded-full bg-gray-300">
                      {/* ACTIVE TRACK (normalized) */}
                      <div
                        className="absolute h-2 rounded-full bg-textxsecondary"
                        style={{
                          left: `${((priceRange[0] - 100) / 900) * 100}%`,
                          right: `${
                            100 - ((priceRange[1] - 100) / 900) * 100
                          }%`,
                        }}
                      />

                      {/* LEFT THUMB */}
                      <input
                        type="range"
                        min={100}
                        max={1000}
                        value={priceRange[0]}
                        onChange={(e) => {
                          const val = Math.min(
                            Number(e.target.value),
                            priceRange[1] - 1
                          );
                          setPriceRange([val, priceRange[1]]);
                        }}
                        className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto"
                      />

                      {/* RIGHT THUMB */}
                      <input
                        type="range"
                        min={100}
                        max={1000}
                        value={priceRange[1]}
                        onChange={(e) => {
                          const val = Math.max(
                            Number(e.target.value),
                            priceRange[0] + 1
                          );
                          setPriceRange([priceRange[0], val]);
                        }}
                        className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto"
                      />

                      {/* Thumb styling */}
                      <style>
                        {`
                          input[type="range"] {
                            -webkit-appearance: none;
                          }
                          input[type="range"]::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            height: 16px;
                            width: 16px;
                            border-radius: 50%;
                            background: #000;
                            border: 2px solid white;
                            cursor: pointer;
                            
                            position: relative;
                            z-index: 10;
                          }
                          input[type="range"]::-moz-range-thumb {
                            height: 16px;
                            width: 16px;
                            border-radius: 50%;
                            background: #000;
                            border: 2px solid white;
                            cursor: pointer;
                          }
                        `}
                      </style>
                    </div>

                    <span className="text-sm font-semibold text-foreground w-10 text-right">
                      ₹{priceRange[1]}
                    </span>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block ml-1">
                    Sort By
                  </label>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="bg-background/50 text-sm h-9 w-full cursor-pointer">
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-sm border-white/10">
                      <SelectItem value="default" className="cursor-pointer">
                        Default
                      </SelectItem>
                      <SelectItem value="price-asc" className="cursor-pointer">
                        Low → High
                      </SelectItem>
                      <SelectItem value="price-desc" className="cursor-pointer">
                        High → Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reset */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedDietType("all");
                      setSelectedCategory("all");
                      setPriceRange([100, 1000]);
                      setSortOrder("default");
                    }}
                    className="text-sm cursor-pointer h-9 w-full bg-background/50"
                  >
                    Reset
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Menu Grid */}
        <div>
          {initialLoading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center"
            >
              <LoadingSpinner size={40} color="#4a5f3f" className="mt-16" />
            </motion.div>
          ) : foods.length === 0 && !loading ? (
            <p className="text-center text-muted-foreground py-16 text-lg">
              No Foods found matching your Search
            </p>
          ) : (
            <>
              {!loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {foods.map((item, index) => (
                    <FoodCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                loading && (
                  <div className="flex justify-center mt-6">
                    <LoadingSpinner size={30} color="#4a5f3f" />
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
