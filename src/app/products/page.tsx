"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProductTable from "@/components/Products/ProductTable";
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: "",
    price: "",
    stock: "",
    weight: "",
    unit: "",
    packet_per_carton: "",
  });

  /* ---------------- Load Products ---------------- */

  const loadProducts = async (pageNumber = 1) => {
    try {
      const data: PaginatedResponse<Product> = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/?page=${pageNumber}&page_size=${pageSize}`
      );

      setProducts(data.results);   // ✅ FIX
      setCount(data.count);
      setPage(pageNumber);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProducts(page);
  }, []);

  /* ---------------- Create ---------------- */

  const handleCreate = async () => {
    try {
      await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/`, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      setIsModalOpen(false);

      setFormData({
        name: "",
        price: "",
        stock: "",
        weight: "",
        unit: "",
        packet_per_carton: "",
      });

      loadProducts(page); // reload current page
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  /* ---------------- Pagination Logic ---------------- */

  const totalPages = Math.ceil(count / pageSize);

  const goToNext = () => {
    if (page < totalPages) loadProducts(page + 1);
  };

  const goToPrev = () => {
    if (page > 1) loadProducts(page - 1);
  };

  const goToPage = (p: number) => {
    loadProducts(p);
  };

  /* ---------------- Render ---------------- */

  return (
    <>
      <Breadcrumb pageName="Products" />

      <div className="flex justify-between mb-6">
        <p className="text-sm text-gray-500">
          Total: {count} products
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          + Add Product
        </button>
      </div>

      <ProductTable products={products} />

      {/* ---------------- Pagination UI ---------------- */}

      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        <button
          onClick={goToPrev}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`px-3 py-1 border rounded ${
                p === page ? "bg-blue-600 text-white" : ""
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={goToNext}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* ---------------- Modal ---------------- */}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Add Product</h2>

            <div className="space-y-3">
              <input
                placeholder="Product Name"
                className="border p-2 w-full rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <input
                placeholder="Price"
                type="number"
                className="border p-2 w-full rounded"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />

              <input
                placeholder="Stock"
                type="number"
                className="border p-2 w-full rounded"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
              />

              <input
                placeholder="Weight"
                type="number"
                className="border p-2 w-full rounded"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
              />

              <input
                placeholder="Unit"
                className="border p-2 w-full rounded"
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
              />

              <input
                placeholder="Packet Per Carton"
                type="number"
                className="border p-2 w-full rounded"
                value={formData.packet_per_carton}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    packet_per_carton: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}