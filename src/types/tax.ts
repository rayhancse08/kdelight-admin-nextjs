export type TaxCategory = {
  id: number;
  name: string;
  created: string;
  updated: string;
};

export type TaxCompany = {
  id: number;
  name: string;
  created: string;
  updated: string;
};

export type TaxItem = {
  id: number;
  month: number;
  tax_category: number;
  tax_category_name: string;
  date: string | null;
  amount: string | null;
  notes: string | null;
  created: string;
  updated: string;
};

export type MonthlyTaxFile = {
  id: number;
  year: number;
  month: number;
  month_display: string;
  company_name: number | null;
  company_name_str: string | null;
  total_amount: string;
  item_count: number;
  created: string;
  updated: string;
};

export type MonthlyTaxFileDetail = MonthlyTaxFile & {
  warehouse_costs: TaxItem[];
};

export type TaxItemFormData = {
  tax_category: string;
  date: string;
  amount: string;
  notes: string;
};

export type MonthlyTaxFileFormData = {
  year: string;
  month: string;
  company_name: string;
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