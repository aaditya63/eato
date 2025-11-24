import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    console.log("pay u failed request is ",req)
    console.log("pay u failed form is ",form)
    const txnid = String(form.get("txnid") || "");
    const errorMessage = String(form.get("error_Message") || "Payment failed");

    // Find transaction
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { transactionId: txnid },
    });

    if (transaction) {
      // Mark failed
      await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: "FAILED",
          paymentGatewayResponse: JSON.stringify(Object.fromEntries(form)),
        },
      });

      // Mark order as cancelled
      await prisma.order.update({
        where: { id: transaction.orderId },
        data: {
          paymentStatus: "FAILED",
          orderStatus: "CANCELLED",
        },
      });
    }

    // Redirect to failure page
    return NextResponse.redirect(
      `${process.env.BASE_URL}/payment-failed?orderId=${transaction?.orderId || ""}&msg=${encodeURIComponent(errorMessage)}`
    );
  } catch (err) {
    console.log(err);
    return NextResponse.redirect(`${process.env.BASE_URL}/payment-failed`);
  }
}
