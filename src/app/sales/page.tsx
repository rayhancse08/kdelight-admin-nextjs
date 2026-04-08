"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SaleTable from "@/components/Sales/SaleTable";
import SaleModal from "@/components/Sales/SaleModal";
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";

export type Sale = {
  id: number;
  date: string;
  delivery_date: string;
  status: string;
  store_name: string;
  sub_total: string;
  discount: string;
  total: string;
  payment: string;
  payment_due: string;
};

export type SaleFormData = {
  date: string;
  delivery_date: string;
  billing_company: string;
  store: string;
  status: string;
  shipping_charge: string;
  discount_type: string;
  discount_amount: string;
  sale_items: SaleItemFormData[];
};

export type SaleItemFormData = {
  product: string;
  product_name?: string;
  quantity: string;
  price: string;
  packet_price: string;
  discount: string;
};

const EMPTY_FORM: SaleFormData = {
  date: "",
  delivery_date: "",
  billing_company: "",
  store: "",
  status: "draft",
  shipping_charge: "",
  discount_type: "flat",
  discount_amount: "",
  sale_items: [],
};

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<SaleFormData>(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadSales = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const data = await apiFetch(
        `https://kdelight.info/api/sales/?${params.toString()}`
      );
      setSales(data.results ?? data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadSales();
  }, [search, statusFilter]);

  const handleCreate = async () => {
    try {
      await apiFetch("https://kdelight.info/api/sales/", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setIsModalOpen(false);
      setFormData(EMPTY_FORM);
      loadSales();
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Sales" />

      {/* Toolbar */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div className="flex gap-3">
          <input
            placeholder="Search by store or order no..."
            className="border px-3 py-2 rounded-lg text-sm w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border px-3 py-2 rounded-lg text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="confirmed">Confirmed</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm"
        >
          + Add Sale
        </button>
      </div>

      <SaleTable sales={sales} onRefresh={loadSales} />

      {isModalOpen && (
        <SaleModal
          formData={formData}
          setFormData={setFormData}
          onSave={handleCreate}
          onClose={() => {
            setIsModalOpen(false);
            setFormData(EMPTY_FORM);
          }}
        />
      )}
    </>
  );
}