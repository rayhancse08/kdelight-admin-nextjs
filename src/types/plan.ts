export type MonthlyPlan = {
  id: number;
  year: number;
  month: number;
  month_display: string;
  sales_target: string | null;
  sales_achieve: string | null;   // read-only — computed from Sales
  achievement_pct: number;        // computed by serializer
  budget: string | null;
  spent: string | null;           // read-only — computed from WarehouseCost
  budget_used_pct: number;        // computed by serializer
  created: string;
  updated: string;
};

export type YearlyPlan = {
  id: number;
  year: number;
  sales_target: string | null;
  sales_achieve: string | null;
  achievement_pct: number;
  budget: string | null;
  spent: string | null;
  budget_used_pct: number;
  created: string;
  updated: string;
};

export type MonthlyPlanFormData = {
  year: string;
  month: string;
  sales_target: string;
  budget: string;
};

export type YearlyPlanFormData = {
  year: string;
  sales_target: string;
  budget: string;
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