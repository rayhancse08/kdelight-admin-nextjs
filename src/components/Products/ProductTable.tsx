"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: string;
  discount_price?: number;
  thumbnail?: string;
  image?: string;
  stock?: number;
  description?: string | null;
  weight?: number;
  unit?: string;
  packet_per_carton?: number;
  packet_price?: string;
  category: number;
  sold?: number;
  profit?: number;
}

interface Props {
  products: Product[];
}

export default function ProductTableClient({ products }: Props) {
  const [productList, setProductList] = useState(products); // keep products in state
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"view" | "edit" | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const onEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
    setModalType("edit");
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const onView = (product: Product) => {
    setSelectedProduct(product);
    setModalType("view");
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const onDelete = (product: Product) => {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      setProductList((prev) => prev.filter((p) => p.id !== product.id));
      setOpenMenuId(null);
    }
  };

  const handleInputChange = (field: keyof Product, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://kdelight.info/api/products/${selectedProduct.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error(`Error ${res.status}`);
      const updatedProduct: Product = await res.json();

      // Update the product in local state without reload
      setProductList((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );

      // alert("Product updated successfully!");
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setFormData({});
    setError(null);
  };

  return (
    <>
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Products
          </h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Packet Per Carton</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {productList.map((product) => {
              const imageSrc =
                product.image || product.thumbnail || "/product-default.png";

              return (
                <TableRow key={product.id}>
                  <TableCell className="flex items-center gap-3">
                    <Image
                      src={imageSrc}
                      width={60}
                      height={50}
                      alt={`Image for product ${product.name}`}
                      className="rounded"
                    />
                    <div>{product.name}</div>
                  </TableCell>
                  <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    {product.weight} {product.unit}
                  </TableCell>
                  <TableCell>{product.packet_per_carton}</TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => toggleMenu(product.id)}
                      className="px-2"
                    >
                      ⋮
                    </button>
                    {openMenuId === product.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border shadow-md z-10">
                        <button
                          onClick={() => onView(product)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onEdit(product)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => onDelete(product)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4 capitalize">
              {modalType} Product
            </h3>

            {modalType === "view" ? (
              <div className="space-y-2">
                <p><strong>Name:</strong> {selectedProduct.name}</p>
                <p><Image
                  src={selectedProduct.image||"/product-default.png"}
                  width={100}
                  height={100}
                  alt="product image"
                  className="rounded"
                /></p>
                <p><strong>Price:</strong> {selectedProduct.price}</p>
                <p><strong>Stock:</strong> {selectedProduct.stock}</p>
                <p><strong>Weight:</strong> {selectedProduct.weight} {selectedProduct.unit}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <label>Product Name
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border p-2 w-full rounded"
                  placeholder="Name"
                />
                </label>
                <label>Weight
                <input
                  type="number"
                  value={formData.weight || ""}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  className="border p-2 w-full rounded"
                  placeholder="Weight"
                />
              </label>
                <label>Unit
                <input
                  type="string"
                  value={formData.unit || ""}
                  onChange={(e) =>
                    handleInputChange("stock", Number(e.target.value))
                  }
                  className="border p-2 w-full rounded"
                  placeholder="Stock"
                />
                </label>
              </div>
            )}

            {error && <div className="text-red-500 mt-2">{error}</div>}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Close
              </button>
              {modalType === "edit" && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
