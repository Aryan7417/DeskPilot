const API_BASE_URL = "http://172.16.48.54:3000";

const API_TOKEN = "pQahepv9dIrIPyFU0wzAbbr5xXqqUwuuLYPoBfqb2mlPtQvDSkdDmstXow0XI5rk";


export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || `Request failed: ${response.status}`);
  }

    return data as T;
}