// ── types/return_damage.ts ───────────────────────────────────────────────────

export type ReturnProduct = {
  id: number;
  date: string;
  product: number;
  product_name: string;
  lot_number: string | null;
  quantity: number;
  created: string;
  updated: string;
};

export type DamageProduct = {
  id: number;
  date: string;
  product: number;
  product_name: string;
  quantity: number;
  price: string | null;  // read-only, computed by Django save()
  created: string;
  updated: string;
};

export type ReturnProductFormData = {
  product: string;
  product_name: string;
  date: string;
  lot_number: string;
  quantity: string;
};

export type DamageProductFormData = {
  product: string;
  product_name: string;
  date: string;
  quantity: string;
};