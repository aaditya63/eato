import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // PayU sends data as form-data
    const form = await req.formData();
  

    // Extract required PayU fields
    const status = String(form.get("status") || "");
    const firstname = String(form.get("firstname") || "");
    const email = String(form.get("email") || "");
    const productinfo = String(form.get("productinfo") || "");
    const amount = String(form.get("amount") || "");
    const txnid = String(form.get("txnid") || "");
    const receivedHash = String(form.get("hash") || "");
    const udf1 = String(form.get("udf1") || ""); // you passed orderId here

    const key = process.env.PAYU_KEY!;
    const salt = process.env.PAYU_SALT!;

    // Fetch transaction by txnid
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { transactionId: txnid },
    });

    if (!transaction) {
      return NextResponse.redirect(
        `${process.env.BASE_URL}/payment-fail?reason=invalid-txn`
      );
    }

    // ⭐ Generate verification string (REVERSE HASH)
    const hashString =
      `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;

    const calculatedHash = crypto.createHash("sha512").update(hashString).digest("hex");

    if (receivedHash !== calculatedHash) {
      console.log("HASH MISMATCH", receivedHash, calculatedHash);

      // Mark failed - hash mismatch
      await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: "FAILED",
          paymentGatewayResponse: JSON.stringify(Object.fromEntries(form)),
        },
      });

      await prisma.order.update({
        where: { id: transaction.orderId },
        data: {
          paymentStatus: "FAILED",
          orderStatus: "CANCELLED",
        },
      });

      return NextResponse.redirect(
        `${process.env.BASE_URL}/payment-failed?reason=hash`
      );
    }

    // Payment verified → update DB
    await prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: "PAID",
        paymentGatewayResponse: JSON.stringify(Object.fromEntries(form)),
      },
    });

    await prisma.order.update({
      where: { id: transaction.orderId },
      data: {
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
      },
    });

    //Redirect user to success page
    return NextResponse.redirect(
      `${process.env.FRONTEND_URL}/cart/ordersuccess?orderid=${transaction.orderId}`,
        { status: 303 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(
      `${process.env.FRONTEND_URL}/cart/orderfailed?reason=server-error`,
        { status: 303 }
    );
  }
}