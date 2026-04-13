export type MonthlyReport = {
  id: number;
  year: number;
  month: number;
  month_display: string;
  purchase: string | null;
  warehouse_cost: string | null;
  sale: string | null;
  damage_product: string | null;
  profit: string | null;
  sale_paid_payment: string | null;
  sale_due_payment: string | null;
  purchase_paid_payment: string | null;
  purchase_due_payment: string | null;
  created: string;
  updated: string;
};

export type YearlyReport = {
  id: number;
  year: number;
  purchase_amount: string | null;
  warehouse_cost_amount: string | null;
  sale_amount: string | null;
  payment_send_amount: string | null;
  payment_receive_amount: string | null;
  created: string;
  updated: string;
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