"use client";
import { useCart } from "../../lib/redux/cart/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Leaf,
  Drumstick,
  Sprout,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Address from "./Address";
import Payment from "./Payment";
import axios from "axios";
import OrderSummary from "./OrderSummary";
import { toast } from "react-toastify";
const Cart = () => {
  const [showDetails, setShowDetails] = useState(false);
  const { items, total, removeFromCart, changeQuantity, clearAll } = useCart();

  const [step, setStep] = useState(1);

  const [steptext, setStepText] = useState("Proceed to Checkout");
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [isAddressChanged, setIsAddressChanged] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState("COD");

  function handleStep() {
    if (step === 1) {
      setStep(2);
      setStepText("Confirm Address");
    }
    if (step === 2) {
      if (isAddressSelected) {
        setStep(3);
        setStepText("Confirm Payment Method");
      }
    }
    if (step === 3) setStep(4);
  }

  const [form, setForm] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Maharashtra",
    postalCode: "",
    country: "India",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/address`
        );
        const address = res.data.address;
        if (res.data.success) {
          if (address.addressLine1 && address.city && address.postalCode) {
            setIsAddressSelected(true);
          }
          setForm(address);
        }
      } catch (err) {}
    }
    load();
  }, []);

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
              <h1 className="flex items-center gap-2 leading-none  text-2xl sm:text-3xl font-bold">
                <ShoppingBag /> Cart
              </h1>

              <Button
                variant="outline"
                onClick={clearAll}
                className={`${
                  step !== 1 ? "hidden" : ""
                } glass-card hover:bg-red-200/50 cursor-pointer w-full sm:w-auto`}
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </Button>
            </div>
            {step === 4 && (
              <OrderSummary
                items={items}
                form={form}
                selectedMethod={selectedMethod}
              />
            )}
            {/* Layout Grid */}
            {step !== 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cart Items */}

                {step === 1 && (
                  <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => {
                      const effectivePrice = item.discountPrice ?? item.price;

                      return (
                        <Card
                          key={item.id}
                          className="relative rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all bg-white overflow-hidden"
                        >
                          {/* New 'X' Button at Top Right */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors z-10 cursor-pointer"
                            aria-label="Remove item"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <CardContent>
                            <div className="flex gap-4 items-center">
                              {/* Image Section */}
                              <div className="relative shrink-0">
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-24 h-24 rounded-xl object-cover bg-slate-100"
                                />
                                {/* Badge */}
                                <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white">
                                  {item.quantity}
                                </div>
                              </div>

                              {/* Content Section */}
                              <div className="flex-1 min-w-0">
                                {/* Title Area */}
                                <div className="flex justify-between items-start pr-8">
                                  {/* Removed 'truncate' class here to allow wrapping */}
                                  <p className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
                                    {item.name}
                                  </p>
                                </div>

                                {/* Unit Price Details - ADDED BLOCK */}
                                <div className="mt-1">
                                  {item.discountPrice ? (
                                    <div className="flex items-baseline gap-1.5">
                                      <span className="text-sm font-bold text-emerald-600">
                                        ₹{item.discountPrice.toFixed(2)}
                                      </span>
                                      <span className="text-xs text-slate-400 line-through">
                                        ₹{item.price.toFixed(2)}
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-medium">
                                        / item
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-baseline gap-1.5">
                                      <span className="text-sm font-medium text-slate-600">
                                        ₹{item.price.toFixed(2)}
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-medium">
                                        / item
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Price + Quantity Controls */}
                                <div className="mt-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                  {/* Quantity Controls */}
                                  <div className="flex w-fit items-center gap-1 bg-slate-100 rounded-lg p-1 shadow-sm">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 cursor-pointer hover:bg-white hover:shadow-sm rounded-md"
                                      onClick={() =>
                                        item.quantity > 1 &&
                                        changeQuantity(
                                          item.id,
                                          item.quantity - 1
                                        )
                                      }
                                    >
                                      <Minus className="w-3 h-3 text-slate-600" />
                                    </Button>

                                    <span className="w-8 text-center font-semibold text-slate-700 text-sm">
                                      {item.quantity}
                                    </span>

                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 cursor-pointer hover:bg-white hover:shadow-sm rounded-md"
                                      onClick={() =>
                                        changeQuantity(
                                          item.id,
                                          item.quantity + 1
                                        )
                                      }
                                    >
                                      <Plus className="w-3 h-3 text-slate-600" />
                                    </Button>
                                  </div>

                                  {/* Total Price */}
                                  <p className="text-base sm:text-lg font-bold text-slate-800">
                                    ₹
                                    {(effectivePrice * item.quantity).toFixed(
                                      2
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
                {step === 2 && (
                  <div className="lg:col-span-2 space-y-4">
                    <Address
                      form={form}
                      setForm={setForm}
                      isAddressChanged={isAddressChanged}
                      setIsAddressChanged={setIsAddressChanged}
                      isAddressSelected={isAddressSelected}
                      setIsAddressSelected={setIsAddressSelected}
                    />
                  </div>
                )}
                {step === 3 && (
                  <div className="lg:col-span-2 space-y-4">
                    <Payment
                      selectedMethod={selectedMethod}
                      setSelectedMethod={setSelectedMethod}
                    />
                  </div>
                )}

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  {/* DESKTOP VIEW */}
                  <Card className="glass-card sticky top-24 hidden lg:block">
                    <CardContent className=" space-y-4">
                      <h2 className="text-2xl font-bold">Order Summary</h2>

                      <div className="space-y-2 py-4 border-t border-border/50">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Item Total
                          </span>
                          <span>₹{total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Delivery Fee
                          </span>
                          <span>₹50.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {`Tax (5%)`}{" "}
                          </span>
                          <span>₹{(total * 0.05).toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between text-lg font-bold pt-4 border-t border-border/50">
                        <span>Total</span>
                        <span>₹{(total + 50 + total * 0.05).toFixed(2)}</span>
                      </div>

                      <Button
                        onClick={handleStep}
                        disabled={step === 2 && !isAddressSelected}
                        className="w-full bg-textxsecondary text-bgxbase hover:bg-textxsecondary/90 cursor-pointer"
                        size="lg"
                      >
                        {steptext}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* MOBILE VIEW */}
                  <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 shadow-2xl border-t z-50">
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
                            <span className="text-xl bg-textxsecondary text-bgxbase rounded-2xl px-2">
                              ▲
                            </span>
                          </Button>

                          <Button
                            disabled={step === 2 && !isAddressSelected}
                            onClick={handleStep}
                            className="px-6 bg-textxsecondary hover:text-btnxsecondary/90"
                            size="sm"
                          >
                            {step === 1 ? "Checkout" : "Next"}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Expanded Details */}
                    {showDetails && (
                      <div className="p-4 space-y-3 animate-in slide-in-from-bottom duration-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Item Total
                          </span>
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

                        <Button
                          onClick={handleStep}
                          disabled={step === 2 && !isAddressSelected}
                          className="w-full bg-textxsecondary hover:bg-textxsecondary/90"
                        >
                          {steptext}
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
