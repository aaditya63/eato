import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Extract query params
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search")?.trim() || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    // Pagination math
    const skip = (page - 1) * limit;

    // Build dynamic filter object
    const whereClause: any = {
      isAvailable: true,
    };

    if (categoryId) {
      whereClause.categoryId = Number(categoryId);
    }

    if (search) {
      // Fuzzy search — partial match in name or description
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch items and total count
    const [foodItems, totalCount] = await Promise.all([
      prisma.foodItem.findMany({
        where: whereClause,
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.foodItem.count({ where: whereClause }),

    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      message: "Food items fetched successfully",
      data: foodItems,
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error: any) {
    console.error("Error fetching food items:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch food items",
        error: error.message,
      },
      { status: 500 }
    );
  }
}