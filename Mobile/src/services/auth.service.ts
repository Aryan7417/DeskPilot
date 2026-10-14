
import { API_BASE_URL } from "./api";

export interface DeskPilotApp {
  id: string;
  name: string;
  executablePath: string;
}

export interface AddAppPayload {
  name: string;
  executablePath: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed: ${response.status}`
    );
  }

  return data as T;
}

export const appService = {
  getApps(token: string) {
    return request<DeskPilotApp[]>("/api/apps", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  addApp(payload: AddAppPayload, token: string) {
    return request<unknown>("/api/apps", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  launchApp(id: string, token: string) {
    return request<unknown>(`/api/apps/${encodeURIComponent(id)}/launch`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  deleteApp(id: string, token: string) {
    return request<unknown>(`/api/apps/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};