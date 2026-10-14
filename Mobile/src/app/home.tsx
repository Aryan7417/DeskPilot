





import React, { useCallback, useEffect, useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from "react-native";

import { router, useFocusEffect } from "expo-router";

import {
    getConnectionSettings,
} from "../services/connection.service";

import {
    getApps,
    launchApp,
    type DesktopApp,
} from "../services/app.service";

const C = {
    bg: "#0B0D12",
    card: "#151922",
    border: "#292F3D",
    purple: "#7785FF",
    white: "#F5F7FA",
    muted: "#9299AA",
    green: "#4ADE80",
    red: "#FF718B",
};

type ConnectionStatus = "checking" | "online" | "offline";

export default function HomeScreen() {
    const [connectionStatus, setConnectionStatus] =
        useState<ConnectionStatus>("checking");

    const [apps, setApps] = useState<DesktopApp[]>([]);
    const [appsLoading, setAppsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [launchingId, setLaunchingId] = useState<string | null>(null);
    const [lastChecked, setLastChecked] = useState("");

    // Real backend health check
    const checkConnection = useCallback(async () => {
        try {
            const settings = await getConnectionSettings();
            const ip = settings.ip.trim();
            const port = Number(settings.port);

            if (!ip || !Number.isInteger(port) || port < 1 || port > 65535) {
                throw new Error("Invalid server settings");
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            try {
                const response = await fetch(
                    `http://${ip}:${port}/health`,
                    {
                        method: "GET",
                        headers: { Accept: "application/json" },
                        signal: controller.signal,
                    }
                );

                const data = await response.json();

                if (!response.ok || data.success !== true) {
                    throw new Error("Backend is not available");
                }

                setConnectionStatus("online");
                setLastChecked(new Date().toLocaleTimeString());
            } finally {
                clearTimeout(timeoutId);
            }
        } catch {
            setConnectionStatus("offline");
        }
    }, []);

    // Fetch the real app list from the backend
    const loadApps = useCallback(async () => {
        setAppsLoading(true);

        try {
            const result = await getApps();
            setApps(result);
        } catch (error) {
            console.log("Failed to load DeskPilot apps:", error);
            setApps([]);
        } finally {
            setAppsLoading(false);
        }
    }, []);

    // Refresh dashboard whenever the screen receives focus
    useFocusEffect(
        useCallback(() => {
            checkConnection();
            loadApps();

            return undefined;
        }, [checkConnection, loadApps])
    );

    // Automatically recheck backend status every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            checkConnection();
        }, 10000);

        return () => clearInterval(interval);
    }, [checkConnection]);

    const handleRefresh = async () => {
        setRefreshing(true);

        try {
            await Promise.all([checkConnection(), loadApps()]);
        } finally {
            setRefreshing(false);
        }
    };

    // Launch a saved Windows application
    const handleQuickLaunch = async (app: DesktopApp) => {
        if (launchingId !== null) return;

        if (connectionStatus !== "online") {
            Alert.alert(
                "Laptop offline",
                "Please check your laptop connection and try again."
            );
            return;
        }

        try {
            setLaunchingId(app.id);

            await launchApp(app.id);

            Alert.alert(
                "Launch requested",
                `${app.name} launch request was sent to your laptop.`
            );
        } catch (error) {
            Alert.alert(
                "Launch failed",
                error instanceof Error
                    ? error.message
                    : "Could not launch this application."
            );
        } finally {
            setLaunchingId(null);
        }
    };

    const statusColor =
        connectionStatus === "online"
            ? C.green
            : connectionStatus === "offline"
                ? C.red
                : C.purple;

    const statusLabel =
        connectionStatus === "online"
            ? "LIVE • ONLINE"
            : connectionStatus === "offline"
                ? "OFFLINE"
                : "CHECKING...";

    return (
        <View style={s.screen}>
            <ScrollView
                contentContainerStyle={s.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={C.purple}
                    />
                }
            >
                {/* Header */}
                <View style={s.header}>
                    <View>
                        <Text style={s.brand}>DESKPILOT</Text>
                        <Text style={s.greeting}>Welcome back, Aryan</Text>
                        <Text style={s.subtitle}>
                            Your workspace, at a glance.
                        </Text>
                    </View>

                    <Pressable
                        style={s.avatar}
                        onPress={() => router.push("/settings")}
                    >
                        <Text style={s.avatarText}>A</Text>
                    </Pressable>
                </View>

                {/* Live laptop status */}
                <View style={s.laptopCard}>
                    <View style={s.laptopTop}>
                        <View style={s.deviceIcon}>
                            <Text style={s.deviceEmoji}>▣</Text>
                        </View>

                        <View style={s.statusBadge}>
                            <View
                                style={[
                                    s.statusDot,
                                    { backgroundColor: statusColor },
                                ]}
                            />

                            <Text style={[s.statusText, { color: statusColor }]}>
                                {statusLabel}
                            </Text>
                        </View>
                    </View>

                    <Text style={s.laptopTitle}>My Windows Laptop</Text>

                    <Text style={s.laptopSubtitle}>
                        Your personal workstation
                    </Text>

                    <View style={s.separator} />

                    <View style={s.details}>
                        <View style={s.detailItem}>
                            <Text style={s.detailLabel}>CONNECTION</Text>
                            <Text style={[s.detailValue, { color: statusColor }]}>
                                {connectionStatus === "checking"
                                    ? "Checking..."
                                    : connectionStatus === "online"
                                        ? "Connected"
                                        : "Disconnected"}
                            </Text>
                        </View>

                        <View style={s.detailItem}>
                            <Text style={s.detailLabel}>DEVICE</Text>
                            <Text style={s.detailValue}>Windows PC</Text>
                        </View>
                    </View>

                    {Boolean(lastChecked) && (
                        <Text style={s.lastChecked}>
                            Last successful check: {lastChecked}
                        </Text>
                    )}

                    <Pressable
                        style={s.connectButton}
                        onPress={() => router.push("/connection")}
                    >
                        <Text style={s.connectText}>
                            Configure connection  →
                        </Text>
                    </Pressable>

                    <Pressable
                        style={s.retryButton}
                        onPress={checkConnection}
                        disabled={connectionStatus === "checking"}
                    >
                        <Text style={s.retryText}>
                            {connectionStatus === "checking"
                                ? "Checking server..."
                                : "↻  Check connection now"}
                        </Text>
                    </Pressable>
                </View>

                {/* Quick Actions */}
                <View style={s.sectionHeader}>
                    <Text style={s.sectionTitle}>QUICK ACTIONS</Text>
                    <Text style={s.sectionHint}>Explore DeskPilot</Text>
                </View>

                <View style={s.actions}>
                    <Pressable
                        style={s.actionCard}
                        onPress={() => router.push("/apps")}
                    >
                        <View style={s.actionIcon}>
                            <Text style={s.actionSymbol}>▦</Text>
                        </View>

                        <Text style={s.actionTitle}>My Apps</Text>
                        <Text style={s.actionDescription}>
                            Browse applications
                        </Text>
                        <Text style={s.arrow}>↗</Text>
                    </Pressable>

                    <Pressable
                        style={s.actionCard}
                        onPress={() => router.push("/apps/add")}
                    >
                        <View style={s.actionIcon}>
                            <Text style={s.actionSymbol}>＋</Text>
                        </View>

                        <Text style={s.actionTitle}>Add App</Text>
                        <Text style={s.actionDescription}>
                            Expand your library
                        </Text>
                        <Text style={s.arrow}>↗</Text>
                    </Pressable>

                    <Pressable
                        style={s.actionCard}
                        onPress={() => router.push("/activity")}
                    >
                        <View style={s.actionIcon}>
                            <Text style={s.actionSymbol}>◷</Text>
                        </View>

                        <Text style={s.actionTitle}>Activity</Text>
                        <Text style={s.actionDescription}>
                            Review recent events
                        </Text>
                        <Text style={s.arrow}>↗</Text>
                    </Pressable>

                    <Pressable
                        style={s.actionCard}
                        onPress={() => router.push("/settings")}
                    >
                        <View style={s.actionIcon}>
                            <Text style={s.actionSymbol}>⚙</Text>
                        </View>

                        <Text style={s.actionTitle}>Settings</Text>
                        <Text style={s.actionDescription}>
                            Manage preferences
                        </Text>
                        <Text style={s.arrow}>↗</Text>
                    </Pressable>
                </View>

                {/* Quick Launch: real backend apps */}
                <View style={s.sectionHeader}>
                    <Text style={s.sectionTitle}>QUICK LAUNCH</Text>

                    <Pressable onPress={() => router.push("/apps")}>
                        <Text style={s.viewAll}>All Apps ↗</Text>
                    </Pressable>
                </View>

                {appsLoading ? (
                    <View style={s.loadingCard}>
                        <ActivityIndicator color={C.purple} size="small" />
                        <Text style={s.actionDescription}>
                            Loading your applications...
                        </Text>
                    </View>
                ) : apps.length === 0 ? (
                    <View style={s.emptyApps}>
                        <View style={s.actionIcon}>
                            <Text style={s.actionSymbol}>▣</Text>
                        </View>

                        <Text style={s.actionTitle}>No apps found</Text>

                        <Text style={s.actionDescription}>
                            Add an application to access it quickly from your dashboard.
                        </Text>

                        <Pressable
                            style={s.miniButton}
                            onPress={() => router.push("/apps/add")}
                        >
                            <Text style={s.miniButtonText}>+ Add App</Text>
                        </Pressable>

                        <Pressable
                            style={s.textButton}
                            onPress={loadApps}
                        >
                            <Text style={s.viewAll}>Refresh apps</Text>
                        </Pressable>
                    </View>
                ) : (
                    <View style={s.quickLaunchList}>
                        {apps.map((app) => (
                            <Pressable
                                key={app.id}
                                style={[
                                    s.quickLaunchCard,
                                    launchingId === app.id && { opacity: 0.65 },
                                ]}
                                onPress={() => handleQuickLaunch(app)}
                                disabled={launchingId !== null}
                            >
                                <View style={s.quickIcon}>
                                    <Text style={s.quickIconText}>▣</Text>
                                </View>

                                <View style={s.quickLaunchInfo}>
                                    <Text style={s.actionTitle} numberOfLines={1}>
                                        {app.name}
                                    </Text>

                                    <Text
                                        style={s.actionDescription}
                                        numberOfLines={1}
                                    >
                                        {app.executablePath}
                                    </Text>
                                </View>

                                {launchingId === app.id ? (
                                    <ActivityIndicator color={C.purple} />
                                ) : (
                                    <View style={s.launchButton}>
                                        <Text style={s.launchArrow}>▶</Text>
                                    </View>
                                )}
                            </Pressable>
                        ))}
                    </View>
                )}

                {/* Recent activity */}
                <View style={s.sectionHeader}>
                    <Text style={s.sectionTitle}>RECENT ACTIVITY</Text>

                    <Pressable onPress={() => router.push("/activity")}>
                        <Text style={s.viewAll}>View all ↗</Text>
                    </Pressable>
                </View>

                <View style={s.recentCard}>
                    <View style={s.recentIcon}>
                        <Text style={s.recentSymbol}>✦</Text>
                    </View>

                    <View style={s.recentInfo}>
                        <Text style={s.recentTitle}>DeskPilot dashboard</Text>
                        <Text style={s.recentDescription}>
                            Your dashboard is ready to use.
                        </Text>
                    </View>

                    <View style={s.activityBadge}>
                        <Text style={s.time}>READY</Text>
                    </View>
                </View>

                <Text style={s.footer}>
                    DESKPILOT • YOUR LAPTOP, UNDER YOUR CONTROL
                </Text>
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: C.bg,
    },

    content: {
        padding: 22,
        paddingTop: 36,
        paddingBottom: 40,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 27,
    },

    brand: {
        color: C.purple,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 2.5,
    },

    greeting: {
        color: C.white,
        fontSize: 24,
        fontWeight: "800",
        marginTop: 12,
    },

    subtitle: {
        color: C.muted,
        fontSize: 12,
        marginTop: 7,
    },

    avatar: {
        width: 45,
        height: 45,
        borderRadius: 15,
        backgroundColor: "#252A46",
        borderWidth: 1,
        borderColor: "#454D7C",
        alignItems: "center",
        justifyContent: "center",
    },

    avatarText: {
        color: C.purple,
        fontSize: 18,
        fontWeight: "800",
    },

    laptopCard: {
        backgroundColor: C.card,
        borderColor: C.border,
        borderWidth: 1,
        borderRadius: 21,
        padding: 18,
        marginBottom: 29,
    },

    laptopTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    deviceIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: "#242846",
        alignItems: "center",
        justifyContent: "center",
    },

    deviceEmoji: {
        color: C.purple,
        fontSize: 29,
    },

    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#252A46",
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 20,
    },

    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },

    statusText: {
        fontSize: 9,
        fontWeight: "800",
    },

    laptopTitle: {
        color: C.white,
        fontSize: 19,
        fontWeight: "800",
        marginTop: 18,
    },

    laptopSubtitle: {
        color: C.muted,
        fontSize: 12,
        marginTop: 6,
    },

    separator: {
        height: 1,
        backgroundColor: C.border,
        marginVertical: 19,
    },

    details: {
        flexDirection: "row",
        gap: 30,
    },

    detailItem: {
        flex: 1,
    },

    detailLabel: {
        color: C.muted,
        fontSize: 9,
        fontWeight: "700",
        letterSpacing: 1,
    },

    detailValue: {
        color: C.white,
        fontSize: 12,
        fontWeight: "600",
        marginTop: 7,
    },

    lastChecked: {
        color: C.muted,
        fontSize: 10,
        marginTop: 13,
    },

    connectButton: {
        backgroundColor: "#252A46",
        borderRadius: 12,
        alignItems: "center",
        padding: 13,
        marginTop: 20,
    },

    connectText: {
        color: C.purple,
        fontSize: 12,
        fontWeight: "700",
    },

    retryButton: {
        alignItems: "center",
        paddingVertical: 12,
        marginTop: 3,
    },

    retryText: {
        color: C.muted,
        fontSize: 11,
        fontWeight: "600",
    },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },

    sectionTitle: {
        color: C.white,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1.2,
    },

    sectionHint: {
        color: C.muted,
        fontSize: 10,
    },

    actions: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 29,
    },

    actionCard: {
        width: "48%",
        flexGrow: 1,
        minHeight: 145,
        backgroundColor: C.card,
        borderColor: C.border,
        borderWidth: 1,
        borderRadius: 17,
        padding: 14,
    },

    actionIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: "#252A46",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 13,
    },

    actionSymbol: {
        color: C.purple,
        fontSize: 22,
    },

    actionTitle: {
        color: C.white,
        fontSize: 14,
        fontWeight: "700",
    },

    actionDescription: {
        color: C.muted,
        fontSize: 10,
        marginTop: 5,
    },

    arrow: {
        position: "absolute",
        right: 13,
        top: 13,
        color: C.muted,
        fontSize: 15,
    },

    viewAll: {
        color: C.purple,
        fontSize: 11,
        fontWeight: "700",
    },

    quickLaunchList: {
        gap: 10,
        marginBottom: 29,
    },

    quickLaunchCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: C.card,
        borderColor: C.border,
        borderWidth: 1,
        borderRadius: 15,
        padding: 13,
        gap: 12,
    },

    quickIcon: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: "#252A46",
        alignItems: "center",
        justifyContent: "center",
    },

    quickIconText: {
        color: C.purple,
        fontSize: 23,
    },

    quickLaunchInfo: {
        flex: 1,
    },

    launchButton: {
        width: 34,
        height: 34,
        borderRadius: 11,
        backgroundColor: "#18352E",
        alignItems: "center",
        justifyContent: "center",
    },

    launchArrow: {
        color: C.green,
        fontSize: 13,
        fontWeight: "800",
    },

    loadingCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: C.card,
        borderColor: C.border,
        borderWidth: 1,
        borderRadius: 15,
        padding: 16,
        marginBottom: 29,
    },

    emptyApps: {
        backgroundColor: C.card,
        borderColor: C.border,
        borderWidth: 1,
        borderRadius: 15,
        padding: 16,
        gap: 10,
        marginBottom: 29,
    },

    miniButton: {
        alignSelf: "flex-start",
        backgroundColor: "#252A46",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 4,
    },

    miniButtonText: {
        color: C.purple,
        fontWeight: "700",
        fontSize: 12,
    },

    textButton: {
        alignSelf: "flex-start",
        paddingVertical: 5,
    },

    recentCard: {
        backgroundColor: C.card,
        borderColor: C.border,
        borderWidth: 1,
        borderRadius: 15,
        padding: 13,
        flexDirection: "row",
        alignItems: "center",
    },

    recentIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#252A46",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 11,
    },

    recentSymbol: {
        color: C.purple,
        fontSize: 20,
    },

    recentInfo: {
        flex: 1,
    },

    recentTitle: {
        color: C.white,
        fontSize: 12,
        fontWeight: "700",
    },

    recentDescription: {
        color: C.muted,
        fontSize: 10,
        marginTop: 5,
    },

    activityBadge: {
        backgroundColor: "#252A46",
        borderRadius: 7,
        paddingHorizontal: 7,
        paddingVertical: 5,
    },

    time: {
        color: C.muted,
        fontSize: 8,
        fontWeight: "700",
    },

    footer: {
        color: "#596174",
        fontSize: 8,
        letterSpacing: 1,
        textAlign: "center",
        marginTop: 27,
    },
});
