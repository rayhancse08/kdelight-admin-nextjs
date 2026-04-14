"use client";
import React from "react";
import { Sale } from "@/types/sale";

const STATUS: Record<string, string> = {
  confirmed: "bg-blue-50 text-blue-700",
  packing: "bg-green-50 text-green-700",
  delivering: "bg-orange-50 text-orange-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-600",
};

const fmt = (v: string | null) =>
  v ? "$" + parseFloat(v).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "—";

type Props = {
  sales: Sale[];
  total: number;
  page: number;
  onPageChange: (p: number) => void;
  onRowClick: (id: number) => void;
};

export default function SaleTable({ sales, total, page, onPageChange, onRowClick }: Props) {
  const pageSize = 25;
  const pages = Math.ceil(total / pageSize);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mt-20">
      <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
        <span className="font-semibold text-gray-800">Orders</span>
        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full">
          {total} total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-400 text-xs uppercase border-b border-gray-100">
          <tr>
            {["Order", "Store", "Date", "Delivery", "Status",
              "Sub Total", "Discount", "Total", "Paid", "Due", ""].map((h) => (
              <th key={h} className={`px-4 py-3 font-semibold tracking-wide ${
                ["Sub Total","Discount","Total","Paid","Due"].includes(h)
                  ? "text-right" : "text-left"
              }`}>{h}</th>
            ))}
          </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
          {sales.length === 0 && (
            <tr>
              <td colSpan={11} className="text-center py-16 text-gray-400">
                No sales found
              </td>
            </tr>
          )}
          {sales.map((s) => (
            <tr
              key={s.id}
              onClick={() => onRowClick(s.id)}
              className="hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.order_no}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {s.store_name?.[0]}
                  </div>
                  <span className="font-medium text-gray-800 text-xs">{s.store_name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600 text-xs">{s.date}</td>
              <td className="px-4 py-3 text-gray-600 text-xs">{s.delivery_date ?? "—"}</td>
              <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS[s.status] ?? "bg-gray-100 text-gray-500"}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                    {s.status}
                  </span>
              </td>
              <td className="px-4 py-3 text-right font-mono text-xs text-gray-600">{fmt(s.sub_total)}</td>
              <td className="px-4 py-3 text-right font-mono text-xs text-red-500">
                {parseFloat(s.discount) > 0 ? "-" + fmt(s.discount) : "—"}
              </td>
              <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-gray-800">{fmt(s.total)}</td>
              <td className="px-4 py-3 text-right font-mono text-xs text-emerald-600">{fmt(s.payment)}</td>
              <td className="px-4 py-3 text-right font-mono text-xs">
                {parseFloat(s.payment_due) > 0
                  ? <span className="text-orange-500">{fmt(s.payment_due)}</span>
                  : <span className="text-gray-400">✓ Paid</span>
                }
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

      {/* Pagination */}
      {pages > 1 && (
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Page {page} of {pages}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  p === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}