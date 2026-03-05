"use client";

import { useEffect, useState } from "react";

export default function BrandAdminPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch("/api/brands");
        const data = await res.json();
        setBrands(data);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBrands();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Brands</h1>

      {brands.map((brand) => (
        <BrandCard key={brand.id} brand={brand} />
      ))}
    </div>
  );
}

/* ================= Brand Card ================= */

function BrandCard({ brand }) {
  return (
    <div className="border rounded-xl p-6 mb-8 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{brand.name}</h2>
        <span className="text-sm text-gray-600">
          Products: {brand.products?.length || 0}
        </span>
      </div>

      {/* Product Inline Table (like TabularInline) */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Stocked Quantity</th>
            <th className="p-2 text-left">Packet per Carton</th>
          </tr>
          </thead>
          <tbody>
          {brand.products?.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="p-2">
                {product.name} ({product.weight} {product.unit})
              </td>
              <td className="p-2">{product.stocked_quantity}</td>
              <td className="p-2">{product.packet_per_carton}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}