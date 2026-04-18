import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
import { DashboardData } from "@/types/dashboard";

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const token = localStorage.getItem("access"); // or wherever you store it

      return apiFetch(`${BASE}/dashboard/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    staleTime: 60_000,
    refetchInterval: 120_000,
  });
}