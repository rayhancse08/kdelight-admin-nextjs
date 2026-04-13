export type WarehouseItem = {
  id: number;
  product: number;
  product_name: string;
  packet_per_carton: number;
  lot_number: string | null;
  sale_price: string | null;
  purchased_price: string | null;
  stocked_quantity: number | null;
  damaged_quantity: number | null;
  sale_quantity: number | null;
  sale_packet_quantity: number | null;
  remaining_quantity: number | null;
  remaining_packet_quantity: number | null;
  return_quantity: number | null;
};

export type WarehouseItemDetail = WarehouseItem & {
  product_price: string | null;
  carton_handling_cost: string | null;
  profit_percentage: string | null;
  manual_remaining_quantity: number | null;
  total_purchased_price: string | null;
  expected_total_sale_price: string | null;
  total_sale_price: string | null;
  created: string;
  updated: string;
};

export type WarehouseItemFormData = {
  product: string;
  lot_number: string;
  product_price: string;
  carton_handling_cost: string;
  purchased_price: string;
  profit_percentage: string;
  stocked_quantity: string;
  damaged_quantity: string;
  manual_remaining_quantity: string;
};