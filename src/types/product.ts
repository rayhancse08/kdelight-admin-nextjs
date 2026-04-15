export type UnitChoice = 'gm' | 'kg' | 'lb' | 'ounce' | 'pcs' | 'pound' | 'box' | 'ml';
export type DiscountType = 'percentage' | 'flat';

export const UNIT_OPTIONS: UnitChoice[] = ['gm', 'kg', 'lb', 'ounce', 'pcs', 'pound', 'box', 'ml'];

export type ProductCategory = {
  id: number;
  name: string;
  image: string | null;
  is_featured: boolean;
  slug: string | null;
  product_count?: number;
};

export type Product = {
  id: number;
  name: string | null;
  slug: string | null;
  image: string | null;
  thumbnail: string | null;
  brand: number | null;
  brand_name: string | null;
  category: number | null;
  category_name: string | null;
  packet_per_carton: number | null;
  weight: number;
  unit: UnitChoice;
  stocked_quantity: number | null;
  stocked_packet_quantity: number | null;
  purchase_price: string | null;
  sale_price: string | null;
  packet_price: string | null;
  discount_type: DiscountType;
  discount: string | null;
  discount_price: number | null;
};

export type ProductDetail = Product & {
  description: string | null;
  manual_entry: boolean;
  created: string;
  updated: string;
};

export type ProductFormData = {
  brand: string;
  name: string;
  description: string;
  category: string;
  packet_per_carton: string;
  weight: string;
  unit: UnitChoice;
  discount_type: DiscountType;
  discount: string;
  manual_entry: boolean;
  image: File | null;
};

export type ProductCategoryFormData = {
  name: string;
  is_featured: boolean;
  image: File | null;
};