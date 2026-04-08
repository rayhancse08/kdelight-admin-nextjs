"use client";

import React, { useEffect, useState } from "react";
import { SaleFormData, SaleItemFormData } from "@/app/sales/page";
import { apiFetch } from "@/lib/apiFetch";

type ProductOption = { id: number; name: string; stocked_quantity: number };
type StoreOption = { id: number; name: string };

type Props = {
  formData: SaleFormData;
  setFormData: React.Dispatch<React.SetStateAction<SaleFormData>>;
  onSave: () => void;
  onClose: () => void;
};

const EMPTY_ITEM: SaleItemFormData = {
  product: "",
  product_name: "",
  quantity: "",
  price: "",
  packet_price: "",
  discount: "",
};

export default function SaleModal({
                                    formData,
                                    setFormData,
                                    onSave,
                                    onClose,
                                  }: Props) {
  const [stores, setStores] = useState<StoreOption[]>([]);
  const [productSearch, setProductSearch] = useState<string[]>([]);
  const [productOptions, setProductOptions] = useState<ProductOption[][]>([]);

  useEffect(() => {
    apiFetch("https://kdelight.info/api/stores/autocomplete/")
      .then(setStores)
      .catch(console.error);
  }, []);

  const updateField = (key: keyof SaleFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  /* ---- Item helpers ---- */
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      sale_items: [...prev.sale_items, { ...EMPTY_ITEM }],
    }));
    setProductSearch((prev) => [...prev, ""]);
    setProductOptions((prev) => [...prev, []]);
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sale_items: prev.sale_items.filter((_, i) => i !== index),
    }));
    setProductSearch((prev) => prev.filter((_, i) => i !== index));
    setProductOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    key: keyof SaleItemFormData,
    value: string
  ) => {
    setFormData((prev) => {
      const items = [...prev.sale_items];
      items[index] = { ...items[index], [key]: value };
      return { ...prev, sale_items: items };
    });
  };

  const searchProducts = async (index: number, q: string) => {
    setProductSearch((prev) => {
      const arr = [...prev];
      arr[index] = q;
      return arr;
    });
    if (!q) return;
    try {
      const results: ProductOption[] = await apiFetch(
        `https://kdelight.info/api/products/autocomplete/?q=${encodeURIComponent(q)}`
      );
      setProductOptions((prev) => {
        const arr = [...prev];
        arr[index] = results;
        return arr;
      });
    } catch (e) {
      console.error(e);
    }
  };

  const selectProduct = (index: number, product: ProductOption) => {
    updateItem(index, "product", String(product.id));
    updateItem(index, "product_name", product.name);
    setProductSearch((prev) => {
      const arr = [...prev];
      arr[index] = product.name;
      return arr;
    });
    setProductOptions((prev) => {
      const arr = [...prev];
      arr[index] = [];
      return arr;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start overflow-y-auto py-10 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-3xl mx-4">
        <h2 className="text-xl font-bold mb-6">Add Sale</h2>

        {/* ---- Sale Header Fields ---- */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Date</label>
            <input
              type="date"
              className="border p-2 w-full rounded"
              value={formData.date}
              onChange={(e) => updateField("date", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Delivery Date
            </label>
            <input
              type="date"
              className="border p-2 w-full rounded"
              value={formData.delivery_date}
              onChange={(e) => updateField("delivery_date", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Store</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.store}
              onChange={(e) => updateField("store", e.target.value)}
            >
              <option value="">Select store...</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Billing Company
            </label>
            <input
              placeholder="Billing Company"
              className="border p-2 w-full rounded"
              value={formData.billing_company}
              onChange={(e) => updateField("billing_company", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Status</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.status}
              onChange={(e) => updateField("status", e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="confirmed">Confirmed</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Shipping Charge
            </label>
            <input
              type="number"
              placeholder="0"
              className="border p-2 w-full rounded"
              value={formData.shipping_charge}
              onChange={(e) => updateField("shipping_charge", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Discount Type
            </label>
            <select
              className="border p-2 w-full rounded"
              value={formData.discount_type}
              onChange={(e) => updateField("discount_type", e.target.value)}
            >
              <option value="flat">Flat</option>
              <option value="percent">Percent</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Discount Amount
            </label>
            <input
              type="number"
              placeholder="0"
              className="border p-2 w-full rounded"
              value={formData.discount_amount}
              onChange={(e) => updateField("discount_amount", e.target.value)}
            />
          </div>
        </div>

        {/* ---- Sale Items ---- */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-700">Sale Items</h3>
            <button
              onClick={addItem}
              className="text-sm bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-lg"
            >
              + Add Item
            </button>
          </div>

          {formData.sale_items.length === 0 && (
            <p className="text-sm text-gray-400 py-4 text-center border rounded-lg">
              No items added yet. Click "+ Add Item".
            </p>
          )}

          <div className="space-y-3">
            {formData.sale_items.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 bg-gray-50 relative"
              >
                <button
                  onClick={() => removeItem(index)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs"
                >
                  ✕ Remove
                </button>

                {/* Product autocomplete */}
                <div className="mb-2 relative">
                  <label className="text-xs text-gray-500 mb-1 block">
                    Product
                  </label>
                  <input
                    placeholder="Search product..."
                    className="border p-2 w-full rounded bg-white"
                    value={productSearch[index] ?? ""}
                    onChange={(e) => searchProducts(index, e.target.value)}
                  />
                  {(productOptions[index] ?? []).length > 0 && (
                    <div className="absolute z-10 bg-white border rounded-lg shadow-lg w-full mt-1 max-h-40 overflow-y-auto">
                      {productOptions[index].map((p) => (
                        <div
                          key={p.id}
                          className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm flex justify-between"
                          onClick={() => selectProduct(index, p)}
                        >
                          <span>{p.name}</span>
                          <span className="text-gray-400 text-xs">
                            Stock: {p.stocked_quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Item numeric fields */}
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Qty
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      className="border p-2 w-full rounded bg-white text-sm"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Price
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      className="border p-2 w-full rounded bg-white text-sm"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(index, "price", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Pkt Price
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      className="border p-2 w-full rounded bg-white text-sm"
                      value={item.packet_price}
                      onChange={(e) =>
                        updateItem(index, "packet_price", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Discount
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      className="border p-2 w-full rounded bg-white text-sm"
                      value={item.discount}
                      onChange={(e) =>
                        updateItem(index, "discount", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            Save Sale
          </button>
        </div>
      </div>
    </div>
  );
}