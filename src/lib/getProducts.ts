import { apiFetch } from "@/lib/apiFetch";

const API = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function getTopProducts() {
  try {
    const data = await apiFetch(`${API}/products/`);
    return data.results ?? data;
  } catch (error) {
    console.error("Error fetching top products:", error);
    return [];
  }
}
