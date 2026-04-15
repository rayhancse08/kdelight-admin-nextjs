export async function apiFetch(url, options = {}) {
  let token = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("access");
  }

  const isFormData = options.body instanceof FormData;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }), // ✅ fix
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options.headers || {}),
      },
    });

    const text = await res.text(); // ✅ ALWAYS read text first

    if (!res.ok) {
      console.error("API Error:", text);
      throw new Error(`API request failed: ${res.status}`);
    }

    // ✅ FIX: handle empty response
    if (!text) return {};

    try {
      return JSON.parse(text);
    } catch (err) {
      console.error("Invalid JSON:", text);
      throw new Error("Invalid JSON response");
    }

  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}