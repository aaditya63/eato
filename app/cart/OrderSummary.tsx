"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Variants } from "framer-motion";
import {
  MapPin,
  Clock,
  CreditCard,
  ChevronLeft,
  Bike,
  CheckCircle2,
  Utensils,
  Banknote,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/loader/Spinner";

interface CartItem {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  discountPrice?: number;
  quantity: number;
}

interface Addressform {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const paymentOptions = [
  {
    id: "WALLET",
    title: "PayU",
    description: "Credit/Debit Card, UPI, NetBanking",
    icon: CreditCard,
    badge: "Secure",
  },
  {
    id: "COD",
    title: "Cash on Delivery",
    description: "Pay in cash when your order arrives",
    icon: Banknote,
    badge: null,
  },
];

// --- Animation Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function OrderSummary({
  items,
  form,
  selectedMethod,
}: {
  items: CartItem[];
  form: Addressform;
  selectedMethod: string;
}) {
  // Calculate totals using discount if available

  const router = useRouter();

  const subtotal = items.reduce((acc, item) => {
    const effectivePrice = item.discountPrice ?? item.price;
    return acc + effectivePrice * item.quantity;
  }, 0);

  const tax = subtotal * 0.05; // 5% GST
  const deliveryFee = 50; // ₹50 Delivery Fee
  const total = subtotal + tax + deliveryFee;

  const [deliveryTime, setDeliveryTime] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1);

    const formatted = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });

    setDeliveryTime(formatted);
  }, []);

  const [loading,setLoading] = useState(false)
  const placeOrder = async () => {
    try {
      setLoading(true)
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/order`,
        {
          paymentMethod: selectedMethod,
        }
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      // COD → redirect to order success page
      if (selectedMethod === "COD") {
        router.push(`/cart/ordersuccess?orderid=${res.data.order.id}`);
        return;
      }

      // Wallet - PAYU
      sessionStorage.setItem(
        "payuPayload",
        JSON.stringify({
          payment: res.data.payment,
          orderId: res.data.order.id,
        })
      );
      router.push("/cart/checkout");
    } catch (err) {
      console.log(err);
    }finally{
      setLoading(false)
    }
  };
  return (
    <div className="min-h-screen font-sans text-slate-800">
      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Order Items */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Your Tasty Foods
              </h2>
              <span className="text-sm text-gray-500">
                {items.length} items
              </span>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence>
                {items.map((item) => {
                  const effectivePrice = item.discountPrice ?? item.price;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 group hover:shadow-md transition-all duration-300"
                    >
                      {/* Image Section with Quantity Badge */}
                      <div className="relative shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover bg-gray-100"
                        />
                        {/* Quantity Badge */}
                        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white z-10">
                          {item.quantity}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between min-w-0 gap-1 sm:gap-6">
                        {/* Info Column */}
                        <div className="flex flex-col gap-1">
                          <h3 className="font-bold text-slate-800 text-lg leading-snug">
                            {item.name}
                          </h3>

                          {/* Unit Price Row */}
                          <div className="flex items-baseline gap-2 flex-wrap leading-0">
                            {item.discountPrice ? (
                              <>
                                <span className="text-emerald-600 font-bold text-sm">
                                  ₹{item.discountPrice.toFixed(2)}
                                </span>
                                <span className="text-xs text-slate-400 line-through decoration-slate-400">
                                  ₹{item.price.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-emerald-600 text-sm font-bold">
                                ₹{item.price.toFixed(2)}
                              </span>
                            )}
                            <span className="text-xs text-slate-400 font-medium">
                              / item
                            </span>
                          </div>
                        </div>

                        <div className="mt-0 sm:text-right pt-0">
                          <span className="block font-bold text-slate-800 text-xl">
                            ₹{(effectivePrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Additional Note Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start"
            >
              <Utensils className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-700 text-sm">
                  Cutlery Request
                </h4>
                <p className="text-blue-600/80 text-sm mt-1">
                  We've opted you out of plastic cutlery to save the
                  environment.
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Delivery & Totals */}
          <div className="lg:col-span-5 space-y-6">
            {/* Delivery Details Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Bike className="w-5 h-5 text-emerald-500" />
                Delivery Details
              </h3>

              <div className="space-y-6 relative">
                <div className="absolute left-[11px] top-8 bottom-8 w-0.5 bg-gray-200 z-0" />

                {/* Address */}
                <div className="flex gap-4 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                      Deliver To
                    </p>

                    <p className="font-semibold text-slate-800">
                      {form.addressLine1}
                    </p>

                    {form.addressLine2 && (
                      <p className="text-sm text-gray-500">
                        {form.addressLine2}
                      </p>
                    )}

                    {(form.city || form.state) && (
                      <p className="text-sm text-gray-500">
                        {form.city}, {form.state}
                      </p>
                    )}

                    {(form.postalCode || form.country) && (
                      <p className="text-sm text-gray-500">
                        {form.postalCode}, {form.country}
                      </p>
                    )}
                  </div>
                </div>

                {/* Arrival Time */}
                <div className="flex gap-4 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                      Expected Arrival
                    </p>
                    <p className="font-bold text-2xl text-slate-800">
                      {deliveryTime}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-emerald-600 mt-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>On Time</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Method Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 shrink-0">
                <CreditCard className="w-5 h-5 text-purple-500 shrink-0" />
                Payment Method
              </h3>

              {(() => {
                const selected = paymentOptions.find(
                  (p) => p.id === selectedMethod
                );

                if (!selected) return null;

                const Icon = selected.icon;

                return (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-slate-700" />
                      </div>

                      <div>
                        <p className="font-semibold text-sm text-slate-700">
                          {selected.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selected.description}
                        </p>
                      </div>
                    </div>

                    {selected.badge && (
                      <span
                        className={`hidden sm:block text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded-md font-medium`}
                      >
                        {selected.badge}
                      </span>
                    )}
                  </div>
                );
              })()}
            </motion.div>

            {/* Bill Summary Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-bold mb-4">Order Total</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-500">
                  <span className="flex items-center gap-1">
                    Delivery Fee
                    <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-400 text-[10px] flex items-center justify-center cursor-help">
                      ?
                    </span>
                  </span>
                  <span className="font-medium text-slate-800">
                    ₹{deliveryFee.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-500">
                  <span>Tax & Fees (5%)</span>
                  <span className="font-medium text-slate-800">
                    ₹{tax.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-sm text-gray-500 font-medium block mb-1">
                      Total
                    </span>
                    <span className="text-xs text-gray-400 font-normal">
                      Incl. taxes
                    </span>
                  </div>
                  <span className="text-3xl font-bold text-slate-800">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={placeOrder}
                disabled={loading}
                className="w-full bg-textxsecondary hover:bg-textxsecondary/90 text-white font-bold py-2 rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                {!loading ? "Place Order" : <span className="flex items-center justify-center"><LoadingSpinner size={18} className="mr-2"/> Placing Order </span>}
                <ChevronLeft className={` ${loading ? "hidden" : "block"} w-5 h-5 rotate-180`} />
              </motion.button>

              <p className="text-center text-xs text-gray-400 mt-4">
                By confirming, you agree to our T&Cs and Privacy Policy.
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
