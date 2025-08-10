// Example fetch function for top products

export async function getTopProducts() {
  try {
    const res = await fetch("https://kdelight.info/api/products/", {
      // Add any headers or auth if needed
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // You might want to add `cache: "no-store"` or other fetch options depending on your Next.js setup
    });

    if (!res.ok) {
      throw new Error("Failed to fetch top products");
    }

    const data = await res.json();

    // Return the data as is, or transform if needed
    return data;
  } catch (error) {
    console.error("Error fetching top products:", error);
    return []; // return empty array on error to avoid crashes
  }
}
