import { NextResponse } from "next/server";
import { parse } from "parse-multipart-data";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import imagekit from "@/lib/imagekit"; // Assuming you already configured this

export async function POST(req: Request) {
  const email = req.headers.get("x-user-email") as string;
  const user = await prisma.user.findUnique({ where: { email } });

  // Only ADMINs can add food items
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, message: "Unauthorized access" },
      { status: 403 }
    );
  }

  try {
    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("multipart/form-data")) {
      return NextResponse.json(
        { success: false, message: "Invalid content type" },
        { status: 400 }
      );
    }

    const boundary = contentType.split("boundary=")[1];
    if (!boundary) {
      return NextResponse.json(
        { success: false, message: "Missing boundary in request" },
        { status: 400 }
      );
    }

    // Parse multipart form data
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const parts = parse(buffer, boundary);

    // Extract fields
    const categoryId = parts.find((p) => p.name === "categoryId")?.data.toString();
    const name = parts.find((p) => p.name === "name")?.data.toString();
    const description = parts.find((p) => p.name === "description")?.data.toString();
    const price = parts.find((p) => p.name === "price")?.data.toString();
    const discountPrice = parts.find((p) => p.name === "discountPrice")?.data.toString();
    const isAvailable = parts.find((p) => p.name === "isAvailable")?.data.toString();
    const isVegetarian = parts.find((p) => p.name === "isVegetarian")?.data.toString();
    const isVegan = parts.find((p) => p.name === "isVegan")?.data.toString();
    const preparationTime = parts.find((p) => p.name === "preparationTime")?.data.toString();
    const calories = parts.find((p) => p.name === "calories")?.data.toString();
    const imagePart = parts.find((p) => p.filename);

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { success: false, message: "Name, price, and categoryId are required" },
        { status: 400 }
      );
    }

    // Upload image to ImageKit if provided
    let imageUrl = "";
    if (imagePart && imagePart.data) {
      const fileBuffer = imagePart.data;
      const originalName = (imagePart as any).filename || `food_${Date.now()}.jpg`;

      const upload = await imagekit.upload({
        file: fileBuffer,
        fileName: originalName,
        folder: "/eato/foods",
      });

      imageUrl = upload.url;
    }

    // Create Food Item
    const foodItem = await prisma.foodItem.create({
      data: {
        categoryId: Number(categoryId),
        name,
        description,
        price: new Prisma.Decimal(price),
        discountPrice: discountPrice ? new Prisma.Decimal(discountPrice) : null,
        imageUrl,
        isAvailable: isAvailable ? isAvailable === "true" : true,
        isVegetarian: isVegetarian ? isVegetarian === "true" : false,
        isVegan: isVegan ? isVegan === "true" : false,
        preparationTime: preparationTime ? Number(preparationTime) : null,
        calories: calories ? Number(calories) : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Food item created successfully",
      data: foodItem,
    });
  } catch (error: any) {
    console.error("Error creating food item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create food item",
        error: error.message,
      },
      { status: 500 }
    );
  }
}