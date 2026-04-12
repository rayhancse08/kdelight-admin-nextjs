export type DiscountType = 'percentage' | 'flat';

export type Store = {
  id: number;
  name: string;
  city: string | null;
  phone_number: string;
  email: string;
  address: string;
  discount_type: DiscountType;
  discount: string | null;
  tax_id: string | null;
  created: string;
  updated: string;
};

export type StoreFormData = {
  name: string;
  city: string;
  phone_number: string;
  email: string;
  address: string;
  discount_type: DiscountType;
  discount: string;
  tax_id: string;
};

