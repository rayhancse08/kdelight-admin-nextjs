import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { InvoiceTable } from "@/components/Tables/invoice-table";
import ProductTable from "@/components/Products/ProductTable";
import React, { Suspense } from "react";
import { getTopProducts } from "@/lib/getProducts";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tables",
};

const ProductPage = async () => {
  const data = await getTopProducts();

  return (
    <>
      <Breadcrumb pageName="Products" />

      <div className="space-y-10">


        <ProductTable products={data} />

      </div>
    </>
  );
};

export default ProductPage;
