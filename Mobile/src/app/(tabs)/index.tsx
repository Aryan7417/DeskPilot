import React, { useCallback, useState } from "react";

import {
    View,
    Text,
    Image,
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
    getConnectionStatus,
} from "../../services/connection.service";

import {
    getApps,
    launchApp,
    type DesktopApp,
} from "../../services/app.service";

const C = {
    bg: "#0B0D12",
    card: "#151922",
    border: "#292F3D",
    purple: "#7785FF",
    white: "#F5F7FA",
    muted: "#9299AA",
    green: "#4ADE80",
    red: "#F97066",
};

const API_BASE_URL = "https://deskpilot-259y.onrender.com";
export default function HomeTab() {
    const [isOnline, setIsOnline] = useState(false);
    const [checking, setChecking] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [apps, setApps] = useState<DesktopApp[]>([]);
    const [launchingId, setLaunchingId] = useState<string | null>(null);
    const [recentApps, setRecentApps] = useState<DesktopApp[]>([]);
    const [lastChecked, setLastChecked] = useState("");

    // const checkConnection = useCallback(async () => {
    //     try {
    //         const settings = await getConnectionSettings();
    //         const manuallyConnected = await getConnectionStatus();

    //         if (!manuallyConnected) {
    //             setIsOnline(false);
    //             return;
    //         }

    //         const ip = settings.ip.trim();
    //         const port = settings.port.trim();

    //         const response = await fetch(`http://${ip}:${port}/health`);

    //         if (!response.ok) {
    //             throw new Error("Server not reachable");
    //         }

    //         const data = await response.json();

    //         setIsOnline(data.success === true || data.status === "online");
    //         setLastChecked(new Date().toLocaleTimeString());
    //     } catch {
    //         setIsOnline(false);
    //     } finally {
    //         setChecking(false);
    //     }
    // }, []);


    const checkConnection = useCallback(async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            try {
                const response = await fetch(`${API_BASE_URL}/health`, {
                    method: "GET",
                    headers: { Accept: "application/json" },
                    signal: controller.signal,
                });

                const data = await response.json();

                const online =
                    response.ok &&
                    (data.success === true || data.status === "online");

                setIsOnline(online);

                if (online) {
                    setLastChecked(
                        new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        })
                    );
                }
            } finally {
                clearTimeout(timeoutId);
            }
        } catch {
            setIsOnline(false);
        } finally {
            setChecking(false);
        }
    }, []);


    const loadApps = useCallback(async () => {
        try {
            const result = await getApps();
            setApps(result);
        } catch (error) {
            console.log("Could not load apps:", error);
            setApps([]);
        }
    }, []);

    const refreshDashboard = useCallback(async () => {
        setRefreshing(true);

        try {
            await Promise.all([checkConnection(), loadApps()]);
        } finally {
            setRefreshing(false);
        }
    }, [checkConnection, loadApps]);

    useFocusEffect(
        useCallback(() => {
            void refreshDashboard();

            const interval = setInterval(() => {
                void checkConnection();
            }, 10000);

            return () => clearInterval(interval);
        }, [refreshDashboard, checkConnection])
    );

    const handleLaunch = async (app: DesktopApp) => {
        if (launchingId) return;

        if (!isOnline) {
            Alert.alert(
                "Laptop Offline",
                "Please check your laptop connection first."
            );
            return;
        }

        setLaunchingId(app.id);

        try {
            await launchApp(app.id);

            setRecentApps((previous) =>
                [app, ...previous.filter((item) => item.id !== app.id)].slice(0, 5)
            );

            Alert.alert("Launch Requested", `${app.name} launch request sent.`);
        } catch (error) {
            Alert.alert(
                "Launch Failed",
                error instanceof Error ? error.message : "Unable to launch app."
            );
        } finally {
            setLaunchingId(null);
        }
    };

    const quickApps = apps.slice(0, 4);

    return (
        <ScrollView
            style={s.screen}
            contentContainerStyle={s.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refreshDashboard}
                    tintColor={C.purple}
                />
            }
        >
            <Text style={s.brand}>DESKPILOT</Text>
            <Text style={s.title}>Welcome back</Text>
            <Text style={s.subtitle}>Your workspace, at a glance.</Text>

            <View style={s.laptop}>
                <Text style={s.device}>▣</Text>
                <Text style={s.laptopTitle}>My Windows Laptop</Text>

                <View style={s.statusRow}>
                    {checking ? (
                        <ActivityIndicator color={C.purple} size="small" />
                    ) : (
                        <View
                            style={[
                                s.statusDot,
                                { backgroundColor: isOnline ? C.green : C.red },
                            ]}
                        />
                    )}

                    <Text
                        style={[
                            s.status,
                            { color: isOnline ? C.green : C.red },
                        ]}
                    >
                        {checking
                            ? "Checking connection..."
                            : isOnline
                                ? "Online • Connected"
                                : "Offline • Not connected"}
                    </Text>
                </View>

                <Text style={s.description}>
                    {lastChecked
                        ? `Last checked: ${lastChecked}`
                        : "Your personal workstation"}
                </Text>

                <Pressable
                    style={s.secondaryButton}
                    onPress={() => router.push("/connection")}
                >
                    <Text style={s.secondaryText}>Configure connection →</Text>
                </Pressable>

                <Pressable
                    style={s.checkButton}
                    onPress={() => void checkConnection()}
                >
                    <Text style={s.checkButtonText}>↻  Check Connection</Text>
                </Pressable>
            </View>

            <View style={s.sectionHeader}>
                <Text style={s.section}>QUICK LAUNCH</Text>
                <Pressable onPress={() => router.push("/(tabs)/apps")}>
                    <Text style={s.link}>See all →</Text>
                </Pressable>
            </View>

            {quickApps.length > 0 ? (
                <View style={s.grid}>
                    {quickApps.map((app) => (
                        <Pressable
                            key={app.id}
                            style={s.card}
                            disabled={launchingId !== null}
                            onPress={() => void handleLaunch(app)}
                        >
                            <AppIcon app={app} />

                            <Text style={s.cardTitle} numberOfLines={1}>
                                {app.name}
                            </Text>

                            <Text style={s.cardDescription}>
                                {launchingId === app.id
                                    ? "Launching..."
                                    : "Tap to launch ↗"}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            ) : (
                <View style={s.emptyCard}>
                    <Text style={s.cardTitle}>No saved apps found</Text>
                    <Text style={s.cardDescription}>
                        Add an app to see it here.
                    </Text>

                    <Pressable
                        style={s.addButton}
                        onPress={() => router.push("/apps/add")}
                    >
                        <Text style={s.secondaryText}>＋ Add App</Text>
                    </Pressable>

                    <Pressable onPress={() => void loadApps()}>
                        <Text style={s.link}>Refresh apps</Text>
                    </Pressable>
                </View>
            )}

            <Text style={s.section}>QUICK ACTIONS</Text>

            <View style={s.grid}>
                <Pressable
                    style={s.card}
                    onPress={() => router.push("/(tabs)/apps")}
                >
                    <Text style={s.icon}>▦</Text>
                    <Text style={s.cardTitle}>My Apps</Text>
                    <Text style={s.cardDescription}>Browse applications</Text>
                </Pressable>

                <Pressable
                    style={s.card}
                    onPress={() => router.push("/apps/add")}
                >
                    <Text style={s.icon}>＋</Text>
                    <Text style={s.cardTitle}>Add App</Text>
                    <Text style={s.cardDescription}>Expand your library</Text>
                </Pressable>

                <Pressable
                    style={s.card}
                    onPress={() => router.push("/(tabs)/activity")}
                >
                    <Text style={s.icon}>◷</Text>
                    <Text style={s.cardTitle}>Activity</Text>
                    <Text style={s.cardDescription}>Recent events</Text>
                </Pressable>

                <Pressable
                    style={s.card}
                    onPress={() => router.push("/(tabs)/settings")}
                >
                    <Text style={s.icon}>⚙</Text>
                    <Text style={s.cardTitle}>Settings</Text>
                    <Text style={s.cardDescription}>Manage preferences</Text>
                </Pressable>
            </View>

            <View style={s.sectionHeader}>
                <Text style={s.section}>RECENT ACTIVITY</Text>
                <Text style={s.count}>{recentApps.length} recent</Text>
            </View>

            {recentApps.length > 0 ? (
                recentApps.map((app) => (
                    <Pressable
                        key={app.id}
                        style={s.recent}
                        onPress={() => void handleLaunch(app)}
                        disabled={launchingId !== null}
                    >
                        <AppIcon app={app} compact />

                        <View style={s.recentInfo}>
                            <Text style={s.cardTitle}>{app.name}</Text>
                            <Text style={s.cardDescription}>Launch again ↗</Text>
                        </View>
                    </Pressable>
                ))
            ) : (
                <View style={s.recent}>
                    <Text style={s.icon}>✦</Text>
                    <View style={s.recentInfo}>
                        <Text style={s.cardTitle}>Welcome to DeskPilot</Text>
                        <Text style={s.cardDescription}>
                            Launched apps will appear here during this session.
                        </Text>
                    </View>
                </View>
            )}

            <Text style={s.footer}>
                DESKPILOT • YOUR LAPTOP, UNDER YOUR CONTROL
            </Text>
        </ScrollView>
    );
}

// Displays the real Windows icon when available, with an emoji fallback.
function AppIcon({
    app,
    compact = false,
}: {
    app: DesktopApp;
    compact?: boolean;
}) {
    const [failed, setFailed] = useState(false);

    if (app.iconUrl && !failed) {
        return (
            <Image
                source={{ uri: app.iconUrl }}
                style={[s.realAppIcon, compact && s.realAppIconCompact]}
                resizeMode="contain"
                onError={(event) => {
                    console.warn(
                        `Could not load icon for ${app.name}:`,
                        event.nativeEvent.error
                    );
                    setFailed(true);
                }}
            />
        );
    }

    return (
        <Text style={[s.icon, compact && s.iconCompact]}>
            {getAppIcon(app.name)}
        </Text>
    );
}

function getAppIcon(name: string) {
    const value = name.toLowerCase();

    if (value.includes("notepad")) return "📝";

    if (
        value.includes("chrome") ||
        value.includes("browser") ||
        value.includes("brave") ||
        value.includes("edge")
    ) {
        return "🌐";
    }

    if (value.includes("code") || value.includes("studio")) {
        return "💻";
    }

    if (value.includes("music") || value.includes("spotify")) {
        return "🎵";
    }

    if (value.includes("calculator")) return "🧮";

    return "🖥️";
}

const s = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: C.bg,
    },
    content: {
        padding: 22,
        paddingTop: 35,
        paddingBottom: 35,
    },
    brand: {
        color: C.purple,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 2.5,
    },
    title: {
        color: C.white,
        fontSize: 25,
        fontWeight: "800",
        marginTop: 12,
    },
    subtitle: {
        color: C.muted,
        fontSize: 12,
        marginTop: 7,
        marginBottom: 25,
    },
    laptop: {
        backgroundColor: C.card,
        borderColor: C.border,
        borderWidth: 1,
        borderRadius: 20,
        padding: 19,
        marginBottom: 28,
    },
    device: {
        color: C.purple,
        fontSize: 32,
    },
    laptopTitle: {
        color: C.white,
        fontSize: 18,
        fontWeight: "800",
        marginTop: 12,
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 10,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    status: {
        fontSize: 12,
        fontWeight: "700",
    },
    description: {
        color: C.muted,
        fontSize: 11,
        marginTop: 8,
    },
    secondaryButton: {
        backgroundColor: "#252A46",
        padding: 13,
        borderRadius: 11,
        alignItems: "center",
        marginTop: 19,
    },
    secondaryText: {
        color: C.purple,
        fontWeight: "700",
        fontSize: 12,
    },
    checkButton: {
        borderWidth: 1,
        borderColor: C.border,
        padding: 12,
        borderRadius: 11,
        alignItems: "center",
        marginTop: 10,
    },
    checkButtonText: {
        color: C.white,
        fontSize: 12,
        fontWeight: "700",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },
    section: {
        color: C.white,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1.3,
    },
    link: {
        color: C.purple,
        fontSize: 11,
        fontWeight: "700",
    },
    count: {
        color: C.muted,
        fontSize: 10,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 28,
    },
    card: {
        width: "48%",
        flexGrow: 1,
        minHeight: 120,
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 16,
        padding: 14,
    },
    icon: {
        color: C.purple,
        fontSize: 25,
        marginBottom: 12,
    },
    iconCompact: {
        marginBottom: 0,
    },
    realAppIcon: {
        width: 32,
        height: 32,
        marginBottom: 12,
    },
    realAppIconCompact: {
        marginBottom: 0,
    },
    cardTitle: {
        color: C.white,
        fontSize: 13,
        fontWeight: "700",
    },
    cardDescription: {
        color: C.muted,
        fontSize: 10,
        marginTop: 6,
    },
    emptyCard: {
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 16,
        padding: 18,
        marginBottom: 28,
        gap: 10,
    },
    addButton: {
        alignSelf: "flex-start",
        backgroundColor: "#252A46",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
    },
    recent: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: C.card,
        borderColor: C.border,
        borderWidth: 1,
        borderRadius: 15,
        padding: 14,
        marginBottom: 10,
    },
    recentInfo: {
        flex: 1,
        marginLeft: 12,
    },
    footer: {
        color: "#596174",
        fontSize: 8,
        letterSpacing: 1,
        textAlign: "center",
        marginTop: 26,
    },
});
