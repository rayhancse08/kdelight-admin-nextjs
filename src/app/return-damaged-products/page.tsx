"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {
  ReturnProduct, DamageProduct,
  ReturnProductFormData, DamageProductFormData,
} from "@/types/returnDamage";
import {
  useReturnProducts, useDamageProducts,
  useCreateReturn, useUpdateReturn, useDeleteReturn,
  useCreateDamage, useUpdateDamage, useDeleteDamage,
} from "@/hooks/useReturnDamagedProduct";
import { apiFetch } from "@/lib/apiFetch";

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;
const fmt = (v: string | null | undefined) =>
  v ? "৳" + parseFloat(v).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "৳0.00";

type ProductOption = { id: number; name: string; stocked_quantity: number };

// ── Shared product autocomplete input ────────────────────────────────────────
function ProductAutocomplete({
                               value, onChange, onSelect, accentClass,
                             }: {
  value: string;
  onChange: (q: string) => void;
  onSelect: (p: ProductOption) => void;
  accentClass: string;
}) {
  const [options, setOptions] = useState<ProductOption[]>([]);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = (q: string) => {
    onChange(q);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      if (!q) return setOptions([]);
      const res = await apiFetch(`${BASE}/products/autocomplete/?q=${encodeURIComponent(q)}`);
      setOptions(res);
    }, 300);
  };

  return (
    <div className="relative">
      <input
        placeholder="Search product..."
        className={`border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none ${accentClass}`}
        value={value}
        onChange={(e) => search(e.target.value)}
      />
      {options.length > 0 && (
        <div className="absolute z-10 bg-white border border-gray-200 rounded-xl shadow-lg w-full mt-1 overflow-hidden">
          {options.map((p) => (
            <div
              key={p.id}
              className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm flex justify-between items-center"
              onClick={() => { onSelect(p); setOptions([]); }}
            >
              <span className="font-medium text-gray-800">{p.name}</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                Stock: {p.stocked_quantity}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Delete confirm ────────────────────────────────────────────────────────────
function DeleteModal({ label, onConfirm, onClose }: { label: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-7">
        <h3 className="text-base font-semibold text-gray-900 mb-2">Delete {label}?</h3>
        <p className="text-sm text-gray-500 mb-6">This soft-deletes the record. Stock adjustments will be reversed.</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
export default function ReturnDamagePage() {
  const [tab, setTab] = useState<"returns" | "damage">("returns");

  // ── Shared filters ────────────────────────────────────────────────────────
  const [returnSearch, setReturnSearch]   = useState("");
  const [returnPage,   setReturnPage]     = useState(1);
  const [damageSearch, setDamageSearch]   = useState("");
  const [damagePage,   setDamagePage]     = useState(1);
  const PAGE_SIZE = 25;

  // ── React Query ───────────────────────────────────────────────────────────
  const { data: returnsData, isLoading: returnsLoading } = useReturnProducts({
    ...(returnSearch ? { search: returnSearch } : {}),
    page: String(returnPage),
  });
  const { data: damagesData, isLoading: damagesLoading } = useDamageProducts({
    ...(damageSearch ? { search: damageSearch } : {}),
    page: String(damagePage),
  });

  const createReturn = useCreateReturn();
  const updateReturn = useUpdateReturn();
  const deleteReturn = useDeleteReturn();
  const createDamage = useCreateDamage();
  const updateDamage = useUpdateDamage();
  const deleteDamage = useDeleteDamage();

  const returns  = returnsData?.results ?? [];
  const damages  = damagesData?.results ?? [];
  const returnTotal = returnsData?.count ?? 0;
  const damageTotal = damagesData?.count ?? 0;
  const returnPages = Math.ceil(returnTotal / PAGE_SIZE);
  const damagePages = Math.ceil(damageTotal / PAGE_SIZE);

  // ── Return modal state ────────────────────────────────────────────────────
  const [returnModal,      setReturnModal]      = useState(false);
  const [returnEditTarget, setReturnEditTarget] = useState<ReturnProduct | null>(null);
  const [returnForm,       setReturnForm]       = useState<ReturnProductFormData>({
    product: "", product_name: "", date: "", lot_number: "", quantity: "",
  });
  const [returnDeleteId, setReturnDeleteId] = useState<number | null>(null);

  // ── Damage modal state ────────────────────────────────────────────────────
  const [damageModal,      setDamageModal]      = useState(false);
  const [damageEditTarget, setDamageEditTarget] = useState<DamageProduct | null>(null);
  const [damageForm,       setDamageForm]       = useState<DamageProductFormData>({
    product: "", product_name: "", date: "", quantity: "",
  });
  const [damageDeleteId, setDamageDeleteId] = useState<number | null>(null);

  // ── Return handlers ───────────────────────────────────────────────────────
  const openCreateReturn = () => {
    setReturnEditTarget(null);
    setReturnForm({ product: "", product_name: "", date: new Date().toISOString().slice(0, 10), lot_number: "", quantity: "" });
    setReturnModal(true);
  };
  const openEditReturn = (r: ReturnProduct) => {
    setReturnEditTarget(r);
    setReturnForm({ product: String(r.product), product_name: r.product_name, date: r.date, lot_number: r.lot_number ?? "", quantity: String(r.quantity) });
    setReturnModal(true);
  };
  const handleSaveReturn = async () => {
    if (returnEditTarget) {
      await updateReturn.mutateAsync({ id: returnEditTarget.id, data: returnForm });
    } else {
      await createReturn.mutateAsync(returnForm);
    }
    setReturnModal(false);
  };

  // ── Damage handlers ───────────────────────────────────────────────────────
  const openCreateDamage = () => {
    setDamageEditTarget(null);
    setDamageForm({ product: "", product_name: "", date: new Date().toISOString().slice(0, 10), quantity: "" });
    setDamageModal(true);
  };
  const openEditDamage = (d: DamageProduct) => {
    setDamageEditTarget(d);
    setDamageForm({ product: String(d.product), product_name: d.product_name, date: d.date, quantity: String(d.quantity) });
    setDamageModal(true);
  };
  const handleSaveDamage = async () => {
    if (damageEditTarget) {
      await updateDamage.mutateAsync({ id: damageEditTarget.id, data: damageForm });
    } else {
      await createDamage.mutateAsync(damageForm);
    }
    setDamageModal(false);
  };

  // ── Pagination helper ─────────────────────────────────────────────────────
  const Pagination = ({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) =>
    pages > 1 ? (
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">Page {page} of {pages}</span>
        <div className="flex gap-1">
          {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => onChange(n)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${n === page ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <>
      <Breadcrumb pageName="Returns & Damage" />

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-400" />
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Total Returns</p>
          <p className="text-2xl font-semibold text-amber-600">{returnTotal.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-0.5">records</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-400" />
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Total Damage Records</p>
          <p className="text-2xl font-semibold text-red-600">{damageTotal.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Loss: {fmt(String(damages.reduce((a, d) => a + parseFloat(d.price || "0"), 0)))}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
        {([
          { key: "returns", label: "Returns",       count: returnTotal },
          { key: "damage",  label: "Damage",        count: damageTotal },
        ] as const).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-1.5 rounded-md text-sm font-medium transition-all ${tab === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {label}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${tab === key ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-500"}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* ══════════════ RETURNS TAB ══════════════ */}
      {tab === "returns" && (
        <>
          <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
            <input
              className="border px-3 py-2 rounded-lg text-sm w-64 outline-none focus:border-amber-400"
              placeholder="Search product, lot..."
              value={returnSearch}
              onChange={(e) => { setReturnSearch(e.target.value); setReturnPage(1); }}
            />
            <button
              onClick={openCreateReturn}
              className="bg-amber-500 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-amber-600"
            >
              <span className="text-lg leading-none">+</span> Add Return
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <span className="font-semibold text-gray-800">Return Products</span>
              <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full">{returnTotal} records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-400 text-xs uppercase border-b border-gray-100">
                <tr>
                  {["Product", "Lot Number", "Date", "Qty (Packets)", ""].map((h) => (
                    <th key={h} className={`px-4 py-3 font-semibold tracking-wide ${h === "Qty (Packets)" ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                {returnsLoading && <tr><td colSpan={5} className="text-center py-12 text-gray-400">Loading...</td></tr>}
                {!returnsLoading && returns.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-16 text-gray-400">No return records found</td></tr>
                )}
                {returns.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {r.product_name[0]}
                        </div>
                        <span className="font-medium text-gray-800 text-sm">{r.product_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {r.lot_number
                        ? <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{r.lot_number}</span>
                        : <span className="text-gray-400 text-xs">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{r.date}</td>
                    <td className="px-4 py-3 text-right">
                        <span className="bg-amber-50 text-amber-700 text-sm font-semibold px-2.5 py-1 rounded-lg">
                          {r.quantity} pcs
                        </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditReturn(r)} className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md hover:bg-amber-100 font-medium">Edit</button>
                        <button onClick={() => setReturnDeleteId(r.id)} className="text-xs text-red-500 bg-red-50 px-2.5 py-1 rounded-md hover:bg-red-100 font-medium">Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
            <Pagination page={returnPage} pages={returnPages} onChange={setReturnPage} />
          </div>
        </>
      )}

      {/* ══════════════ DAMAGE TAB ══════════════ */}
      {tab === "damage" && (
        <>
          <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
            <input
              className="border px-3 py-2 rounded-lg text-sm w-64 outline-none focus:border-red-400"
              placeholder="Search product..."
              value={damageSearch}
              onChange={(e) => { setDamageSearch(e.target.value); setDamagePage(1); }}
            />
            <button
              onClick={openCreateDamage}
              className="bg-red-500 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-red-600"
            >
              <span className="text-lg leading-none">+</span> Record Damage
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <span className="font-semibold text-gray-800">Damage Products</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full">{damageTotal} records</span>
                <span className="text-xs font-mono text-red-600 font-semibold">
                  Total Loss: {fmt(String(damages.reduce((a, d) => a + parseFloat(d.price || "0"), 0)))}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-400 text-xs uppercase border-b border-gray-100">
                <tr>
                  {["Product", "Date", "Qty (Packets)", "Loss Value", ""].map((h) => (
                    <th key={h} className={`px-4 py-3 font-semibold tracking-wide ${["Qty (Packets)", "Loss Value"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                {damagesLoading && <tr><td colSpan={5} className="text-center py-12 text-gray-400">Loading...</td></tr>}
                {!damagesLoading && damages.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-16 text-gray-400">No damage records found</td></tr>
                )}
                {damages.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {d.product_name[0]}
                        </div>
                        <span className="font-medium text-gray-800 text-sm">{d.product_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{d.date}</td>
                    <td className="px-4 py-3 text-right">
                        <span className="bg-red-50 text-red-600 text-sm font-semibold px-2.5 py-1 rounded-lg">
                          {d.quantity} pcs
                        </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-red-600">
                      {fmt(d.price)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditDamage(d)} className="text-xs text-red-600 bg-red-50 px-2.5 py-1 rounded-md hover:bg-red-100 font-medium">Edit</button>
                        <button onClick={() => setDamageDeleteId(d.id)} className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md hover:bg-gray-100 font-medium">Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
            <Pagination page={damagePage} pages={damagePages} onChange={setDamagePage} />
          </div>
        </>
      )}

      {/* ══════════════ RETURN MODAL ══════════════ */}
      {returnModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-7 pt-6 pb-5 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {returnEditTarget ? "Edit Return" : "Add Return"}
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">Record a product return from a store</p>
              </div>
              <button onClick={() => setReturnModal(false)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">✕</button>
            </div>

            <div className="px-7 py-6 space-y-4">
              {(createReturn.isError || updateReturn.isError) && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {((createReturn.error || updateReturn.error) as any)?.message ?? "Failed to save"}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Product</label>
                <ProductAutocomplete
                  value={returnForm.product_name}
                  onChange={(q) => setReturnForm((p) => ({ ...p, product_name: q }))}
                  onSelect={(prod) => setReturnForm((p) => ({ ...p, product: String(prod.id), product_name: prod.name }))}
                  accentClass="focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Date</label>
                  <input
                    type="date"
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-amber-400"
                    value={returnForm.date}
                    onChange={(e) => setReturnForm((p) => ({ ...p, date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Lot Number</label>
                  <input
                    placeholder="Optional"
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-amber-400"
                    value={returnForm.lot_number}
                    onChange={(e) => setReturnForm((p) => ({ ...p, lot_number: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                  Quantity <span className="text-gray-400 normal-case font-normal">(number of packets)</span>
                </label>
                <input
                  type="number" placeholder="0" min="1"
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-amber-400"
                  value={returnForm.quantity}
                  onChange={(e) => setReturnForm((p) => ({ ...p, quantity: e.target.value }))}
                />
              </div>
            </div>

            <div className="px-7 pb-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setReturnModal(false)} className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleSaveReturn}
                disabled={createReturn.isPending || updateReturn.isPending}
                className="px-6 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg disabled:opacity-60 hover:bg-amber-600"
              >
                {createReturn.isPending || updateReturn.isPending ? "Saving..." : returnEditTarget ? "Update" : "Save Return"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ DAMAGE MODAL ══════════════ */}
      {damageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-7 pt-6 pb-5 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {damageEditTarget ? "Edit Damage Record" : "Record Damage"}
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">Loss value calculated automatically from purchase price</p>
              </div>
              <button onClick={() => setDamageModal(false)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">✕</button>
            </div>

            <div className="px-7 py-6 space-y-4">
              {(createDamage.isError || updateDamage.isError) && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {((createDamage.error || updateDamage.error) as any)?.message ?? "Failed to save"}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Product</label>
                <ProductAutocomplete
                  value={damageForm.product_name}
                  onChange={(q) => setDamageForm((p) => ({ ...p, product_name: q }))}
                  onSelect={(prod) => setDamageForm((p) => ({ ...p, product: String(prod.id), product_name: prod.name }))}
                  accentClass="focus:border-red-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Date</label>
                <input
                  type="date"
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-red-400"
                  value={damageForm.date}
                  onChange={(e) => setDamageForm((p) => ({ ...p, date: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                  Quantity <span className="text-gray-400 normal-case font-normal">(number of packets)</span>
                </label>
                <input
                  type="number" placeholder="0" min="1"
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-red-400"
                  value={damageForm.quantity}
                  onChange={(e) => setDamageForm((p) => ({ ...p, quantity: e.target.value }))}
                />
              </div>

              <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-xs text-red-700">
                Loss value = <strong>product.purchase_price × quantity</strong> — computed automatically by Django on save
              </div>
            </div>

            <div className="px-7 pb-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setDamageModal(false)} className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleSaveDamage}
                disabled={createDamage.isPending || updateDamage.isPending}
                className="px-6 py-2 bg-red-500 text-white text-sm font-medium rounded-lg disabled:opacity-60 hover:bg-red-600"
              >
                {createDamage.isPending || updateDamage.isPending ? "Saving..." : damageEditTarget ? "Update" : "Record Damage"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ DELETE CONFIRMS ══════════════ */}
      {returnDeleteId !== null && (
        <DeleteModal
          label="return record"
          onConfirm={async () => { await deleteReturn.mutateAsync(returnDeleteId); setReturnDeleteId(null); }}
          onClose={() => setReturnDeleteId(null)}
        />
      )}
      {damageDeleteId !== null && (
        <DeleteModal
          label="damage record"
          onConfirm={async () => { await deleteDamage.mutateAsync(damageDeleteId); setDamageDeleteId(null); }}
          onClose={() => setDamageDeleteId(null)}
        />
      )}
    </>
  );
}
