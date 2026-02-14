// --- Main Food Page Component ---

import ReusableGrid, {
  BulkAction,
  Column,
  FetchParams,
  PaginationState,
} from "@/components/DataTable/datatable";
import Image from "next/image";
import { useEffect, useState } from "react";

interface FoodItem {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  imageUrl: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  preparationTime: number;
  calories: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
  };
}

export default function FoodPage() {
  // --- State Management ---
  const [data, setData] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasPrev: false,
    hasNext: false,
  });

  // --- Column Definitions ---
  const columns: Column<FoodItem>[] = [
    {
      header: "Sr No",
      accessorKey: "srNo",
      width: "70px",
    },
    {
      header: "Image",
      accessorKey: "imageUrl",
      width: "80px",
      cell: (row) => (
        <img
          src = {row.imageUrl || ""}
          alt = {row.name}
          className="w-10 h-10 object-cover rounded-md border"
        />
      ),
    },
    {
      header: "Name",
      accessorKey: "name",
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500 truncate w-32">
            {row.description}
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      accessorKey: "category.name",
      options: ["Burger", "Pizza"],
      cell: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
          {row.category.name}
        </span>
      ),
    },
    {
      header: "Price",
      accessorKey: "price",
      sortable: true,
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">
            ₹{row.discountPrice}
          </span>
          {row.discountPrice && row.discountPrice !== row.price && (
            <span className="text-xs text-gray-400 line-through">
              ₹{row.price}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Dietary",
      accessorKey: "isVegetarian",
      cell: (row) => (
        <div className="flex gap-1">
          {row.isVegetarian && (
            <span className="inline-block w-4 h-4 rounded-full border border-green-600 p-[2px]">
              <span className="block w-full h-full rounded-full bg-green-600"></span>
            </span>
          )}
          {!row.isVegetarian && (
            <span className="inline-block w-4 h-4 rounded-full border border-red-600 p-[2px]">
              <span className="block w-full h-full rounded-full bg-red-600"></span>
            </span>
          )}
          {row.isVegan && (
            <span className="px-1 text-[10px] border border-green-500 text-green-600 rounded">
              VEGAN
            </span>
          )}
        </div>
      ),
    },
  ];

  // --- Data Fetching Logic (API + Client-Side Processing) ---
  const fetchData = async (params: FetchParams) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.append("page", params.page.toString());
      query.append("limit", params.limit.toString());


      if (params.search) query.append("search", params.search);

      if (params.sortBy) {
        query.append("sortBy", params.sortBy);
        query.append("order", params.sortOrder ?? "asc");
      }

      Object.entries(params.filters).forEach(([key, value]) => {
        if (value === "Burger") query.append("categoryId", "9");
        if (value === "Pizza") query.append("categoryId", "8");
      });

      const url = `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/public/food?${query.toString()}`;
      console.log("API CALL:", url);

      const res = await fetch(url);
      const result = await res.json();

      if (!result.success) {
        setData([]);
        return;
      }

      // --- ADD SR NO BEFORE SETTING DATA ---
      const pageSize = result.pagination.pageSize;
      const currentPage = result.pagination.currentPage;

      const modifiedData = result.data.map((item: FoodItem, index: number) => ({
        ...item,
        srNo: (currentPage - 1) * pageSize + (index + 1),
      }));

      setData(modifiedData);

      // --- SET PAGINATION ---
      const p = result.pagination;

      setPagination({
        currentPage: p.currentPage,
        totalPages: p.totalPages,
        totalRecords: p.totalItems,
        hasPrev: p.hasPrevPage,
        hasNext: p.hasNextPage,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchData({
      page: 1,
      search: "",
      sortBy: null,
      sortOrder: null,
      filters: {},
      limit:10
    });
  }, []);

  // --- Handlers ---
  const handleEdit = (row: FoodItem) => {
    console.log("Edit row:", row);
  };

  const handleView = (row: FoodItem) => {
    console.log("View row:", row);
  };

  const handleDelete = async (row: FoodItem) => {
    console.log("Deleting row:", row.id);
    fetchData({
      page: 1,
      search: "",
      sortBy: null,
      sortOrder: null,
      filters: {},
      limit:10
    });
  };

  const handleStatusChange = (row: FoodItem, newValue: boolean) => {
    console.log(`Toggling availability for ${row.name} to ${newValue}`);
    setData((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, isAvailable: newValue } : item
      )
    );
  };

  // --- Bulk Actions ---
  const bulkActions: BulkAction<FoodItem>[] = [
    {
      label: "Print Selected",
      onClick: (selectedRows) => {
        console.log("Selected rows:", selectedRows);
        alert(`Selected ${selectedRows.length} item(s):\n${selectedRows.map((r) => r.name).join(", ")}`);
      },
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Food Menu</h1>
          <p className="text-gray-500">Manage your restaurant menu items.</p>
        </div>
        <button className="bg-textxprimary text-bgxbase px-4 py-2 rounded-lg hover:bg-bgxbase/50 transition cursor-pointer">
          + Add Food Item
        </button>
      </div>

      <ReusableGrid<FoodItem>
        columns={columns}
        data={data}
        pagination={pagination}
        loading={loading}
        onFetchData={fetchData}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        // onStatusChange={handleStatusChange}   // if dont pass then hide switch button
        permissions={{ canEdit: true, canDelete: true }}
        uniqueId="id"
        statusKey="isAvailable"
        bulkActions={bulkActions}
      />
    </div>
  );
}
