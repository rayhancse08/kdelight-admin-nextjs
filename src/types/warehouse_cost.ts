export type CostTypeOption = { value: string; label: string };

export type WarehouseCostItem = {
  id: number;
  month: number;
  cost_type: string;
  cost_type_display: string;
  date: string | null;
  amount: string | null;
  notes: string | null;
  created: string;
  updated: string;
};

export type MonthlyWarehouseCost = {
  id: number;
  year: number;
  month: number;
  month_display: string;
  total_cost: string | null;
  item_count: number;
  created: string;
  updated: string;
};

export type MonthlyWarehouseCostDetail = MonthlyWarehouseCost & {
  warehouse_costs: WarehouseCostItem[];
};

export type WarehouseCostFormData = {
  cost_type: string;
  date: string;
  amount: string;
  notes: string;
};

export type MonthlyFileFormData = {
  year: string;
  month: string;
};

export const MONTHS = [
  { value: 1,  label: 'January'   },
  { value: 2,  label: 'February'  },
  { value: 3,  label: 'March'     },
  { value: 4,  label: 'April'     },
  { value: 5,  label: 'May'       },
  { value: 6,  label: 'June'      },
  { value: 7,  label: 'July'      },
  { value: 8,  label: 'August'    },
  { value: 9,  label: 'September' },
  { value: 10, label: 'October'   },
  { value: 11, label: 'November'  },
  { value: 12, label: 'December'  },
];