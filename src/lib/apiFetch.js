export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("access");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
}