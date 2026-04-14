"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {
  MonthlyWarehouseCost, WarehouseCostItem,
  WarehouseCostFormData, MonthlyFileFormData,
  MONTHS,
} from "@/types/warehouse_cost";
import {
  useCostTypes, useMonthlyFiles, useMonthlyFileDetail,
  useCreateMonthlyFile, useDeleteMonthlyFile,
  useCreateCostItem, useUpdateCostItem, useDeleteCostItem,
} from "@/hooks/useWarehouseCosts";

const fmt = (v: string | null | undefined) =>
  v ? "৳" + parseFloat(v).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "৳0.00";

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 2022 }, (_, i) => currentYear - i);

// ── Cost type badge color cycling ─────────────────────────────────────────────
const BADGE_COLORS = [
  "bg-blue-50 text-blue-700",   "bg-purple-50 text-purple-700",
  "bg-amber-50 text-amber-700", "bg-rose-50 text-rose-700",
  "bg-teal-50 text-teal-700",   "bg-orange-50 text-orange-700",
  "bg-cyan-50 text-cyan-700",   "bg-indigo-50 text-indigo-700",
];
const costTypeColor = (type: string) =>
  BADGE_COLORS[Math.abs(type.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % BADGE_COLORS.length];

// ── Delete confirm ────────────────────────────────────────────────────────────
function DeleteModal({ label, onConfirm, onClose }: { label: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-7">
        <h3 className="text-base font-semibold text-gray-900 mb-2">Delete {label}?</h3>
        <p className="text-sm text-gray-500 mb-6">This soft-deletes the record and recalculates the monthly total.</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
export default function WarehouseCostPage() {
  const [yearFilter, setYearFilter] = useState(String(currentYear));
  const [detailId, setDetailId] = useState<number | null>(null);

  // file create modal
  const [fileModal, setFileModal] = useState(false);
  const [fileForm, setFileForm] = useState<MonthlyFileFormData>({
    year: String(currentYear),
    month: String(new Date().getMonth() + 1),
  });
  const [fileDeleteId, setFileDeleteId] = useState<number | null>(null);

  // cost item modal
  const [itemModal, setItemModal] = useState(false);
  const [itemEditTarget, setItemEditTarget] = useState<WarehouseCostItem | null>(null);
  const [itemForm, setItemForm] = useState<WarehouseCostFormData>({
    cost_type: "", date: "", amount: "", notes: "",
  });
  const [itemDeleteId, setItemDeleteId] = useState<number | null>(null);

  // ── React Query ───────────────────────────────────────────────────────────
  const { data: costTypes = [] } = useCostTypes();
  const { data: files = [], isLoading: filesLoading } = useMonthlyFiles(yearFilter);
  const { data: detailFile, isLoading: detailLoading } = useMonthlyFileDetail(detailId);

  const createFile    = useCreateMonthlyFile();
  const deleteFile    = useDeleteMonthlyFile();
  const createItem    = useCreateCostItem(detailId ?? 0);
  const updateItem    = useUpdateCostItem(detailId ?? 0);
  const deleteItem    = useDeleteCostItem(detailId ?? 0);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleCreateFile = async () => {
    await createFile.mutateAsync(fileForm);
    setFileModal(false);
  };

  const openAddItem = () => {
    setItemEditTarget(null);
    setItemForm({ cost_type: costTypes[0]?.value ?? "", date: new Date().toISOString().slice(0, 10), amount: "", notes: "" });
    setItemModal(true);
  };

  const openEditItem = (item: WarehouseCostItem) => {
    setItemEditTarget(item);
    setItemForm({
      cost_type: item.cost_type,
      date: item.date ?? "",
      amount: item.amount ?? "",
      notes: item.notes ?? "",
    });
    setItemModal(true);
  };

  const handleSaveItem = async () => {
    if (itemEditTarget) {
      await updateItem.mutateAsync({ id: itemEditTarget.id, data: itemForm });
    } else {
      await createItem.mutateAsync(itemForm);
    }
    setItemModal(false);
  };

  // ── Summary stats ─────────────────────────────────────────────────────────
  const yearTotal = files.reduce((a, f) => a + parseFloat(f.total_cost || "0"), 0);
  const maxMonthCost = Math.max(...files.map((f) => parseFloat(f.total_cost || "0")), 1);

  // ── Cost type breakdown for detail ───────────────────────────────────────
  const costBreakdown = detailFile
    ? detailFile.warehouse_costs
      .filter((i) => !i.hasOwnProperty("is_deleted") || true)
      .reduce<Record<string, number>>((acc, item) => {
        if (item.amount) acc[item.cost_type_display] = (acc[item.cost_type_display] ?? 0) + parseFloat(item.amount);
        return acc;
      }, {})
    : {};

  return (
    <>
      <Breadcrumb pageName="Warehouse Costs" />

      {/* ── Toolbar ──────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-500 font-medium">Year</label>
          <select
            className="border px-3 py-2 rounded-lg text-sm outline-none focus:border-orange-400"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full">
            {files.length} months
          </span>
        </div>
        <button
          onClick={() => { setFileForm({ year: String(currentYear), month: String(new Date().getMonth() + 1) }); setFileModal(true); }}
          className="bg-orange-500 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-orange-600"
        >
          <span className="text-lg leading-none">+</span> New Month
        </button>
      </div>

      {/* ── Year KPI ─────────────────────────────────────── */}
      {files.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
              Total Warehouse Cost — {yearFilter}
            </p>
            <p className="text-2xl font-semibold text-orange-600 font-mono">{fmt(String(yearTotal))}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-1">
              {files.reduce((a, f) => a + f.item_count, 0)} cost entries
            </p>
            <p className="text-xs text-gray-500">{files.length} monthly files</p>
          </div>
        </div>
      )}

      {/* ── Monthly cards grid ───────────────────────────── */}
      {filesLoading && <div className="text-center py-16 text-gray-400">Loading...</div>}
      {!filesLoading && files.length === 0 && (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-200">
          No warehouse cost files for {yearFilter}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {files.map((f) => {
          const pct = maxMonthCost > 0 ? (parseFloat(f.total_cost || "0") / maxMonthCost) * 100 : 0;
          return (
            <div
              key={f.id}
              onClick={() => setDetailId(f.id)}
              className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-sm transition-shadow group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-sm font-bold">
                    {f.month_display.slice(0, 3)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{f.month_display} {f.year}</p>
                    <p className="text-xs text-gray-400">{f.item_count} entries</p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setFileDeleteId(f.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-md bg-red-50 text-red-400 flex items-center justify-center text-xs hover:bg-red-100"
                >
                  ✕
                </button>
              </div>
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-400">Total Cost</span>
                  <span className="font-mono text-sm font-semibold text-orange-600">
                    {fmt(f.total_cost)}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-orange-400 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ══════════════ DETAIL MODAL ══════════════ */}
      {detailId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center py-8 overflow-y-auto px-4 mt-20">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl">
            {/* Header */}
            <div className="px-7 pt-6 pb-5 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white rounded-t-2xl z-10">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {detailFile ? `${detailFile.month_display} ${detailFile.year}` : "Loading..."}
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  {detailFile?.item_count ?? 0} entries ·{" "}
                  <span className="font-mono text-orange-600 font-medium">
                    {fmt(detailFile?.total_cost)}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                {detailFile && (
                  <button
                    onClick={openAddItem}
                    className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-orange-600"
                  >
                    + Add Cost
                  </button>
                )}
                <button
                  onClick={() => setDetailId(null)}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="px-7 py-6">
              {detailLoading && <div className="text-center py-16 text-gray-400">Loading...</div>}

              {!detailLoading && detailFile && (
                <>
                  {/* Cost breakdown summary */}
                  {Object.keys(costBreakdown).length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Cost Breakdown</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(costBreakdown)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 9)
                          .map(([type, total]) => (
                            <div key={type} className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 flex justify-between items-center">
                              <span className="text-xs text-gray-600 truncate mr-2">{type}</span>
                              <span className="text-xs font-mono font-semibold text-orange-600 shrink-0">
                                {fmt(String(total))}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Items table */}
                  {detailFile.warehouse_costs.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                      No cost entries yet — click "+ Add Cost" to start
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-400 uppercase border-b border-gray-100">
                        <tr>
                          {["Cost Type", "Date", "Amount", "Notes", ""].map((h) => (
                            <th key={h} className={`px-4 py-3 font-semibold tracking-wide ${h === "Amount" ? "text-right" : "text-left"}`}>{h}</th>
                          ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {detailFile.warehouse_costs.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50 group">
                            <td className="px-4 py-3">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${costTypeColor(item.cost_type)}`}>
                                  {item.cost_type_display}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-600">{item.date ?? "—"}</td>
                            <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-orange-600">
                              {fmt(item.amount)}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">
                              {item.notes ?? "—"}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => openEditItem(item)}
                                  className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-md hover:bg-orange-100 font-medium"
                                >Edit</button>
                                <button
                                  onClick={() => setItemDeleteId(item.id)}
                                  className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-md hover:bg-red-100 font-medium"
                                >Del</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="px-7 pb-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setDetailId(null)}
                className="px-5 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ FILE CREATE MODAL ══════════════ */}
      {fileModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="px-7 pt-6 pb-5 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">New Monthly File</h2>
                <p className="text-sm text-gray-400 mt-0.5">Select year and month</p>
              </div>
              <button onClick={() => setFileModal(false)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">✕</button>
            </div>
            <div className="px-7 py-6">
              {createFile.isError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {(createFile.error as any)?.message ?? "Failed to create"}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Year</label>
                  <select className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-orange-400" value={fileForm.year} onChange={(e) => setFileForm((p) => ({ ...p, year: e.target.value }))}>
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Month</label>
                  <select className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-orange-400" value={fileForm.month} onChange={(e) => setFileForm((p) => ({ ...p, month: e.target.value }))}>
                    {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="px-7 pb-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setFileModal(false)} className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleCreateFile}
                disabled={createFile.isPending}
                className="px-6 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg disabled:opacity-60 hover:bg-orange-600"
              >
                {createFile.isPending ? "Creating..." : "Create File"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ ITEM MODAL ══════════════ */}
      {itemModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 mt-20">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="px-7 pt-6 pb-5 border-b border-gray-100 flex justify-between items-start">
              <h2 className="text-lg font-semibold text-gray-900">
                {itemEditTarget ? "Edit Cost Entry" : "Add Cost Entry"}
              </h2>
              <button onClick={() => setItemModal(false)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">✕</button>
            </div>
            <div className="px-7 py-6 space-y-4">
              {(createItem.isError || updateItem.isError) && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {((createItem.error || updateItem.error) as any)?.message ?? "Failed to save"}
                </div>
              )}

              {/* Cost type — searchable select */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Cost Type</label>
                <select
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-orange-400"
                  value={itemForm.cost_type}
                  onChange={(e) => setItemForm((p) => ({ ...p, cost_type: e.target.value }))}
                >
                  <option value="">Select cost type...</option>
                  {costTypes.map((ct) => (
                    <option key={ct.value} value={ct.value}>{ct.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Date</label>
                <input
                  type="date"
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-orange-400"
                  value={itemForm.date}
                  onChange={(e) => setItemForm((p) => ({ ...p, date: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Amount</label>
                <input
                  type="number" placeholder="0.0000"
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm text-right font-mono focus:outline-none focus:border-orange-400"
                  value={itemForm.amount}
                  onChange={(e) => setItemForm((p) => ({ ...p, amount: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Notes</label>
                <input
                  placeholder="Optional notes..."
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-orange-400"
                  value={itemForm.notes}
                  onChange={(e) => setItemForm((p) => ({ ...p, notes: e.target.value }))}
                />
              </div>
            </div>
            <div className="px-7 pb-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setItemModal(false)} className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleSaveItem}
                disabled={createItem.isPending || updateItem.isPending}
                className="px-6 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg disabled:opacity-60 hover:bg-orange-600"
              >
                {createItem.isPending || updateItem.isPending
                  ? "Saving..."
                  : itemEditTarget ? "Update" : "Add Entry"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ DELETE CONFIRMS ══════════════ */}
      {fileDeleteId !== null && (
        <DeleteModal
          label="monthly file"
          onConfirm={async () => { await deleteFile.mutateAsync(fileDeleteId); setFileDeleteId(null); }}
          onClose={() => setFileDeleteId(null)}
        />
      )}
      {itemDeleteId !== null && (
        <DeleteModal
          label="cost entry"
          onConfirm={async () => { await deleteItem.mutateAsync(itemDeleteId); setItemDeleteId(null); }}
          onClose={() => setItemDeleteId(null)}
        />
      )}
    </>
  );
}
