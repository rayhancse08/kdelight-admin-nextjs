"use client";

import React from "react";
import Link from "next/link";
import { Sale } from "@/app/sales/page";

type Props = {
  sales: Sale[];
  onRefresh: () => void;
};

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  confirmed: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function SaleTable({ sales, onRefresh }: Props) {
  if (!sales.length) {
    return (
      <div className="text-center py-16 text-gray-400">No sales found.</div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
        <tr>
          <th className="px-4 py-3 text-left">Date</th>
          <th className="px-4 py-3 text-left">Delivery</th>
          <th className="px-4 py-3 text-left">Store</th>
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-right">Sub Total</th>
          <th className="px-4 py-3 text-right">Discount</th>
          <th className="px-4 py-3 text-right">Total</th>
          <th className="px-4 py-3 text-right">Paid</th>
          <th className="px-4 py-3 text-right">Due</th>
          <th className="px-4 py-3 text-center">Actions</th>
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
        {sales.map((sale) => (
          <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3">{sale.date}</td>
            <td className="px-4 py-3">{sale.delivery_date ?? "—"}</td>
            <td className="px-4 py-3 font-medium">{sale.store_name}</td>
            <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    STATUS_STYLES[sale.status] ?? "bg-gray-100 text-gray-500"
                  }`}
                >
                  {sale.status}
                </span>
            </td>
            <td className="px-4 py-3 text-right">{sale.sub_total}</td>
            <td className="px-4 py-3 text-right text-red-500">
              {sale.discount}
            </td>
            <td className="px-4 py-3 text-right font-semibold">
              {sale.total}
            </td>
            <td className="px-4 py-3 text-right text-green-600">
              {sale.payment}
            </td>
            <td className="px-4 py-3 text-right text-orange-500">
              {sale.payment_due}
            </td>
            <td className="px-4 py-3 text-center">
              <Link
                href={`/sales/${sale.id}`}
                className="text-blue-600 hover:underline text-xs"
              >
                View / Edit
              </Link>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}