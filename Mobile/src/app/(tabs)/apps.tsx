

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import {
  getApps,
  launchApp,
  type DesktopApp,
} from "../../services/app.service";

const COLORS = {
  bg: "#0B0D12",
  card: "#151922",
  border: "#292F3D",
  purple: "#7785FF",
  white: "#F5F7FA",
  muted: "#9299AA",
  green: "#4ADE80",
  red: "#F87171",
};

export default function AppsScreen() {
  const [search, setSearch] = useState("");
  const [apps, setApps] = useState<DesktopApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [launchingId, setLaunchingId] = useState<string | null>(null);

  const loadApps = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getApps();
      setApps(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load applications."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadApps();
  }, [loadApps]);

  const filteredApps = useMemo(
    () =>
      apps.filter((app) =>
        app.name.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [apps, search]
  );

  const handleLaunch = async (app: DesktopApp) => {
    if (launchingId) return;

    setLaunchingId(app.id);

    try {
      await launchApp(app.id);
      Alert.alert(
        "Launch request sent",
        `${app.name}: request sent to DeskPilot backend.`
      );
    } catch (err) {
      Alert.alert(
        "Launch failed",
        err instanceof Error ? err.message : "Could not launch the application."
      );
    } finally {
      setLaunchingId(null);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>APPLICATION LIBRARY</Text>
        <Text style={styles.title}>Your apps</Text>
        <Text style={styles.subtitle}>
          Your favorite Windows applications, all in one place.
        </Text>

        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>TOTAL APPLICATIONS</Text>
            <Text style={styles.count}>{apps.length}</Text>
            <Text style={styles.summaryHint}>
              {loading ? "Loading applications..." : "Connected app library"}
            </Text>
          </View>

          <View style={styles.summaryIcon}>
            <Text style={styles.gridIcon}>▦</Text>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search applications..."
            placeholderTextColor={COLORS.muted}
            style={styles.searchInput}
            autoCapitalize="none"
            clearButtonMode="never"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Text style={styles.clear}>✕</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ALL APPLICATIONS</Text>
          <Text style={styles.resultCount}>
            {filteredApps.length} apps
          </Text>
        </View>

        {loading && (
          <View style={styles.messageCard}>
            <ActivityIndicator size="large" color={COLORS.purple} />
            <Text style={styles.messageText}>Loading your apps...</Text>
          </View>
        )}

        {!loading && !!error && (
          <View style={styles.messageCard}>
            <Text style={styles.errorTitle}>Unable to load apps</Text>
            <Text style={styles.messageText}>{error}</Text>

            <Pressable
              style={styles.retryButton}
              onPress={() => void loadApps()}
            >
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        )}

        {!loading &&
          !error &&
          filteredApps.map((app) => (
            <View key={app.id} style={styles.appCard}>
              <View style={styles.appIcon}>
                <Text style={styles.appEmoji}>
                  {getAppIcon(app.name)}
                </Text>
              </View>

              <View style={styles.appInfo}>
                <Text style={styles.appName}>{app.name}</Text>
                <Text style={styles.appPath} numberOfLines={2}>
                  {app.executablePath}
                </Text>

                <View style={styles.statusRow}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Ready to launch</Text>
                </View>
              </View>

              <Pressable
                style={[
                  styles.launchButton,
                  launchingId === app.id && styles.disabledButton,
                ]}
                disabled={launchingId !== null}
                onPress={() => void handleLaunch(app)}
              >
                <Text style={styles.launchText}>
                  {launchingId === app.id ? "..." : "Launch ↗"}
                </Text>
              </Pressable>
            </View>
          ))}

        {!loading && !error && filteredApps.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>⌕</Text>
            <Text style={styles.emptyTitle}>
              {apps.length === 0 ? "No applications yet" : "No apps found"}
            </Text>
            <Text style={styles.emptyText}>
              {apps.length === 0
                ? "Add an application to your Windows app library."
                : "Try another name or clear your search."}
            </Text>
          </View>
        )}

        <Pressable
          style={styles.addButton}
          onPress={() => router.push("/apps/add")}
        >
          <Text style={styles.addButtonText}>＋ Add application</Text>
        </Pressable>

        <Text style={styles.footer}>
          DESKPILOT • YOUR LAPTOP, UNDER YOUR CONTROL
        </Text>
      </ScrollView>
    </View>
  );
}

function getAppIcon(name: string) {
  const value = name.toLowerCase();

  if (value.includes("notepad")) return "📝";
  if (value.includes("browser") || value.includes("brave")) return "🌐";
  if (value.includes("code") || value.includes("studio")) return "💻";
  if (value.includes("chrome")) return "🌐";
  if (value.includes("music") || value.includes("spotify")) return "🎵";

  return "🖥️";
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 22, paddingTop: 30, paddingBottom: 36 },
  eyebrow: {
    color: COLORS.purple,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
  },
  title: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: "800",
    marginTop: 9,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 19,
  },
  summaryLabel: {
    color: COLORS.muted,
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: "700",
  },
  count: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: "800",
    marginTop: 6,
  },
  summaryHint: { color: COLORS.muted, fontSize: 11, marginTop: 3 },
  summaryIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#242846",
    alignItems: "center",
    justifyContent: "center",
  },
  gridIcon: { color: COLORS.purple, fontSize: 29 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    paddingHorizontal: 13,
    marginBottom: 26,
  },
  searchIcon: { color: COLORS.muted, fontSize: 25, marginRight: 8 },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 13,
    paddingVertical: 15,
  },
  clear: { color: COLORS.muted, padding: 6 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },
  sectionTitle: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  resultCount: { color: COLORS.muted, fontSize: 11 },
  appCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 17,
    padding: 13,
    marginBottom: 12,
  },
  appIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#22263A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  appEmoji: { fontSize: 22 },
  appInfo: { flex: 1 },
  appName: { color: COLORS.white, fontSize: 13, fontWeight: "700" },
  appPath: { color: COLORS.muted, fontSize: 10, marginTop: 4 },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 7 },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.green,
    marginRight: 5,
  },
  statusText: { color: COLORS.green, fontSize: 9 },
  launchButton: {
    backgroundColor: "#252A46",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginLeft: 5,
  },
  disabledButton: { opacity: 0.55 },
  launchText: { color: COLORS.purple, fontSize: 10, fontWeight: "700" },
  messageCard: {
    alignItems: "center",
    padding: 24,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  messageText: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 10,
    textAlign: "center",
    lineHeight: 19,
  },
  errorTitle: { color: COLORS.red, fontSize: 15, fontWeight: "700" },
  retryButton: {
    backgroundColor: "#252A46",
    borderRadius: 9,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 16,
  },
  retryText: { color: COLORS.purple, fontSize: 12, fontWeight: "700" },
  emptyState: {
    alignItems: "center",
    paddingVertical: 35,
    paddingHorizontal: 16,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyIcon: { color: COLORS.muted, fontSize: 32 },
  emptyTitle: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
    marginTop: 8,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
    lineHeight: 18,
  },
  addButton: {
    backgroundColor: COLORS.purple,
    borderRadius: 13,
    alignItems: "center",
    padding: 16,
    marginTop: 12,
  },
  addButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  footer: {
    color: "#596174",
    fontSize: 9,
    letterSpacing: 1,
    textAlign: "center",
    marginTop: 26,
  },
});