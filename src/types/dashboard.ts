// ── types/dashboard.ts ──────────────────────────────────────────────────────

export type DashboardKPIs = {
  today_revenue:         number;
  monthly_revenue:       number;
  monthly_profit:        number;
  monthly_paid:          number;
  revenue_growth_pct:    number;
  total_sale_due:        number;
  monthly_purchase_cost: number;
  purchase_due:          number;
  monthly_wh_cost:       number;
  monthly_returns:       number;
  monthly_damage_value:  number;
};

export type DashboardInventory = {
  total_products:    number;
  out_of_stock:      number;
  low_stock:         number;
  total_stock_value: number;
};

export type MonthlyPlanSummary = {
  has_plan:        boolean;
  sales_target:    number;
  sales_achieve:   number;
  achievement_pct: number;
  budget:          number;
  spent:           number;
  budget_pct:      number;
};

export type RevenueChartPoint = {
  month:   number;
  year:    number;
  revenue: number;
  cost:    number;
  profit:  number;
};

export type TopProduct = {
  product_name:  string;
  total_qty:     number;
  total_revenue: number;
};

export type RecentSale = {
  id:          number;
  order_no:    string;
  date:        string;
  status:      string;
  store_name:  string;
  total:       number;
  payment_due: number;
};

export type DashboardData = {
  meta: { today: string; this_month: number; this_year: number };
  kpis: DashboardKPIs;
  inventory: DashboardInventory;
  monthly_plan: MonthlyPlanSummary;
  revenue_chart: RevenueChartPoint[];
  top_products: TopProduct[];
  sale_status_breakdown: Record<string, number>;
  recent_sales: RecentSale[];
};