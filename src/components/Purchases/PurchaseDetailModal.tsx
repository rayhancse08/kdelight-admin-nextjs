"use client";

import React, { useState } from "react";
import { PurchaseDetail } from "@/types/purchase";

const fmt = (v: string | null | undefined) =>
  v ? "৳" + parseFloat(v).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "—";

type Props = {
  purchase: PurchaseDetail | null;
  loading: boolean;
  onClose: () => void;
  onAddPayment: (purchaseId: number, amount: string, date: string) => void;
};

const COST_LABELS: { label: string; key: keyof PurchaseDetail }[] = [
  { label: "Shipping Cost",        key: "shipping_cost" },
  { label: "Food Quality Control", key: "food_quality_control_cost" },
  { label: "Container Clearing",   key: "container_clearing_cost" },
  { label: "Lorry Shipping",       key: "lory_shipping_cost" },
  { label: "Labourer Handling",    key: "labourer_handling_cost" },
  { label: "Warehouse Rent",       key: "warehouse_rent" },
  { label: "Employee Salary",      key: "employee_salary" },
  { label: "Other Costs",          key: "warehouse_other_cost" },
];

export default function PurchaseDetailModal({
                                              purchase, loading, onClose, onAddPayment,
                                            }: Props) {
  const [tab, setTab] = useState<"items" | "costs" | "payments" | "notes">("items");
  const [payAmt, setPayAmt] = useState("");
  const [payDate, setPayDate] = useState(new Date().toISOString().slice(0, 10));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center py-8 overflow-y-auto px-4 mt-20">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl">

        {/* Header */}
        <div className="px-7 pt-6 pb-5 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">
                {purchase?.lot_number ?? "Loading..."}
              </h2>
              {purchase && (
                <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">
                  {purchase.total_carton ?? 0} cartons
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-0.5">
              {purchase?.vendor_name ?? "—"} · {purchase?.date ?? "—"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50"
          >
            ✕
          </button>
        </div>

        <div className="px-7 py-6">
          {loading && (
            <div className="text-center py-16 text-gray-400">Loading...</div>
          )}

          {!loading && purchase && (
            <>
              {/* KPI strip */}
              <div className="grid grid-cols-5 gap-3 mb-6">
                {[
                  { label: "Product Total",  value: fmt(purchase.total_product_price), color: "text-gray-800" },
                  { label: "Total Cost",     value: fmt(purchase.total_purchase_cost), color: "text-gray-800" },
                  { label: "Paid",           value: fmt(purchase.payment),             color: "text-emerald-600" },
                  { label: "Due",            value: parseFloat(purchase.payment_due) > 0 ? fmt(purchase.payment_due) : "✓ Paid", color: parseFloat(purchase.payment_due) > 0 ? "text-orange-500" : "text-gray-400" },
                  { label: "Exp. Profit",    value: fmt(purchase.expected_profit),     color: "text-blue-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-xs text-gray-400 mb-1">{label}</div>
                    <div className={`font-mono font-semibold text-sm ${color}`}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-5">
                {(["items", "costs", "payments", "notes"] as const).map((t) => (
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
                    {t === "payments" && purchase.purchase_payments.length > 0 && (
                      <span className="ml-1.5 bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full">
                        {purchase.purchase_payments.length}
                      </span>
                    )}
                    {t === "items" && (
                      <span className="ml-1.5 bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">
                        {purchase.purchase_items.length}
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
                      {["Product", "Pkt/Ctn", "Unit Price", "Carton Price",
                        "Carton+Cost", "Purchased", "Received", "Damaged",
                        "Sale Price", "Total"].map((h) => (
                        <th key={h} className={`px-4 py-3 font-semibold tracking-wide ${
                          ["Unit Price","Carton Price","Carton+Cost","Sale Price","Total"].includes(h)
                            ? "text-right" : "text-left"
                        }`}>{h}</th>
                      ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                    {purchase.purchase_items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{item.product_name}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{item.packet_per_carton}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-gray-600">{fmt(item.unit_price)}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-gray-600">{fmt(item.carton_price)}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-gray-700 font-medium">{fmt(item.carton_total_price)}</td>
                        <td className="px-4 py-3 text-center text-xs">{item.purchased_carton}</td>
                        <td className="px-4 py-3 text-center text-xs text-emerald-600">{item.received_carton ?? "—"}</td>
                        <td className="px-4 py-3 text-center text-xs text-red-500">{item.damaged_carton ?? "—"}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-blue-600">{fmt(item.sale_price)}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-gray-800">{fmt(item.total_price)}</td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Costs Tab */}
              {tab === "costs" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                      Import & Logistics Costs
                    </p>
                    {COST_LABELS.map(({ label, key }) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                        <span className="text-sm text-gray-500">{label}</span>
                        <span className="font-mono text-sm text-gray-700">
                          {fmt(purchase[key] as string)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                      Summary
                    </p>
                    {[
                      { label: "Product Total",       value: fmt(purchase.total_product_price) },
                      { label: "Total Purchase Cost", value: fmt(purchase.total_purchase_cost), bold: true },
                      { label: "Carton Handling Cost",value: fmt(purchase.carton_handling_cost) },
                      { label: "Total Cartons",       value: String(purchase.total_carton ?? "—") },
                      { label: "Expected Sales",      value: fmt(purchase.expected_sales), color: "text-blue-600" },
                      { label: "Expected Profit",     value: fmt(purchase.expected_profit), color: "text-emerald-600" },
                    ].map(({ label, value, bold, color }) => (
                      <div key={label} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                        <span className="text-sm text-gray-500">{label}</span>
                        <span className={`font-mono text-sm font-medium ${color ?? "text-gray-800"} ${bold ? "font-bold text-base" : ""}`}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payments Tab */}
              {tab === "payments" && (
                <div>
                  <div className="space-y-2 mb-5">
                    {purchase.purchase_payments.length === 0 && (
                      <p className="text-center py-8 text-gray-400 text-sm">
                        No payments recorded
                      </p>
                    )}
                    {purchase.purchase_payments.map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between items-center bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3.5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-sm text-gray-700">{p.date}</span>
                          {p.note && (
                            <span className="text-xs text-gray-400">{p.note}</span>
                          )}
                          {p.account_information && (
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                              {p.account_information}
                            </span>
                          )}
                        </div>
                        <span className="font-mono font-semibold text-emerald-700">
                          {fmt(p.amount)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Add payment */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Record Payment
                    </p>
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
                        onClick={() => {
                          onAddPayment(purchase.id, payAmt, payDate);
                          setPayAmt("");
                        }}
                        className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
                      >
                        Add Payment
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes Tab */}
              {tab === "notes" && (
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { label: "LC Information",        value: purchase.lc_information },
                    { label: "BIL Information",       value: purchase.bil_information },
                    { label: "Container Information", value: purchase.container_information },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        {label}
                      </p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {value || <span className="text-gray-400 italic">Not provided</span>}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 pb-6 pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
