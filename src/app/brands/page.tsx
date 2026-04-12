"use client";

import React, { useEffect, useState, useCallback } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { apiFetch } from "@/lib/apiFetch";
import { Brand, BrandFormData } from "@/types/brand";

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

const EMPTY_FORM: BrandFormData = { name: "" };

export default function BrandPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Brand | null>(null);
  const [formData, setFormData] = useState<BrandFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadBrands = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));
    try {
      const data = await apiFetch(`${BASE}/brands/?${params}`);
      setBrands(data.results ?? data);
      setTotal(data.count ?? data.length);
    } catch (e) {
      console.error(e);
    }
  }, [search, page]);

  useEffect(() => { loadBrands(); }, [loadBrands]);

  const openCreate = () => {
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (brand: Brand) => {
    setEditTarget(brand);
    setFormData({ name: brand.name });
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError("Brand name is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editTarget) {
        await apiFetch(`${BASE}/brands/${editTarget.id}/`, {
          method: "PATCH",
          body: JSON.stringify(formData),
        });
      } else {
        await apiFetch(`${BASE}/brands/`, {
          method: "POST",
          body: JSON.stringify(formData),
        });
      }
      setModalOpen(false);
      loadBrands();
    } catch (err: any) {
      setError(err.message ?? "Failed to save brand");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`${BASE}/brands/${id}/`, { method: "DELETE" });
      setDeleteId(null);
      loadBrands();
    } catch (e) {
      console.error(e);
    }
  };

  const pageSize = 25;
  const pages = Math.ceil(total / pageSize);

  // Group brands alphabetically for display
  const grouped = brands.reduce<Record<string, Brand[]>>((acc, b) => {
    const letter = b.name[0]?.toUpperCase() ?? "#";
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(b);
    return acc;
  }, {});

  return (
    <>
      <Breadcrumb pageName="Brands" />

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        <input
          className="border px-3 py-2 rounded-lg text-sm w-64 outline-none focus:border-blue-400"
          placeholder="Search brands..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <button
          onClick={openCreate}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Add Brand
        </button>
      </div>

      {/* Alphabetical grid view */}
      {!search && brands.length > 0 ? (
        <div className="space-y-6">
          {Object.keys(grouped).sort().map((letter) => (
            <div key={letter}>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {letter}
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {grouped[letter].map((b) => (
                  <div
                    key={b.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-sm transition-shadow group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                        {b.name[0]}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(b)}
                          className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-xs hover:bg-blue-100"
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => setDeleteId(b.id)}
                          className="w-6 h-6 rounded-md bg-red-50 text-red-500 flex items-center justify-center text-xs hover:bg-red-100"
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm leading-tight">{b.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(b.created).toLocaleDateString("en-BD")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Fallback table view when searching */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <span className="font-semibold text-gray-800">Brands</span>
            <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full">
              {total} total
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-400 text-xs uppercase border-b border-gray-100">
              <tr>
                {["Name", "Created", "Updated", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold tracking-wide">{h}</th>
                ))}
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
              {brands.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-gray-400">No brands found</td>
                </tr>
              )}
              {brands.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                        {b.name[0]}
                      </div>
                      {b.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(b.created).toLocaleDateString("en-BD")}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(b.updated).toLocaleDateString("en-BD")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(b)}
                        className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md font-medium hover:bg-blue-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(b.id)}
                        className="text-xs text-red-500 bg-red-50 px-2.5 py-1 rounded-md font-medium hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
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
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                      n === page ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="px-7 pt-6 pb-5 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editTarget ? "Edit Brand" : "New Brand"}
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  {editTarget ? `Editing ${editTarget.name}` : "Enter the brand name"}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50"
              >
                ✕
              </button>
            </div>

            <div className="px-7 py-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                Brand Name
              </label>
              <input
                placeholder="e.g. Nestle, Unilever..."
                className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                autoFocus
              />
            </div>

            <div className="px-7 pb-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg disabled:opacity-60 hover:bg-blue-700"
              >
                {saving ? "Saving..." : editTarget ? "Update Brand" : "Save Brand"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-7">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Delete Brand?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This will soft-delete the brand. Products linked to it will be unaffected.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
