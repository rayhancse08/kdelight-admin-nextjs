"use client";

import React, { useState } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { RevenueChartPoint, TopProduct, RecentSale } from "@/types/dashboard";

const fmt = (v: number) =>
  "$" + v.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtK = (v: number) =>
  v >= 1_000_000
    ? "$" + (v / 1_000_000).toFixed(1) + "M"
    : v >= 1_000
      ? "$" + (v / 1_000).toFixed(1) + "K"
      : fmt(v);

const MONTH_SHORT = ["", "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const STATUS_STYLE: Record<string, string> = {
  confirmed:  "bg-blue-50 text-blue-700",
  packing:    "bg-purple-50 text-purple-700",
  delivering: "bg-amber-50 text-amber-700",
  delivered:  "bg-green-50 text-green-700",
  cancelled:  "bg-red-50 text-red-600",
};

// ── Inline SVG bar chart ──────────────────────────────────────────────────────
function BarChart({ data }: { data: RevenueChartPoint[] }) {
  const maxVal = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="flex items-end gap-1.5 h-36 w-full">
      {data.map((d, i) => {
        const revH  = Math.max((d.revenue / maxVal) * 100, 2);
        const profH = Math.max((Math.max(d.profit, 0) / maxVal) * 100, 0);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
            {/* Tooltip */}
            <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
              <div className="bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                <p className="font-medium">{MONTH_SHORT[d.month]} {d.year}</p>
                <p className="text-green-400">Rev: {fmtK(d.revenue)}</p>
                <p className="text-blue-300">Profit: {fmtK(d.profit)}</p>
                <p className="text-red-300">Cost: {fmtK(d.cost)}</p>
              </div>
              <div className="border-4 border-transparent border-t-gray-900" />
            </div>
            {/* Bars */}
            <div className="w-full flex gap-0.5 items-end" style={{ height: "128px" }}>
              <div
                className="flex-1 bg-blue-400 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${revH}%` }}
              />
              <div
                className="flex-1 bg-emerald-400 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${profH}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 leading-none">{MONTH_SHORT[d.month]}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Donut chart ───────────────────────────────────────────────────────────────
function DonutChart({ data }: { data: Record<string, number> }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const colors: Record<string, string> = {
    confirmed: "#3b82f6", packing: "#8b5cf6",
    delivering: "#f59e0b", delivered: "#10b981", cancelled: "#ef4444",
  };
  let offset = 0;
  const R = 36, cx = 44, cy = 44, stroke = 14;
  const circ = 2 * Math.PI * R;
  const slices = Object.entries(data).map(([status, cnt]) => {
    const pct = total > 0 ? cnt / total : 0;
    const dash = pct * circ;
    const s = { status, cnt, pct, dash, offset: offset * circ };
    offset += pct;
    return s;
  });
  return (
    <div className="flex items-center gap-6">
      <svg width="88" height="88" className="flex-shrink-0">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
        {slices.map(({ status, dash, offset: off }) => (
          <circle
            key={status}
            cx={cx} cy={cy} r={R}
            fill="none"
            stroke={colors[status] ?? "#94a3b8"}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-off + circ / 4}
            className="transition-all duration-500"
          />
        ))}
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="600" fill="#1e293b">{total}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#94a3b8">orders</text>
      </svg>
      <div className="space-y-1.5">
        {slices.map(({ status, cnt, pct }) => (
          <div key={status} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: colors[status] ?? "#94a3b8" }} />
            <span className="text-gray-600 capitalize w-20">{status}</span>
            <span className="font-semibold text-gray-800">{cnt}</span>
            <span className="text-gray-400">({(pct * 100).toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function PlanProgress({ label, pct, color, value, target }: { label: string; pct: number; color: string; value: number; target: number }) {
  const over = pct > 100;
  const clamped = Math.min(pct, 100);
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <div className="text-right">
          <span className={`text-xs font-bold ${over ? "text-red-600" : "text-gray-800"}`}>{pct.toFixed(1)}%</span>
          <span className="text-xs text-gray-400 ml-1">{fmtK(value)} / {fmtK(target)}</span>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full transition-all duration-700 ${over ? "bg-red-400" : color}`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

// ── Top products mini bar ─────────────────────────────────────────────────────
function TopProductsChart({ data }: { data: TopProduct[] }) {
  const max = Math.max(...data.map((d) => d.total_qty), 1);
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-700 font-medium truncate max-w-[60%]">{d.product_name}</span>
            <span className="text-gray-500 font-mono">{d.total_qty} ctn · {fmtK(d.total_revenue)}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-indigo-400 h-2 rounded-full transition-all duration-700"
              style={{ width: `${(d.total_qty / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const { data, isLoading, dataUpdatedAt, refetch, isFetching } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { kpis, inventory, monthly_plan: plan, revenue_chart, top_products, sale_status_breakdown, recent_sales, meta } = data;

  const growthPositive = kpis.revenue_growth_pct >= 0;

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {MONTH_SHORT[meta.this_month]} {meta.this_year} · Today: {meta.today}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <span className={isFetching ? "animate-spin" : ""}>↻</span>
          {isFetching ? "Refreshing..." : `Updated ${new Date(dataUpdatedAt).toLocaleTimeString("en-BD")}`}
        </button>
      </div>

      {/* ── Today + Growth strip ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Today's Revenue",
            value: fmtK(kpis.today_revenue),
            sub: "sales confirmed today",
            accent: "bg-blue-500",
            textColor: "text-blue-700",
          },
          {
            label: "Monthly Revenue",
            value: fmtK(kpis.monthly_revenue),
            sub: (
              <span className={`flex items-center gap-1 ${growthPositive ? "text-green-600" : "text-red-500"}`}>
                {growthPositive ? "↑" : "↓"} {Math.abs(kpis.revenue_growth_pct)}% vs last month
              </span>
            ),
            accent: "bg-emerald-500",
            textColor: "text-emerald-700",
          },
          {
            label: "Monthly Profit",
            value: fmtK(kpis.monthly_profit),
            sub: `After ৳${(kpis.monthly_wh_cost / 1000).toFixed(1)}K costs`,
            accent: "bg-indigo-500",
            textColor: "text-indigo-700",
          },
          {
            label: "Total Sale Due",
            value: fmtK(kpis.total_sale_due),
            sub: `Purchase due: ${fmtK(kpis.purchase_due)}`,
            accent: "bg-orange-400",
            textColor: "text-orange-600",
          },
        ].map(({ label, value, sub, accent, textColor }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-0.5 ${accent}`} />
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">{label}</p>
            <p className={`text-2xl font-bold ${textColor} font-mono leading-tight`}>{value}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Secondary KPIs ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Monthly Purchase",  value: fmtK(kpis.monthly_purchase_cost), color: "text-gray-800"  },
          { label: "Warehouse Costs",   value: fmtK(kpis.monthly_wh_cost),       color: "text-amber-700" },
          { label: "Returns (packets)", value: kpis.monthly_returns.toString(),   color: "text-amber-600" },
          { label: "Damage Value",      value: fmtK(kpis.monthly_damage_value),  color: "text-red-600"   },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 px-5 py-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">{label}</p>
            <p className={`text-xl font-semibold ${color} font-mono`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Middle row: chart + plan + inventory ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Revenue chart — 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Revenue vs Profit</h3>
              <p className="text-xs text-gray-400">Last 12 months</p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-3 h-2 rounded-sm bg-blue-400" /><span>Revenue</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-3 h-2 rounded-sm bg-emerald-400" /><span>Profit</span>
              </div>
            </div>
          </div>
          <BarChart data={revenue_chart} />
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Inventory</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: "Total Products", value: inventory.total_products, color: "text-gray-800"  },
              { label: "Out of Stock",   value: inventory.out_of_stock,   color: "text-red-600"   },
              { label: "Low Stock",      value: inventory.low_stock,       color: "text-orange-500"},
              { label: "Stock Value",    value: fmtK(inventory.total_stock_value), color: "text-indigo-700" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-100">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className={`text-lg font-semibold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
          {/* Stock health bar */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Stock Health</p>
            <div className="w-full h-2.5 rounded-full overflow-hidden flex">
              {inventory.total_products > 0 && (
                <>
                  <div className="bg-green-400 h-full" style={{ width: `${((inventory.total_products - inventory.low_stock - inventory.out_of_stock) / inventory.total_products) * 100}%` }} />
                  <div className="bg-orange-400 h-full" style={{ width: `${(inventory.low_stock / inventory.total_products) * 100}%` }} />
                  <div className="bg-red-400 h-full" style={{ width: `${(inventory.out_of_stock / inventory.total_products) * 100}%` }} />
                </>
              )}
            </div>
            <div className="flex gap-3 mt-1.5">
              {[
                { color: "bg-green-400", label: "Good" },
                { color: "bg-orange-400", label: "Low" },
                { color: "bg-red-400", label: "Out" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1 text-xs text-gray-400">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom row: plan + status + top products + recent sales ──────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Monthly plan */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Monthly Plan</h3>
            {!plan.has_plan && <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">No plan set</span>}
          </div>
          {plan.has_plan ? (
            <div className="space-y-4">
              <PlanProgress
                label="Sales Achievement"
                pct={plan.achievement_pct}
                color="bg-indigo-400"
                value={plan.sales_achieve}
                target={plan.sales_target}
              />
              <PlanProgress
                label="Budget Usage"
                pct={plan.budget_pct}
                color="bg-orange-400"
                value={plan.spent}
                target={plan.budget}
              />
              <div className="flex justify-between text-xs pt-2 border-t border-gray-100">
                <span className="text-gray-500">Remaining budget</span>
                <span className={`font-mono font-semibold ${plan.budget - plan.spent < 0 ? "text-red-600" : "text-emerald-600"}`}>
                  {fmtK(Math.abs(plan.budget - plan.spent))}
                  {plan.budget - plan.spent < 0 ? " over" : " left"}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Actual Revenue</p>
                <p className="font-mono font-semibold text-indigo-700">{fmtK(kpis.monthly_revenue)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Actual Costs</p>
                <p className="font-mono font-semibold text-orange-600">{fmtK(kpis.monthly_wh_cost)}</p>
              </div>
              <a href="/plans" className="block text-center text-xs text-blue-600 border border-blue-200 bg-blue-50 rounded-lg py-1.5 hover:bg-blue-100">
                Set Monthly Plan →
              </a>
            </div>
          )}
        </div>

        {/* Sale status donut */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Order Status</h3>
          {Object.keys(sale_status_breakdown).length > 0
            ? <DonutChart data={sale_status_breakdown} />
            : <p className="text-sm text-gray-400">No orders this year</p>
          }
        </div>

        {/* Top products */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Top Products</h3>
          {top_products.length > 0
            ? <TopProductsChart data={top_products} />
            : <p className="text-sm text-gray-400">No sales data</p>
          }
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Access</h3>
          <div className="space-y-2">
            {[
              { href: "/sales",            label: "New Sale",       icon: "📋", color: "hover:bg-blue-50 hover:border-blue-200"   },
              { href: "/purchases",        label: "New Purchase",   icon: "📦", color: "hover:bg-amber-50 hover:border-amber-200" },
              { href: "/warehouse",        label: "Warehouse",      icon: "🏭", color: "hover:bg-indigo-50 hover:border-indigo-200"},
              { href: "/returns-damage",   label: "Returns/Damage", icon: "↩", color: "hover:bg-red-50 hover:border-red-200"     },
              { href: "/reports",          label: "Reports",        icon: "📊", color: "hover:bg-green-50 hover:border-green-200" },
              { href: "/plans",            label: "Plans",          icon: "🎯", color: "hover:bg-purple-50 hover:border-purple-200"},
            ].map(({ href, label, icon, color }) => (
              <a
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border border-transparent ${color} transition-all text-sm text-gray-700 font-medium`}
              >
                <span className="text-base w-5 text-center">{icon}</span>
                {label}
                <span className="ml-auto text-gray-300 text-xs">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Sales ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-800">Recent Sales</h3>
            <p className="text-xs text-gray-400">Last 8 orders</p>
          </div>
          <a href="/sales" className="text-xs text-blue-600 hover:underline font-medium">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-400 uppercase border-b border-gray-100">
            <tr>
              {["Order", "Store", "Date", "Status", "Total", "Due", ""].map((h) => (
                <th key={h} className={`px-5 py-3 font-semibold tracking-wide ${["Total","Due"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
              ))}
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
            {recent_sales.length === 0 && (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">No recent sales</td></tr>
            )}
            {recent_sales.map((s: RecentSale) => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-5 py-3 font-mono text-xs text-gray-500">{s.order_no}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {s.store_name?.[0]}
                    </div>
                    <span className="font-medium text-gray-800 text-xs">{s.store_name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-xs text-gray-500">{s.date}</td>
                <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLE[s.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {s.status}
                    </span>
                </td>
                <td className="px-5 py-3 text-right font-mono text-sm font-semibold text-gray-800">{fmt(s.total)}</td>
                <td className="px-5 py-3 text-right font-mono text-xs">
                  {s.payment_due > 0
                    ? <span className="text-orange-500">{fmt(s.payment_due)}</span>
                    : <span className="text-gray-400">✓</span>
                  }
                </td>
                <td className="px-5 py-3">
                  <a href={`/sales/${s.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 text-xs bg-blue-50 px-2.5 py-1 rounded-md hover:bg-blue-100">
                    View
                  </a>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
