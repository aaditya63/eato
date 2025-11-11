import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";


//Get cart items for a user
export async function GET(req: Request) {
  try {    
    const email = req.headers.get("x-user-email") as string;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User Does not Found" },
        { status: 401 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        cartItems: {
          include: { foodItem: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: cart || { cartItems: [] },
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}


//Add item from cart
export async function POST(req: Request) {
  try {
    const email = req.headers.get("x-user-email") as string;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User Does not Found" },
        { status: 401 }
      );
    }

    const { foodItemId, quantity } = await req.json();

    let cart = await prisma.cart.findUnique({ where: { userId:user.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId:user.id } });
    }

    const food = await prisma.foodItem.findUnique({ where: { id: foodItemId } });
    if (!food) return NextResponse.json({ success: false, message: "Food not found" }, { status: 404 });

    const price = food.discountPrice ?? food.price;
    const subtotal = price.mul(quantity);

    await prisma.cartItem.upsert({
      where: {
        cartId_foodItemId: { cartId: cart.id, foodItemId },
      },
      update: { quantity, subtotal },
      create: {
        cartId: cart.id,
        foodItemId,
        quantity,
        price,
        subtotal,
      },
    });

    const total = await prisma.cartItem.aggregate({
      where: { cartId: cart.id },
      _sum: { subtotal: true },
    });

    await prisma.cart.update({
      where: { id: cart.id },
      data: { totalAmount: total._sum.subtotal ?? 0 },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating cart:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// Remove item from cart
export async function DELETE(req: Request) {
  try {

    const email = req.headers.get("x-user-email") as string;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User Does not Found" },
        { status: 401 }
      );
    }

    const { foodItemId } = await req.json();

    const cart = await prisma.cart.findUnique({ where: { userId:user.id } });
    if (!cart) return NextResponse.json({ success: false });

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, foodItemId } });

    const total = await prisma.cartItem.aggregate({
      where: { cartId: cart.id },
      _sum: { subtotal: true },
    });

    await prisma.cart.update({
      where: { id: cart.id },
      data: { totalAmount: total._sum.subtotal ?? 0 },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}



export async function PUT(req: Request) {
  try {
    const email = req.headers.get("x-user-email") as string;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }

    const { items } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: "Invalid items payload" },
        { status: 400 }
      );
    }

    //Find or create user's cart
    let cart = await prisma.cart.findUnique({ where: { userId: user.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: user.id } });
    }

    //Merge each item
    for (const item of items) {
      const foodId = Number(item.foodItemId);
      if (!foodId || isNaN(foodId)) continue;

      const food = await prisma.foodItem.findUnique({
        where: { id: foodId },
      });

      if (!food) continue;

      // Prisma Decimal safe math
      const price = new Prisma.Decimal(food.discountPrice ?? food.price);
      const subtotal = price.mul(new Prisma.Decimal(item.quantity));

      await prisma.cartItem.upsert({
        where: {
          cartId_foodItemId: {
            cartId: cart.id,
            foodItemId: foodId,
          },
        },
        update: {
          quantity: item.quantity,
          subtotal,
        },
        create: {
          cartId: cart.id,
          foodItemId: foodId,
          quantity: item.quantity,
          price,
          subtotal,
        },
      });
    }

    const total = await prisma.cartItem.aggregate({
      where: { cartId: cart.id },
      _sum: { subtotal: true },
    });

    await prisma.cart.update({
      where: { id: cart.id },
      data: { totalAmount: total._sum.subtotal ?? 0 },
    });

    return NextResponse.json({
      success: true,
      message: "Cart merged successfully",
    });
  } catch (err) {
    console.error(" Cart merge error:", err);
    return NextResponse.json(
      { success: false, message: "Sync failed" },
      { status: 500 }
    );
  }
}
