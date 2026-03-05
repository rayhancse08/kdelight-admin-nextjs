"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProductTable from "@/components/Products/ProductTable";
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";

export default function ProductPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await apiFetch("https://kdelight.info/api/products/");
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    }

    loadProducts();
  }, []);

  console.log(products);

  return (
    <>
      <Breadcrumb pageName="Products" />

      <div className="space-y-10">
        <ProductTable products={products} />
      </div>
    </>
  );
}