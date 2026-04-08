"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProductTable from "@/components/Products/ProductTable";
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: "",
    price: "",
    stock: "",
    weight: "",
    unit: "",
    packet_per_carton: "",
  });

  /* Load Products */
  const loadProducts = async () => {
    try {
      const data = await apiFetch(
        "https://kdelight.info/api/products/"
      );
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* Handle Create */
  const handleCreate = async () => {
    try {
      await apiFetch("https://kdelight.info/api/products/", {
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

      loadProducts();
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Products" />

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          + Add Product
        </button>
      </div>

      <ProductTable products={products} />

      {/* ========= Add Product Modal ========= */}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              Add Product
            </h2>

            <div className="space-y-3">
              <input
                placeholder="Product Name"
                className="border p-2 w-full rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />

              <input
                placeholder="Price"
                type="number"
                className="border p-2 w-full rounded"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: e.target.value,
                  })
                }
              />

              <input
                placeholder="Stock"
                type="number"
                className="border p-2 w-full rounded"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: e.target.value,
                  })
                }
              />

              <input
                placeholder="Weight"
                type="number"
                className="border p-2 w-full rounded"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weight: e.target.value,
                  })
                }
              />

              <input
                placeholder="Unit"
                className="border p-2 w-full rounded"
                value={formData.unit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unit: e.target.value,
                  })
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

            {/* Actions */}
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