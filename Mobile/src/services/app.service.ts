import { apiRequest } from "./api";

export type DesktopApp = {
  id: string;
  name: string;
  executablePath: string;
};

import { getConnectionSettings } from "../services/connection.service";


export async function getApps(): Promise<DesktopApp[]> {
  const result = await apiRequest<DesktopApp[] | { apps: DesktopApp[] }>(
    "/api/apps"
  );

  return Array.isArray(result) ? result : result.apps;
}

export async function addApp(
  name: string,
  executablePath: string
): Promise<DesktopApp> {
  return apiRequest<DesktopApp>("/api/apps", {
    method: "POST",
    body: JSON.stringify({
      name: name.trim(),
      executablePath: executablePath.trim(),
    }),
  });
}

export async function launchApp(id: string): Promise<unknown> {
  return apiRequest(`/api/apps/${encodeURIComponent(id)}/launch`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function deleteApp(id: string): Promise<unknown> {
  return apiRequest(`/api/apps/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
