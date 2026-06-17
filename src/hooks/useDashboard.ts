import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
import { apiPath } from "@/lib/api-config";
import { DashboardData } from "@/types/dashboard";

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: () => apiFetch(apiPath("dashboard/")),
    staleTime: 60_000,
    refetchInterval: 120_000,
  });
}