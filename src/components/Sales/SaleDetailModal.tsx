"use client";
import React, { useState } from "react";
import { SaleDetail, SaleStatus } from "@/types/sale";

const STATUS_OPTS: SaleStatus[] = [
  "confirmed", "packing", "delivering", "delivered", "cancelled"
];

const fmt = (v: string | null) =>
  v ? "৳" + parseFloat(v).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "—";

type Props = {
  sale: SaleDetail | null;
  loading: boolean;
  onClose: () => void;
  onStatusChange: (id: number, status: string) => void;
  onAddPayment: (saleId: number, amount: string, date: string) => void;
};

export default function SaleDetailModal({
                                          sale, loading, onClose, onStatusChange, onAddPayment
                                        }: Props) {
  const [tab, setTab] = useState<"items" | "payments" | "summary">("items");
  const [payAmt, setPayAmt] = useState("");
  const [payDate, setPayDate] = useState(new Date().toISOString().slice(0, 10));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center py-8 overflow-y-auto px-4 mt-20">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl">
        {/* Header */}
        <div className="px-7 pt-6 pb-5 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Order {sale?.order_no ?? "..."}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {sale?.store_name} · {sale?.date}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {sale && (
              <select
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400"
                value={sale.status}
                onChange={(e) => onStatusChange(sale.id, e.target.value)}
              >
                {STATUS_OPTS.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-7 py-6">
          {loading && (
            <div className="text-center py-16 text-gray-400">Loading...</div>
          )}
          {!loading && sale && (
            <>
              {/* Tabs */}
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-5">
                {(["items", "payments", "summary"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-5 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${
                      tab === t
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t}
                    {t === "payments" && sale.sale_payments.length > 0 && (
                      <span className="ml-1.5 bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full">
                        {sale.sale_payments.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Items Tab */}
              {tab === "items" && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-400 uppercase">
                    <tr>
                      {["Product", "Qty", "Price", "Discount", "Total",
                        "Cost", "Profit", "Lots"].map((h) => (
                        <th key={h} className={`px-4 py-3 font-semibold tracking-wide ${
                          ["Qty","Price","Discount","Total","Cost","Profit"].includes(h)
                            ? "text-right" : "text-left"
                        }`}>{h}</th>
                      ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                    {sale.sale_items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{item.product_name}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-gray-600">{fmt(item.price)}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-red-500">
                          {parseFloat(item.discount) > 0 ? "-" + fmt(item.discount) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-gray-800">{fmt(item.total_price)}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-gray-400">{fmt(item.total_purchased_price)}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-emerald-600">{fmt(item.profit)}</td>
                        <td className="px-4 py-3">
                          {item.lot_information
                            ? <span className="bg-blue-50 text-blue-700 font-mono text-xs px-2 py-1 rounded">{item.lot_information}</span>
                            : <span className="text-gray-400">—</span>}
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Payments Tab */}
              {tab === "payments" && (
                <div>
                  <div className="space-y-2 mb-5">
                    {sale.sale_payments.length === 0 && (
                      <p className="text-center py-8 text-gray-400 text-sm">No payments recorded</p>
                    )}
                    {sale.sale_payments.map((p) => (
                      <div key={p.id} className="flex justify-between items-center bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-sm text-gray-700">{p.date}</span>
                          {p.note && <span className="text-xs text-gray-400">{p.note}</span>}
                        </div>
                        <span className="font-mono font-semibold text-emerald-700">{fmt(p.amount)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Record Payment</p>
                    <div className="grid grid-cols-3 gap-3 items-end">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Amount</label>
                        <input
                          type="number" placeholder="0.00"
                          className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400"
                          value={payAmt}
                          onChange={(e) => setPayAmt(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Date</label>
                        <input
                          type="date"
                          className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400"
                          value={payDate}
                          onChange={(e) => setPayDate(e.target.value)}
                        />
                      </div>
                      <button
                        onClick={() => { onAddPayment(sale.id, payAmt, payDate); setPayAmt(""); }}
                        className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
                      >
                        Add Payment
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Tab */}
              {tab === "summary" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Order Totals</p>
                    {[
                      { label: "Sub Total", value: fmt(sale.sub_total) },
                      { label: "Discount", value: "-" + fmt(sale.discount), color: "text-red-500" },
                      { label: "Shipping", value: fmt(sale.shipping_charge) },
                      { label: "Total", value: fmt(sale.total), bold: true },
                    ].map(({ label, value, color, bold }) => (
                      <div key={label} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                        <span className="text-sm text-gray-500">{label}</span>
                        <span className={`font-mono text-sm font-medium ${color ?? "text-gray-800"} ${bold ? "font-bold text-base" : ""}`}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Payment Status</p>
                    {[
                      { label: "Total Paid", value: fmt(sale.payment), color: "text-emerald-600" },
                      { label: "Amount Due", value: parseFloat(sale.payment_due) > 0 ? fmt(sale.payment_due) : "Fully paid ✓", color: parseFloat(sale.payment_due) > 0 ? "text-orange-500" : "text-gray-400" },
                      { label: "Profit", value: fmt(sale.profit), color: "text-blue-600" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                        <span className="text-sm text-gray-500">{label}</span>
                        <span className={`font-mono text-sm font-medium ${color}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-7 pb-6 pt-4 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}