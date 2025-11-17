import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request){

  const email = req.headers.get("x-user-email") as string;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { success: false, message: "User Does Not Found!" },
      { status: 400 }
    );
  }
  try {
    const address = await prisma.address.findUnique({
      where: { userId: Number(user.id) }
    });
    if(!address) return NextResponse.json({ success: false, message:"Address Does not found!"});
    return NextResponse.json({ success: true, address });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to fetch address" }, { status: 500 });
  }
}


//For creating or updatign addresses
export async function POST(req: Request) {
  const email = req.headers.get("x-user-email") as string;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found!" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();

    const result = await prisma.address.upsert({
      where: { userId: user.id },
      update: {
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        country: body.country,
      },
      create: {
        userId: user.id,
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        country: body.country,
      },
    });

    return NextResponse.json(
      { success: true, address: result },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, error: "Unable to save address" },
      { status: 500 }
    );
  }
}



export async function DELETE(req: Request) {
  const email = req.headers.get("x-user-email") as string;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { success: false, message: "User Does Not Found!" },
      { status: 400 }
    );
  }
  try {
    await prisma.address.delete({
      where: { userId: Number(user.id) }
    });

    return NextResponse.json({ success: true, Message : "Address Deleted Successfuly" });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Unable to delete" }, { status: 500 });
  }
}