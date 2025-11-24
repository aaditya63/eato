"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Home, Info, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "@/components/loader/Spinner";
import { useCart } from "@/lib/redux/cart/useCart";


interface OrderDetailsType {
  name: string;
  phone: string;
  email: string;
  address: string;
  deliveryTime: string;
  paymentMethod: string;
}

const OrderSuccess = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderid");
  const [loading,setLoading] = useState(false)
  const [orderDetails, setOrderDetails] = useState<OrderDetailsType | null>(
    null
  );
  const [total,setTotal] = useState(0)

  const { clearAll } = useCart();

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/order?orderid=${orderId}`
        );
        if (res.data.success) {
          console.log("got res after success is ", res.data);
          const order = res.data.order
          setOrderDetails({
            name: "string",
            phone: "string",
            email: res.data.user.contactEmail,
            address: `${order.deliveryAddress.addressLine1}${" "}${order.deliveryAddress.addressLine2}`,
            deliveryTime: order.estimatedDeliveryTime ?? "45 Min",
            paymentMethod: order.paymentMethod,
          });
          setTotal(Number(order.totalAmount))
        }
      } catch (err) {
        console.log(err)
      }finally{
        setLoading(true)
      }
    }
    load();
    return clearAll()
  }, []);

  return (
    <>
      <div className="min-h-screen pt-20 bg-bgxbase px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex mb-6"
            >
              <CheckCircle2 className="w-24 h-24 text-green-500" />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your order has been confirmed and will be delivered soon.
            </p>

            {!loading ? <div className="h-40 flex items-center justify-center">
              <LoadingSpinner size={50}/>
            </div> 
            :<Card className="glass-card mb-8 text-left">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                  <span className="text-muted-foreground">Order Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{total?.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Delivery Address
                    </span>
                    <span className="text-right max-w-xs">
                      {orderDetails?.address}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact</span>
                    <span>{orderDetails?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Time</span>
                    <span>{orderDetails?.deliveryTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Payment Method
                    </span>
                    <span className="font-medium text-green-600">
                      {orderDetails?.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Payment Status
                    </span>
                    <span className="font-medium text-green-600">
                      Confirmed
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <p className="flex items-center justify-center text-sm text-muted-foreground">
                    <Info className="mr-2 shrink-0 text-blue-400" /> Your order
                    will be delivered within 30–45 minutes. You can track its
                    status from the Order History section.
                  </p>
                </div>
              </CardContent>
            </Card>}

          </motion.div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
