export async function apiFetch(url: string, options: any = {}) {
  let token = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("access");
  }

  const controller = new AbortController();
  const timeout = options.timeout || 10000; // 10s default

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,

      headers: {
        ...(options.body instanceof FormData
          ? {} // ❌ don't set JSON header for FormData
          : { "Content-Type": "application/json" }),

        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options.headers || {}),
      },

      cache: options.cache || "no-store", // or "force-cache"
      keepalive: true, // ✅ reuse connection
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        errorData = await res.text();
      }

      console.error("API Error:", errorData);

      throw {
        status: res.status,
        data: errorData,
      };
    }

    // ✅ Faster response handling
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    }

    return res;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      console.error("Request timeout");
      throw new Error("Request timeout");
    }

    console.error("Fetch failed:", error);
    throw error;
  }
}