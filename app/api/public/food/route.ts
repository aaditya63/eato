import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Filters & controls
    const categoryId = searchParams.get("categoryId");
    const search = (searchParams.get("search") || "").trim();
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limitRaw = Number(searchParams.get("limit")) || 10;
    const limit = Math.min(Math.max(1, limitRaw), 50);
    const skip = (page - 1) * limit;

    // Boolean / numeric filters
    const isVeganParam = searchParams.get("isVegan");
    const isVegetarianParam = searchParams.get("isVegetarian");
    const isAvailableParam = searchParams.get("isAvailable");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");

    // Sorting
    const sortBy = (searchParams.get("sortBy") || "createdAt").toLowerCase();
    const order: "asc" | "desc" =
      (searchParams.get("order") || "desc").toLowerCase() === "asc"
        ? "asc"
        : "desc";

    // Helpers
    const boolFromParam = (v: string | null) =>
      v === null
        ? null
        : v.toLowerCase() === "true"
        ? true
        : v.toLowerCase() === "false"
        ? false
        : null;

    const isVegan = boolFromParam(isVeganParam);
    const isVegetarian = boolFromParam(isVegetarianParam);
    const isAvailable = boolFromParam(isAvailableParam);
    const minPrice = minPriceParam ? new Prisma.Decimal(minPriceParam) : null;
    const maxPrice = maxPriceParam ? new Prisma.Decimal(maxPriceParam) : null;

    // Safe ORDER BY
    const orderColumn =
      sortBy === "price"
        ? Prisma.sql`COALESCE(fi.discount_price, fi.price)` // take low between discount and regular price
        : sortBy === "name"
        ? Prisma.sql`fi.name`
        : Prisma.sql`fi.created_at`;

    const orderDirection = order === "asc" ? Prisma.sql`ASC` : Prisma.sql`DESC`;

    // Dynamic WHERE fragments
    const whereFrags: Prisma.Sql[] = [];

    if (isAvailable !== null)
      whereFrags.push(Prisma.sql`fi.is_available = ${isAvailable}`);
    if (categoryId)
      whereFrags.push(Prisma.sql`fi.category_id = ${Number(categoryId)}`);
    if (isVegan !== null) whereFrags.push(Prisma.sql`fi.is_vegan = ${isVegan}`);
    if (isVegetarian !== null)
      whereFrags.push(Prisma.sql`fi.is_vegetarian = ${isVegetarian}`);

    if (minPrice)
      whereFrags.push(
        Prisma.sql`COALESCE(fi.discount_price, fi.price) >= ${minPrice}`
      );
    if (maxPrice)
      whereFrags.push(
        Prisma.sql`COALESCE(fi.discount_price, fi.price) <= ${maxPrice}`
      );

    // Build WHERE SQL
    let whereSql = Prisma.sql``;
    if (whereFrags.length > 0) {
      whereSql = Prisma.sql`WHERE ${Prisma.join(whereFrags, " AND ")}`;
    }

    // Fuzzy search
    if (search) {
      const similarityThreshold = 0.2;

      const fuzzyCondition = Prisma.sql`
        (
          similarity(fi.name, ${search}) > ${similarityThreshold}
          OR similarity(fi.description, ${search}) > ${similarityThreshold}
        )
      `;

      const whereSqlFuzzy = whereSql.text
        ? Prisma.sql`${whereSql} AND ${fuzzyCondition}`
        : Prisma.sql`WHERE ${fuzzyCondition}`;

      const fuzzyRank = Prisma.sql`
        (0.7 * similarity(fi.name, ${search}) + 0.3 * similarity(fi.description, ${search}))
      `;

      const rows = await prisma.$queryRaw<any[]>`
        SELECT
          fi.*,
          c.id AS category_id_join,
          c.name AS category_name,
          ${fuzzyRank} AS fuzzy_rank
        FROM food_items fi
        JOIN categories c ON c.id = fi.category_id
        ${whereSqlFuzzy}
        ORDER BY
          ${fuzzyRank} DESC,
          ${orderColumn} ${orderDirection}
        LIMIT ${limit} OFFSET ${skip};
      `;

      const countRes = await prisma.$queryRaw<{ count: number }[]>`
        SELECT COUNT(*)::int AS count
        FROM food_items fi
        ${whereSqlFuzzy};
      `;

      const totalCount = countRes[0]?.count ?? 0;
      const totalPages = Math.max(1, Math.ceil(totalCount / limit));
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      const data = rows.map((r) => ({
        id: r.id,
        categoryId: r.category_id,
        name: r.name,
        description: r.description,
        price: r.price,
        discountPrice: r.discount_price,
        imageUrl: r.image_url,
        isAvailable: r.is_available,
        isVegetarian: r.is_vegetarian,
        isVegan: r.is_vegan,
        preparationTime: r.preparation_time,
        calories: r.calories,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        fuzzyRank: Number(r.fuzzy_rank),
        category: {
          id: r.category_id_join ?? r.category_id,
          name: r.category_name,
        },
      }));

      return NextResponse.json({
        success: true,
        message: "Food items (fuzzy ranked) fetched successfully",
        data,
        pagination: {
          totalItems: totalCount,
          totalPages,
          currentPage: page,
          pageSize: limit,
          hasNextPage,
          hasPrevPage,
        },
      });
    }

    // No search → use Prisma query (fast)
    const whereClause: any = {};
    if (isAvailable !== null) whereClause.isAvailable = isAvailable;
    if (categoryId) whereClause.categoryId = Number(categoryId);
    if (isVegan !== null) whereClause.isVegan = isVegan;
    if (isVegetarian !== null) whereClause.isVegetarian = isVegetarian;
    if (minPrice || maxPrice) {
      whereClause.OR = [
        {
          AND: [
            { discountPrice: { not: null } },
            {
              discountPrice: {
                ...(minPrice ? { gte: minPrice } : {}),
                ...(maxPrice ? { lte: maxPrice } : {}),
              },
            },
          ],
        },
        {
          AND: [
            { discountPrice: null },
            {
              price: {
                ...(minPrice ? { gte: minPrice } : {}),
                ...(maxPrice ? { lte: maxPrice } : {}),
              },
            },
          ],
        },
      ];
    }

    const orderBy =
      sortBy === "price"
        ? [
            { discountPrice: order },
            { price: order }, // fallback if no discount
          ]
        : sortBy === "name"
        ? { name: order }
        : { createdAt: order };

    const [foodItems, totalCount] = await Promise.all([
      prisma.foodItem.findMany({
        where: whereClause,
        include: { category: { select: { id: true, name: true } } },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.foodItem.count({ where: whereClause }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      message: "Food items fetched successfully",
      data: foodItems,
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage,
        hasPrevPage,
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