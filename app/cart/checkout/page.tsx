"use client";

import LoadingSpinner from "@/components/loader/Spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PayUCheckout() {
  const router = useRouter();
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {

    const raw = sessionStorage.getItem("payuPayload");
    console.log("payupayload",raw)
    if (!raw) {
      router.replace("/cart");
      return;
    }
    const { payment } = JSON.parse(raw);
    setPayment(payment);
    
    console.log("FINAL PAYMENT OBJECT SENT TO PAYU:", payment);


    setTimeout(() => {
      const form = document.getElementById("payu-form") as HTMLFormElement;
      form?.submit();
    }, 200);
  }, [router]);

  if (!payment) return <p>Loading…</p>;

  const PAYU_URL = "https://test.payu.in/_payment";


  return (
    <div className="pt-20 min-h-screen text-center bg-bgxbase">
      <h2 className="text-xl font-bold mb-4 flex items-center justify-center">
       <LoadingSpinner size={20} className="mr-3"/>  Redirecting to secure PayU payment…</h2>

      <form
        id="payu-form"
        method="POST"
        action={PAYU_URL}
      >
        <input type="hidden" name="key" value={payment.key} />
        <input type="hidden" name="txnid" value={payment.txnid} />
        <input type="hidden" name="amount" value={payment.amount} />
        <input type="hidden" name="productinfo" value={payment.productinfo} />
        <input type="hidden" name="firstname" value={payment.firstname} />
        <input type="hidden" name="email" value={payment.email} />
        <input type="hidden" name="phone" value={payment.phone} />
        <input type="hidden" name="surl" value={payment.surl} />
        <input type="hidden" name="furl" value={payment.furl} />
        <input type="hidden" name="hash" value={payment.hash} />

        <noscript>
          <button type="submit">Click to pay with PayU</button>
        </noscript>
      </form>
    </div>
  );
}
