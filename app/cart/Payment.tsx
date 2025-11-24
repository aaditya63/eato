import { Banknote, CheckCircle2, Circle, CreditCard } from "lucide-react";
import React, { useState } from "react";

interface proptype{
  selectedMethod:string,
  setSelectedMethod:(s:string) => void
}
export default function Payment({selectedMethod,setSelectedMethod}:proptype) {

  // Payment options configuration
  const paymentOptions = [
    {
      id: "COD",
      title: "Cash on Delivery",
      description: "Pay in cash when your order arrives",
      icon: Banknote,
      badge: null,
    },
    {
      id: "WALLET",
      title: "PayU",
      description: "Credit/Debit Card, UPI, NetBanking",
      icon: CreditCard,
      badge: "Secure",
    },
  ];
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5" /> Choose Payment Method
      </h2>
      <div className="space-y-3">
        {paymentOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedMethod === option.id;

          return (
            <div
              key={option.id}
              onClick={() => setSelectedMethod(option.id)}
              className={`
                    relative bg-white  group flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ease-in-out
                    ${
                      isSelected
                        ? "border-textxsecondary shadow-md"
                        : "border-gray-200 hover:border-textxsecondary hover:bg-gray-50"
                    }
                  `}
            >
              {/* Left Icon */}
              <div
                className={`
                    p-3 rounded-full mr-4 transition-colors
                    ${
                      isSelected
                        ? "bg-bgxsubtle text-textxsecondary"
                        : "bg-bgxsubtle text-gray-500"
                    }
                  `}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3
                    className={`font-bold ${
                      isSelected ? "text-textxprimary" : "text-gray-700"
                    }`}
                  >
                    {option.title}
                  </h3>
                  {option.badge && (
                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {option.description}
                </p>
              </div>

              {/* Radio Indicator */}
              <div className="ml-4">
                {isSelected ? (
                  <CheckCircle2 className="w-6 h-6 text-textxsecondary fill-bgxbase" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
