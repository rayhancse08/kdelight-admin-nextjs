'use client'
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
import { getTopProducts } from "@/lib/getProducts";

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

const categoryMap: Record<number, string> = {
  32: "Snacks",
};

export async function TopProducts(): Promise<JSX.Element> {
  const data: Product[] = await getTopProducts();

  // Because your component is async (server component), React state/hooks won't work here.
  // So you should convert this to a Client Component OR move the menu logic into a child Client Component.
  // For demo, I'll create an inner Client component for the row with menu.

  function ProductRowWithMenu({ product }: { product: Product }) {
    const [open, setOpen] = useState(false);

    // Handlers for actions
    function onEdit() {
      alert(`Edit ${product.name}`);
      setOpen(false);
    }
    function onView() {
      alert(`View ${product.name}`);
      setOpen(false);
    }
    function onDelete() {
      if (confirm(`Are you sure you want to delete ${product.name}?`)) {
        alert(`Deleted ${product.name}`);
        setOpen(false);
      }
    }

    const imageSrc = product.image || product.thumbnail || "/product-default.png";

    return (
      <TableRow
        className="text-base font-medium text-dark dark:text-white relative"
        key={product.id}
      >
        <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
          <Image
            src={imageSrc}
            className="aspect-[6/5] w-15 rounded-[5px] object-cover"
            width={60}
            height={50}
            alt={`Image for product ${product.name}`}
            role="presentation"
          />
          <div>{product.name}</div>
        </TableCell>
        <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
        <TableCell>{product.stock}</TableCell>
        <TableCell>{product.weight} {product.unit}</TableCell>
        <TableCell>{product.packet_per_carton}</TableCell>

        {/* Action cell */}
        <TableCell className="relative pr-5 sm:pr-6 xl:pr-7.5 text-right">
          <button
            aria-label="Open actions menu"
            onClick={() => setOpen(!open)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {/* 3 dots icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx={5} cy={12} r={2} />
              <circle cx={12} cy={12} r={2} />
              <circle cx={19} cy={12} r={2} />
            </svg>
          </button>

          {/* Dropdown menu */}
          {open && (
            <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
              <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <button
                    onClick={onEdit}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    onClick={onView}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    View
                  </button>
                </li>
                <li>
                  <button
                    onClick={onDelete}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                  >
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          )}
        </TableCell>
      </TableRow>
    );
  }

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">Products</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">Product Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Packet Per Carton</TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((product) => (
            <ProductRowWithMenu key={product.id} product={product} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
