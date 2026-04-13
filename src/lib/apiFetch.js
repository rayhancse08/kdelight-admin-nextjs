export async function apiFetch(url, options = {}) {
  let token = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("access");
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("API Error:", text);
      throw new Error(`API request failed: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}