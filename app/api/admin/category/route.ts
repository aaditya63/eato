import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import imagekit from "@/lib/imagekit";
import { parse } from "parse-multipart-data";

export const runtime = "node"; // allows Buffer & Node APIs


export async function POST(req: Request) {
  const email = req.headers.get("x-user-email") as string;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, message: "Unauthorized access" },
      { status: 403 }
    );
  }

  try {
    // Get content type and boundary
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
    // Convert the request into a Buffer
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // Parse multipart data
    const parts = parse(buffer, boundary);
    // Extract fields
    const name = parts.find((p) => p.name === "name")?.data.toString();
    const description = parts.find((p) => p.name === "description")?.data.toString();
    const imagePart = parts.find((p) => p.filename);

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    // Upload file to ImageKit (if present)
    let imageUrl = "";
    if (imagePart && imagePart.data) {
      const fileBuffer = imagePart.data;
      const originalName = (imagePart as any).filename || `category_${Date.now()}.jpg`;

      const upload = await imagekit.upload({
        file: fileBuffer,
        fileName: originalName,
        folder: "/eato/categories",
      });
      imageUrl = upload.url;
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        imageUrl,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create category",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

