"use client";
import { useCart } from "../../lib/redux/cart/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {Minus,Plus,Trash2,ShoppingBag,Leaf,Drumstick,Sprout} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Address from "./Address";
import Payment from "./Payment";
import axios from "axios";
const Cart = () => {
  const [showDetails, setShowDetails] = useState(false);
  const { items, total, removeFromCart, changeQuantity, clearAll } = useCart();
  
  const [step,setStep] = useState(1)

  const [form, setForm] = useState({
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "Maharashtra",
      postalCode: "",
      country: "India",
    });

  useEffect(()=>{
    async function load(){
      try{
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/address`)
        if(res.data.success){
          setForm(res.data.address)
        }
      }catch(err){
      }
    }
    load()
  },[])

  const router = useRouter();
  //have to enable
  const getDietIcon = (dietType: string) => {
    switch (dietType) {
      case "vegetarian":
        return <Leaf className="w-4 h-4 text-green-600" />;
      case "non-veg":
        return <Drumstick className="w-4 h-4 text-red-600" />;
      case "vegan":
        return <Sprout className="w-4 h-4 text-green-700" />;
      default:
        return null;
    }
  };
  return (
    <div className="bg-bgxbase">
      {!items || items.length === 0 ? (
        <div className="min-h-screen pt-20 px-4 flex justify-center items-center">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
            <p className="text-2xl font-bold mb-3">Your Cart is Empty</p>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any items yet.
            </p>
            <Button
              onClick={() => router.push("/menu")}
              size="lg"
              className="w-full bg-textxsecondary hover:bg-textxsecondary/90 cursor-pointer"
            >
              Browse Menu
            </Button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold">Cart</h1>

              <Button
                variant="outline"
                onClick={clearAll}
                className="glass-card hover:bg-red-200/50 cursor-pointer w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </Button>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}

              { step === 1 && <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="glass-card overflow-hidden">
                    <CardContent className="">
                      <div className="flex gap-3">
                        {/* Responsive Image */}
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                        />

                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-semibold text-sm sm:text-lg">
                              {item.name}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                              className="hover:bg-destructive/10 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Quantity + Price Row */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:mt-4  sm:gap-3">
                            {/* Quantity Block */}
                            <div className="flex items-center gap-1 glass-card rounded-lg p-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 cursor-pointer"
                                onClick={() =>
                                  item.quantity > 1 &&
                                  changeQuantity(item.id, item.quantity - 1)
                                }
                              >
                                <Minus className="w-4 h-4" />
                              </Button>

                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 cursor-pointer"
                                onClick={() =>
                                  changeQuantity(item.id, item.quantity + 1)
                                }
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Price */}
                            <p className="text-sm sm:text-lg font-bold">
                              ₹{(item.discountPrice ?? item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>}
              {step === 2 && 
              <div className="lg:col-span-2 space-y-4">
                <Address form={form} setForm={setForm}/>
              </div>}
              {step === 3 && 
              <div className="lg:col-span-2 space-y-4">
                <Payment/>
              </div>}

              {/* Order Summary */}
              <div className="lg:col-span-1">
                {/* DESKTOP VIEW */}
                <Card className="glass-card sticky top-24 hidden lg:block">
                  <CardContent className=" space-y-4">
                    <h2 className="text-2xl font-bold">Order Summary</h2>

                    <div className="space-y-2 py-4 border-t border-border/50">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Item Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Delivery Fee
                        </span>
                        <span>₹50.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{`Tax (5%)`} </span>
                        <span>₹{(total * 0.05).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-lg font-bold pt-4 border-t border-border/50">
                      <span>Total</span>
                      <span>₹{(total + 50 + total * 0.05).toFixed(2)}</span>
                    </div>

                    <Button onClick={()=>setStep(2)} className="w-full bg-textxsecondary text-bgxbase hover:bg-textxsecondary/90 cursor-pointer" size="lg">
                      Proceed to Checkout
                    </Button>
                  </CardContent>
                </Card>

                {/* MOBILE VIEW */}
                <div
                  className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 shadow-2xl border-t z-50">
                  {/* Collapsed Summary Bar */}
                  {!showDetails && (
                    <div className="flex items-center justify-between px-4 py-3">
                      <p className="text-lg font-semibold">
                        ₹{(total + 50 + total * 0.05).toFixed(2)}
                      </p>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setShowDetails(true)}
                          variant="ghost"
                          size="icon"
                        >
                          <span className="text-xl bg-textxsecondary text-bgxbase rounded-2xl px-2">▲</span>
                        </Button>

                        <Button className="px-6 bg-textxsecondary hover:text-btnxsecondary/90" size="sm">
                          Checkout
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Expanded Details */}
                  {showDetails && (
                    <div className="p-4 space-y-3 animate-in slide-in-from-bottom duration-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Item Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Delivery Fee
                        </span>
                        <span>₹50.00</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span>₹{(total * 0.05).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Total</span>
                        <span>₹{(total + 50 + total * 0.05).toFixed(2)}</span>
                      </div>

                      <Button onClick={()=>setStep(2)} className="w-full bg-textxsecondary hover:bg-textxsecondary/90">
                        Proceed to Checkout
                      </Button>

                      <Button
                        onClick={() => setShowDetails(false)}
                        className="w-full bg-bgxsubtle text-textxprimary"
                      >
                        Hide Details
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
