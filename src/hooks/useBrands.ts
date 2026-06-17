import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
import { Brand } from "@/types/brand";

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export function useBrands() {
  return useQuery<Brand[]>({
    queryKey: ["brands", "all"],
    queryFn: async () => {
      const data = await apiFetch(`${BASE}/brands/?page_size=500`);
      return data.results ?? data;
    },
    staleTime: 60_000,
  });
}
