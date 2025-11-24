import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto, { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const email = req.headers.get("x-user-email") as string;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ success: false, message: "User Does Not Found!" }, { status: 400 });
    }

    const { paymentMethod } = await req.json();

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { cartItems: { include: { foodItem: true } } },
    });

    if (!cart || cart.cartItems.length === 0) {
      return NextResponse.json({ success: false, message: "Cart is empty" });
    }

    const address = await prisma.address.findUnique({ where: { userId: user.id } });

    if (!address) {
      return NextResponse.json({ success: false, message: "User address not found" });
    }

    const TAX_PERCENT = 5;
    const DELIVERY_FEE = 50;

    const subtotal = cart.cartItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    const taxAmount = (subtotal * TAX_PERCENT) / 100;
    const totalAmount = subtotal + taxAmount + DELIVERY_FEE;

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        userId: user.id,
        deliveryAddressId: address.id,
        paymentMethod,
        subtotal,
        taxAmount,
        deliveryFee: DELIVERY_FEE,
        discountAmount: 0,
        totalAmount,
        paymentStatus: paymentMethod === "COD" ? "PAID" : "PENDING",
        orderStatus: paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
        orderItems: {
          create: cart.cartItems.map((item) => ({
            foodItemId: item.foodItemId,
            quantity: item.quantity,
            priceAtPurchase: item.price,
            subtotal: item.subtotal,
          })),
        },
      },
      include: { orderItems: true },
    });

    //await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    //Call Delete from Frontend

    if (paymentMethod === "COD") {
      await prisma.paymentTransaction.create({
        data: {
          orderId: order.id,
          amount: order.totalAmount,
          paymentMethod,
          status: "PAID",
        },
      });

      return NextResponse.json({
        success: true,
        order,
        message: "Order placed with Cash on Delivery",
      });
    }

    // PAYU FLOW ----------
    const payuKey = process.env.PAYU_KEY!;
    const payuSalt = process.env.PAYU_SALT!;

    const txnid = randomUUID();            // FIXED
    const amount = Number(order.totalAmount).toFixed(2);  // FIXED

    const hashStr =
      `${payuKey}|${txnid}|${amount}|Food Order|User|user@example.com|||||||||||${payuSalt}`;

    const hash = crypto.createHash("sha512").update(hashStr).digest("hex");

    const payuPayload = {
      key: payuKey,
      txnid,
      amount,
      productinfo: "Food Order",
      firstname: "User",
      email: "user@example.com",
      phone: "9999999999",
      surl: `${process.env.BASE_URL}/api/payments/payu-success`,
      furl: `${process.env.BASE_URL}/api/payments/payu-fail`,
      hash,
    };

    await prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        transactionId: txnid,
        paymentMethod,
        amount: amount,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      order,
      payment: payuPayload,
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}



export async function GET(req: NextRequest) {
  try {
    const email = req.headers.get("x-user-email") as string;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: false, message: "User Does Not Found!" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const orderIdParam = searchParams.get("orderid");

    if (!orderIdParam || isNaN(Number(orderIdParam))) {
      return NextResponse.json(
        { success: false, message: "Invalid order id" },
        { status: 400 }
      );
    }

    const orderId = Number(orderIdParam);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            foodItem: true,
          },
        },
        deliveryAddress: true,
        paymentTransactions: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    //Security: Ensure order belongs to requesting user
    if (order.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: "You are not authorized to view this order" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
      user:{
        contactEmail:user.email
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}