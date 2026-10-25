const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:4000/api/v1";

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers);
  let body = options.body;

  if (body !== undefined && !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body,
  });

  const result =
    response.status === 204
      ? null
      : await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.error?.message || `Request failed with status ${response.status}.`,
    );
  }

  return result;
}