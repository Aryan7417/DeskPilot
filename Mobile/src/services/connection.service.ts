import AsyncStorage from "@react-native-async-storage/async-storage";

const CONNECTION_KEY = "@deskpilot/connection";

export type ConnectionSettings = {
  ip: string;
  port: string;
};

const DEFAULT_SETTINGS: ConnectionSettings = {
  ip: "172.16.48.54",
  port: "3000",
};

export async function getConnectionSettings(): Promise<ConnectionSettings> {
  try {
    const saved = await AsyncStorage.getItem(CONNECTION_KEY);

    if (!saved) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(saved);

    return {
      ip: typeof parsed.ip === "string" ? parsed.ip : DEFAULT_SETTINGS.ip,
      port:
        typeof parsed.port === "string"
          ? parsed.port
          : DEFAULT_SETTINGS.port,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveConnectionSettings(
  settings: ConnectionSettings
): Promise<void> {
  await AsyncStorage.setItem(
    CONNECTION_KEY,
    JSON.stringify(settings)
  );
}

export async function clearConnectionSettings(): Promise<void> {
  await AsyncStorage.removeItem(CONNECTION_KEY);
}
