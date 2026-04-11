"use client";

import React from "react";
import { Purchase } from "@/types/purchase";

type Props = {
  purchases: Purchase[];
  total: number;
  page: number;
  onPageChange: (p: number) => void;
  onRowClick: (id: number) => void;
};

const fmt = (v: string | null) =>
  v ? "$" + parseFloat(v).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "—";

export default function PurchaseTable({
                                        purchases, total, page, onPageChange, onRowClick,
                                      }: Props) {
  const pageSize = 25;
  const pages = Math.ceil(total / pageSize);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
        <span className="font-semibold text-gray-800">Purchase Orders</span>
        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full">
          {total} total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-400 text-xs uppercase border-b border-gray-100">
          <tr>
            {[
              "Lot No", "Vendor", "Date", "Receive Date",
              "Product Price", "Total Cost", "Cartons",
              "Paid", "Due", "Exp. Profit", ""
            ].map((h) => (
              <th
                key={h}
                className={`px-4 py-3 font-semibold tracking-wide ${
                  ["Product Price","Total Cost","Paid","Due","Exp. Profit"].includes(h)
                    ? "text-right" : "text-left"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
          {purchases.length === 0 && (
            <tr>
              <td colSpan={11} className="text-center py-16 text-gray-400">
                No purchases found
              </td>
            </tr>
          )}
          {purchases.map((p) => (
            <tr
              key={p.id}
              onClick={() => onRowClick(p.id)}
              className="hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-700">
                {p.lot_number}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {p.vendor_name?.[0] ?? "?"}
                  </div>
                  <span className="font-medium text-gray-800 text-xs">
                      {p.vendor_name ?? "—"}
                    </span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600 text-xs">{p.date ?? "—"}</td>
              <td className="px-4 py-3 text-gray-600 text-xs">{p.receive_date ?? "—"}</td>
              <td className="px-4 py-3 text-right font-mono text-xs text-gray-600">
                {fmt(p.total_product_price)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-gray-800">
                {fmt(p.total_purchase_cost)}
              </td>
              <td className="px-4 py-3 text-center text-xs text-gray-600">
                {p.total_carton ?? "—"}
              </td>
              <td className="px-4 py-3 text-right font-mono text-xs text-emerald-600">
                {fmt(p.payment)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-xs">
                {parseFloat(p.payment_due) > 0
                  ? <span className="text-orange-500">{fmt(p.payment_due)}</span>
                  : <span className="text-gray-400">✓ Paid</span>
                }
              </td>
              <td className="px-4 py-3 text-right font-mono text-xs text-blue-600">
                {fmt(p.expected_profit)}
              </td>
              <td className="px-4 py-3">
                  <span className="opacity-0 group-hover:opacity-100 text-blue-600 bg-blue-50 text-xs px-2.5 py-1 rounded-md font-medium transition-opacity">
                    View →
                  </span>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">Page {page} of {pages}</span>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => onPageChange(n)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  n === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
