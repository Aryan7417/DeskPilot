import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { apiRequest } from "../../services/api";

const C = {
  bg: "#090B11",
  panel: "#121622",
  panel2: "#181E2C",
  border: "#272E40",
  purple: "#8B7CFF",
  cyan: "#5DE1E6",
  white: "#F5F7FF",
  muted: "#929BB2",
  green: "#4ADE80",
  red: "#FB7185",
};

type Clip = {
  id: string;
  text: string;
  createdAt?: string;
  source?: string;
};

type ClipboardResponse = Clip[] | { items?: Clip[]; clipboard?: Clip[] };

function normalizeClips(data: ClipboardResponse): Clip[] {
  if (Array.isArray(data)) return data;
  return data.items ?? data.clipboard ?? [];
}

export default function ActivityScreen() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [error, setError] = useState("");
  const [lastSync, setLastSync] = useState("");
  const knownIds = useRef<Set<string>>(new Set());

  // Expected backend contract:
  // GET    /api/clipboard       -> { items: [{ id, text, createdAt, source }] }
  // DELETE /api/clipboard/:id  -> removes one history item
  const loadClipboard = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    else setSyncing(true);

    try {
      const result = await apiRequest<ClipboardResponse>("/api/clipboard");
      const next = normalizeClips(result);
      const nextIds = new Set(next.map((item) => item.id));

      // Highlight when a new clip arrives from the laptop.
      const hasNew = next.some((item) => !knownIds.current.has(item.id));
      knownIds.current = nextIds;
      setClips(next);
      setError("");
      setLastSync(new Date().toLocaleTimeString());

      if (hasNew && !manual && !loading) {
        // The new item appears at the top automatically; no alert to interrupt typing.
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Clipboard sync API is not available yet."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
      setSyncing(false);
    }
  }, [loading]);

  useEffect(() => {
    void loadClipboard();
    const timer = setInterval(() => void loadClipboard(), 2500);
    return () => clearInterval(timer);
  }, [loadClipboard]);

  const copyClip = async (clip: Clip) => {
    try {
      await Clipboard.setStringAsync(clip.text);
      Alert.alert("Copied to phone", "Text is now in your mobile clipboard.");
    } catch {
      Alert.alert("Copy failed", "Could not copy this text to the phone.");
    }
  };

  const deleteClip = (clip: Clip) => {
    Alert.alert("Delete clip?", "This removes the item from clipboard history.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await apiRequest(`/api/clipboard/${encodeURIComponent(clip.id)}`, {
              method: "DELETE",
            });
            setClips((previous) => previous.filter((item) => item.id !== clip.id));
          } catch (e) {
            Alert.alert(
              "Delete failed",
              e instanceof Error
                ? e.message
                : "Could not delete this clipboard item."
            );
          }
        },
      },
    ]);
  };

  const deleteAllClips = () => {
    if (clips.length === 0 || deletingAll) return;

    Alert.alert(
      "Delete all clipboard history?",
      `This will permanently remove all ${clips.length} saved clips from the server.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            setDeletingAll(true);
            try {
              await apiRequest("/api/clipboard", { method: "DELETE" });
              setClips([]);
              knownIds.current = new Set();
              setError("");
              setLastSync(new Date().toLocaleTimeString());
              Alert.alert("Success", "All clipboard history deleted.");
            } catch (e) {
              Alert.alert(
                "Delete failed",
                e instanceof Error
                  ? e.message
                  : "Could not delete clipboard history from the server."
              );
            } finally {
              setDeletingAll(false);
            }
          },
        },
      ]
    );
  };

  const clipCount = clips.length;

  return (
    <View style={s.screen}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void loadClipboard(true)}
            tintColor={C.cyan}
          />
        }
      >
        <View style={s.topLine}>
          <View>
            <Text style={s.eyebrow}>DESKPILOT • SMART TOOLS</Text>
            <Text style={s.title}>Clipboard</Text>
            <Text style={s.subtitle}>
              One copy on your laptop. Ready on your phone.
            </Text>
          </View>
          <View style={s.logoBox}>
            <Text style={s.logoGlyph}>⧉</Text>
          </View>
        </View>

        <View style={s.hero}>
          <View style={s.heroGlow} />
          <View style={s.heroTop}>
            <View style={s.livePill}>
              <View style={[s.liveDot, { backgroundColor: error ? C.red : C.green }]} />
              <Text style={s.liveText}>{error ? "SYNC WAITING" : "LIVE SYNC"}</Text>
            </View>
            {syncing ? (
              <ActivityIndicator size="small" color={C.cyan} />
            ) : (
              <Text style={s.syncEvery}>AUTO • 2.5 SEC</Text>
            )}
          </View>

          <View style={s.heroMiddle}>
            <View style={s.heroIcon}>
              <Text style={s.heroIconText}>⧉</Text>
            </View>
            <View style={s.heroCopy}>
              <Text style={s.heroHeading}>Clipboard bridge</Text>
              <Text style={s.heroDescription}>
                Copy with your laptop mouse. New text will appear here when the Windows agent syncs it.
              </Text>
            </View>
          </View>

          <View style={s.heroBottom}>
            <View>
              <Text style={s.statLabel}>SAVED CLIPS</Text>
              <Text style={s.statValue}>{clipCount.toString().padStart(2, "0")}</Text>
            </View>
            <View style={s.heroDivider} />
            <View style={s.lastSyncBlock}>
              <Text style={s.statLabel}>LAST CHECK</Text>
              <Text style={s.lastSync}>{lastSync || "Connecting..."}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              style={s.refreshButton}
              onPress={() => void loadClipboard(true)}
            >
              <Text style={s.refreshGlyph}>↻</Text>
            </Pressable>
          </View>
        </View>

        <View style={s.sectionHead}>
          <View>
            <Text style={s.sectionTitle}>CLIP HISTORY</Text>
            <Text style={s.sectionSubtitle}>Latest copied text appears first</Text>
          </View>
          <View style={s.sectionActions}>
            <View style={s.countBadge}>
              <Text style={s.countBadgeText}>{clipCount} ITEMS</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              disabled={clipCount === 0 || deletingAll}
              style={[
                s.deleteAllButton,
                (clipCount === 0 || deletingAll) && { opacity: 0.45 },
              ]}
              onPress={deleteAllClips}
            >
              {deletingAll ? (
                <ActivityIndicator size="small" color={C.red} />
              ) : (
                <Text style={s.deleteAllText}>Delete All</Text>
              )}
            </Pressable>
          </View>
        </View>

        {loading ? (
          <View style={s.stateCard}>
            <ActivityIndicator color={C.cyan} />
            <Text style={s.stateText}>Connecting to your laptop...</Text>
          </View>
        ) : clips.length > 0 ? (
          clips.map((clip, index) => (
            <View key={clip.id} style={s.clipCard}>
              <View style={s.clipAccent} />
              <View style={s.clipHeader}>
                <View style={s.clipTypeRow}>
                  <View style={s.clipNumber}>
                    <Text style={s.clipNumberText}>
                      {String(index + 1).padStart(2, "0")}
                    </Text>
                  </View>
                  <View style={s.sourcePill}>
                    <View style={s.sourceDot} />
                    <Text style={s.sourceText}>
                      {(clip.source || "LAPTOP").toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={s.clipTime}>
                  {clip.createdAt
                    ? new Date(clip.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "SYNCED"}
                </Text>
              </View>

              <Text style={s.clipContent} selectable numberOfLines={7}>
                {clip.text}
              </Text>

              <View style={s.clipFooter}>
                <Text style={s.charCount}>
                  {clip.text.length.toLocaleString()} CHARACTERS
                </Text>
                <View style={s.clipActions}>
                  <Pressable
                    style={s.copyButton}
                    onPress={() => void copyClip(clip)}
                  >
                    <Text style={s.copyGlyph}>⧉</Text>
                    <Text style={s.copyText}>Copy</Text>
                  </Pressable>
                  <Pressable
                    style={s.deleteButton}
                    onPress={() => deleteClip(clip)}
                  >
                    <Text style={s.deleteText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={s.emptyCard}>
            <View style={s.emptyIcon}>
              <Text style={s.emptyGlyph}>⧉</Text>
            </View>
            <Text style={s.emptyTitle}>
              {error ? "Waiting for clipboard service" : "Your clipboard is clear"}
            </Text>
            <Text style={s.emptyDescription}>
              {error
                ? "The mobile screen is ready, but the backend clipboard endpoint must be implemented and the Windows agent must be running."
                : "Copy any text on your laptop. Once Windows clipboard monitoring is connected, it will show up here automatically."}
            </Text>
            {error ? (
              <Pressable style={s.retryButton} onPress={() => void loadClipboard(true)}>
                <Text style={s.retryText}>Try again</Text>
              </Pressable>
            ) : null}
          </View>
        )}

        {error ? (
          <View style={s.warning}>
            <Text style={s.warningTitle}>Backend connection needed</Text>
            <Text style={s.warningText}>
              {error}. This screen polls GET /api/clipboard every 2.5 seconds.
              The Windows backend must capture clipboard changes and provide this endpoint.
            </Text>
          </View>
        ) : null}

        <Text style={s.footer}>PRIVATE BY DESIGN  •  DESKPILOT</Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, paddingTop: 34, paddingBottom: 42 },
  topLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 23,
  },
  eyebrow: { color: C.cyan, fontSize: 9, fontWeight: "800", letterSpacing: 1.8 },
  title: { color: C.white, fontSize: 31, fontWeight: "900", marginTop: 8 },
  subtitle: { color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 7, maxWidth: 245 },
  logoBox: {
    width: 53,
    height: 53,
    borderRadius: 17,
    backgroundColor: "#172A38",
    borderColor: "#28505B",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoGlyph: { color: C.cyan, fontSize: 30, fontWeight: "700" },
  hero: {
    overflow: "hidden",
    backgroundColor: "#111B29",
    borderWidth: 1,
    borderColor: "#28424F",
    borderRadius: 22,
    padding: 17,
    marginBottom: 29,
  },
  heroGlow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#183D4A",
    top: -100,
    right: -50,
    opacity: 0.65,
  },
  heroTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: "#162B2E",
    borderWidth: 1,
    borderColor: "#285054",
    borderRadius: 20,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  liveText: { color: C.cyan, fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  syncEvery: { color: C.muted, fontSize: 8, fontWeight: "800", letterSpacing: 1 },
  heroMiddle: { flexDirection: "row", alignItems: "center", marginTop: 22, gap: 13 },
  heroIcon: {
    width: 53,
    height: 53,
    borderRadius: 16,
    backgroundColor: "#1A3442",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#315866",
  },
  heroIconText: { color: C.cyan, fontSize: 30 },
  heroCopy: { flex: 1 },
  heroHeading: { color: C.white, fontSize: 16, fontWeight: "800" },
  heroDescription: { color: "#AAB8C9", fontSize: 10, lineHeight: 16, marginTop: 6 },
  heroBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 21,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#2B3D4C",
  },
  statLabel: { color: C.muted, fontSize: 8, fontWeight: "800", letterSpacing: 1 },
  statValue: { color: C.white, fontSize: 22, fontWeight: "900", marginTop: 3 },
  heroDivider: { width: 1, height: 31, backgroundColor: "#31414D", marginHorizontal: 17 },
  lastSyncBlock: { flex: 1 },
  lastSync: { color: C.white, fontSize: 10, fontWeight: "700", marginTop: 7 },
  refreshButton: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: "#213641",
    alignItems: "center",
    justifyContent: "center",
  },
  refreshGlyph: { color: C.cyan, fontSize: 24 },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  sectionTitle: { color: C.white, fontSize: 11, fontWeight: "900", letterSpacing: 1.5 },
  sectionSubtitle: { color: C.muted, fontSize: 10, marginTop: 5 },
  sectionActions: { flexDirection: "row", alignItems: "center", gap: 7 },
  deleteAllButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 9,
    backgroundColor: "#281923",
    borderWidth: 1,
    borderColor: "#58303E",
  },
  deleteAllText: { color: C.red, fontSize: 10, fontWeight: "800" },
  countBadge: {
    backgroundColor: "#1A2030",
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },
  countBadgeText: { color: C.cyan, fontSize: 8, fontWeight: "900", letterSpacing: 0.7 },
  clipCard: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 17,
    padding: 14,
    marginBottom: 12,
  },
  clipAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: C.cyan,
  },
  clipHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  clipTypeRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  clipNumber: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#1B2D3B",
    alignItems: "center",
    justifyContent: "center",
  },
  clipNumberText: { color: C.cyan, fontSize: 10, fontWeight: "900" },
  sourcePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1B282B",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  sourceDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.green },
  sourceText: { color: "#A4D9D8", fontSize: 8, fontWeight: "900", letterSpacing: 0.8 },
  clipTime: { color: C.muted, fontSize: 9 },
  clipContent: { color: C.white, fontSize: 12, lineHeight: 19, marginTop: 14 },
  clipFooter: {
    borderTopWidth: 1,
    borderTopColor: C.border,
    marginTop: 15,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  charCount: { color: C.muted, fontSize: 8, fontWeight: "700", letterSpacing: 0.5, flex: 1 },
  clipActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.purple,
    borderRadius: 9,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  copyGlyph: { color: "#FFFFFF", fontSize: 14 },
  copyText: { color: "#FFFFFF", fontSize: 10, fontWeight: "900" },
  deleteButton: {
    borderWidth: 1,
    borderColor: "#58303E",
    backgroundColor: "#281923",
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  deleteText: { color: C.red, fontSize: 10, fontWeight: "800" },
  stateCard: {
    minHeight: 150,
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  stateText: { color: C.muted, fontSize: 11 },
  emptyCard: {
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 23,
    alignItems: "center",
  },
  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#1A2D3A",
    borderWidth: 1,
    borderColor: "#2A4B59",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyGlyph: { color: C.cyan, fontSize: 31 },
  emptyTitle: { color: C.white, fontSize: 15, fontWeight: "800", marginTop: 16 },
  emptyDescription: { color: C.muted, fontSize: 11, lineHeight: 18, textAlign: "center", marginTop: 8 },
  retryButton: {
    marginTop: 15,
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#243B48",
  },
  retryText: { color: C.cyan, fontSize: 11, fontWeight: "800" },
  warning: {
    marginTop: 14,
    padding: 13,
    borderRadius: 12,
    backgroundColor: "#2B2022",
    borderWidth: 1,
    borderColor: "#5A373D",
  },
  warningTitle: { color: "#FFD2D7", fontSize: 11, fontWeight: "800" },
  warningText: { color: "#D9ADB4", fontSize: 10, lineHeight: 16, marginTop: 6 },
  footer: { color: "#596174", fontSize: 8, fontWeight: "800", letterSpacing: 1.2, textAlign: "center", marginTop: 27 },
});
