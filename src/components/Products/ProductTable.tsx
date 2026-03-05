"use client";

import React, { useState, useEffect,useRef } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Product {
  id: number;
  name: string;
  price: string | number;
  stock?: number;
  weight?: number;
  unit?: string;
  thumbnail?: string;
  image?: string;
  packet_per_carton?: number;
  category?: number;
}

interface Props {
  products: Product[];
}

export default function ProductTableClient({ products }: Props) {
  const [productList, setProductList] = useState<Product[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"view" | "edit" | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const menuRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- Sync Props → State ---------------- */

  useEffect(() => {
    setProductList(products || []);
  }, [products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ---------------- Helpers ---------------- */

  const getImage = (product: Product) => {
    if (product.image && product.image.trim() !== "")
      return product.image;
    if (product.thumbnail && product.thumbnail.trim() !== "")
      return product.thumbnail;
    return "/product-default.png";
  };

  /* ---------------- Actions ---------------- */

  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const onView = (product: Product) => {
    setSelectedProduct(product);
    setModalType("view");
    setIsModalOpen(true);
  };

  const onEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
    setModalType("edit");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setFormData({});
    setError("");
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ---------------- Update Product ---------------- */

  const handleSave = async () => {
    if (!selectedProduct) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("access");

      const res = await fetch(
        `https://kdelight.info/api/products/${selectedProduct.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            name: formData.name,
            price: Number(formData.price),
            weight: Number(formData.weight),
            unit: formData.unit,
            packet_per_carton: Number(formData.packet_per_carton),
            stock: Number(formData.stock),
          }),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();

      setProductList((prev) =>
        prev.map((p) =>
          p.id === updated.id ? { ...p, ...updated } : p
        )
      );

      closeModal();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Delete ---------------- */

  const onDelete = (product: Product) => {
    if (!confirm(`Delete ${product.name}?`)) return;

    setProductList((prev) =>
      prev.filter((p) => p.id !== product.id)
    );
  };

  /* ---------------- Render ---------------- */

  return (
    <>
      <div className="rounded-xl bg-white shadow">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Products</h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Packet/Carton</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {productList.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="flex items-center gap-3">
                  <Image
                    src={getImage(product)}
                    width={50}
                    height={50}
                    alt={product.name}
                    className="rounded object-cover"
                    unoptimized
                  />
                  {product.name}
                </TableCell>

                <TableCell>
                  ${Number(product.price || 0).toFixed(2)}
                </TableCell>

                <TableCell>{product.stock}</TableCell>

                <TableCell>
                  {product.weight} {product.unit}
                </TableCell>

                <TableCell>{product.packet_per_carton}</TableCell>

                <TableCell className="text-right relative">
                  <button onClick={() => toggleMenu(product.id)}>
                    ⋮
                  </button>

                  {openMenuId === product.id && (
                    <div ref={menuRef}
                             className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-20">
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
                        className="block w-full text-left px-4 py-2 text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ---------------- Modal ---------------- */}

      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 capitalize">
              {modalType} Product
            </h2>

            {modalType === "view" ? (
              <div className="space-y-2">
                <p>Name: {selectedProduct.name}</p>
                <p>
                  Price: $
                  {Number(selectedProduct.price).toFixed(2)}
                </p>
              </div>
            ) : (
              <div className="space-y-4">

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product Name
                  </label>
                  <input
                    value={formData.name || ""}
                    onChange={(e) =>
                      handleInputChange("name", e.target.value)
                    }
                    placeholder="Product Name"
                    className="border p-2 w-full rounded"
                  />
                </div>

                {/* Price */}
                {/*<div>*/}
                {/*  <label className="block text-sm font-medium mb-1">*/}
                {/*    Price*/}
                {/*  </label>*/}
                {/*  <input*/}
                {/*    type="number"*/}
                {/*    step="0.01"*/}
                {/*    value={formData.price || ""}*/}
                {/*    onChange={(e) =>*/}
                {/*      handleInputChange("price", e.target.value)*/}
                {/*    }*/}
                {/*    placeholder="Price"*/}
                {/*    className="border p-2 w-full rounded"*/}
                {/*  />*/}
                {/*</div>*/}

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Weight
                  </label>
                  <input
                    type="number"
                    value={formData.weight || ""}
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                    placeholder="Weight"
                    className="border p-2 w-full rounded"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Unit
                  </label>
                  <input
                    value={formData.unit || ""}
                    onChange={(e) =>
                      handleInputChange("unit", e.target.value)}
                    placeholder="Unit (gm, kg, etc)"
                    className="border p-2 w-full rounded"
                  />
                </div>

                {/* Packet Per Carton */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Packet Per Carton
                  </label>
                  <input
                    type="number"
                    value={formData.packet_per_carton || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "packet_per_carton",
                        e.target.value
                      )
                    }
                    placeholder="Packet Per Carton"
                    className="border p-2 w-full rounded"
                  />
                </div>

              </div>
            )}

            {error && (
              <p className="text-red-500 mt-2">{error}</p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Close
              </button>

              {modalType === "edit" && (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
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