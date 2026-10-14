

import React, {
    useCallback,
    useMemo,
    useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { router, useFocusEffect } from "expo-router";

import {
    getApps,
    launchApp,
    deleteApp,
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

const RECENT_APPS_KEY = "@deskpilot/recent-apps";

export default function AppsScreen() {
    const [search, setSearch] = useState("");
    const [apps, setApps] = useState<DesktopApp[]>([]);
    const [recentApps, setRecentApps] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [launchingId, setLaunchingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadApps = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const result = await getApps();
            setApps(result);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load applications."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const loadRecentApps = useCallback(async () => {
        try {
            const saved = await AsyncStorage.getItem(RECENT_APPS_KEY);

            if (!saved) {
                setRecentApps([]);
                return;
            }

            const parsed: unknown = JSON.parse(saved);

            if (
                Array.isArray(parsed) &&
                parsed.every((id) => typeof id === "string")
            ) {
                setRecentApps(parsed.slice(0, 5));
            }
        } catch (err) {
            console.warn("Could not load recent apps:", err);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            void loadApps();
            void loadRecentApps();
        }, [loadApps, loadRecentApps])
    );

    const filteredApps = useMemo(
        () =>
            apps.filter((app) =>
                app.name.toLowerCase().includes(search.trim().toLowerCase())
            ),
        [apps, search]
    );

    const recentAppItems = useMemo(
        () =>
            recentApps
                .map((id) => apps.find((app) => app.id === id))
                .filter((app): app is DesktopApp => Boolean(app)),
        [recentApps, apps]
    );

    const handleLaunch = async (app: DesktopApp) => {
        if (launchingId || deletingId) return;

        setLaunchingId(app.id);

        try {
            await launchApp(app.id);

            const updatedRecent = [
                app.id,
                ...recentApps.filter((id) => id !== app.id),
            ].slice(0, 5);

            setRecentApps(updatedRecent);

            await AsyncStorage.setItem(
                RECENT_APPS_KEY,
                JSON.stringify(updatedRecent)
            );

            Alert.alert(
                "Launch request sent",
                `${app.name}: request sent to DeskPilot backend.`
            );
        } catch (err) {
            Alert.alert(
                "Launch failed",
                err instanceof Error
                    ? err.message
                    : "Could not launch the application."
            );
        } finally {
            setLaunchingId(null);
        }
    };

    const handleDelete = (app: DesktopApp) => {
        if (launchingId || deletingId) return;

        Alert.alert(
            "Delete application",
            `Are you sure you want to remove "${app.name}" from DeskPilot?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        void confirmDelete(app);
                    },
                },
            ]
        );
    };

    const confirmDelete = async (app: DesktopApp) => {
        if (deletingId || launchingId) return;

        setDeletingId(app.id);

        try {
            await deleteApp(app.id);

            setApps((previous) =>
                previous.filter((item) => item.id !== app.id)
            );

            const updatedRecent = recentApps.filter(
                (id) => id !== app.id
            );

            setRecentApps(updatedRecent);

            await AsyncStorage.setItem(
                RECENT_APPS_KEY,
                JSON.stringify(updatedRecent)
            );

            Alert.alert(
                "Application deleted",
                `${app.name} has been removed from DeskPilot.`
            );
        } catch (err) {
            Alert.alert(
                "Delete failed",
                err instanceof Error
                    ? err.message
                    : "Could not delete this application."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const renderAppCard = (
        app: DesktopApp,
        recent = false
    ) => {
        const isLaunching = launchingId === app.id;
        const isDeleting = deletingId === app.id;
        const busy = launchingId !== null || deletingId !== null;

        return (
            <View
                key={`${recent ? "recent-" : ""}${app.id}`}
                style={styles.appCard}
            >
                {/* <View style={styles.appIcon}>
                    <Text style={styles.appEmoji}>
                        {getAppIcon(app.name)}
                    </Text>
                </View> */}


                <View style={styles.appIcon}>
                    {app.iconUrl ? (
                        <Image
                            source={{ uri: app.iconUrl }}
                            style={styles.realAppIcon}
                            resizeMode="contain"
                            onError={(event) => {
                                console.warn(
                                    `Icon failed to load for ${app.name}:`,
                                    event.nativeEvent.error
                                );
                            }}
                        />
                    ) : (
                        <Text style={styles.appEmoji}>
                            {getAppIcon(app.name)}
                        </Text>
                    )}
                </View>


                <View style={styles.appInfo}>
                    <Text style={styles.appName} numberOfLines={1}>
                        {app.name}
                    </Text>

                    {recent ? (
                        <Text style={styles.recentStatus}>
                            Recently launched
                        </Text>
                    ) : (
                        <>
                            <Text style={styles.appPath} numberOfLines={2}>
                                {app.executablePath}
                            </Text>

                            <View style={styles.statusRow}>
                                <View style={styles.statusDot} />
                                <Text style={styles.statusText}>
                                    Saved application
                                </Text>
                            </View>
                        </>
                    )}
                </View>

                <View style={styles.cardActions}>
                    <Pressable
                        style={[
                            styles.launchButton,
                            busy && styles.disabledButton,
                        ]}
                        disabled={busy}
                        onPress={() => void handleLaunch(app)}
                    >
                        <Text style={styles.launchText}>
                            {isLaunching ? "..." : "Launch ↗"}
                        </Text>
                    </Pressable>

                    {!recent && (
                        <Pressable
                            style={[
                                styles.deleteButton,
                                busy && styles.disabledButton,
                            ]}
                            disabled={busy}
                            onPress={() => handleDelete(app)}
                        >
                            <Text style={styles.deleteText}>
                                {isDeleting ? "Deleting..." : "Delete"}
                            </Text>
                        </Pressable>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.eyebrow}>
                    APPLICATION LIBRARY
                </Text>

                <Text style={styles.title}>Your apps</Text>

                <Text style={styles.subtitle}>
                    Your favorite Windows applications, all in one place.
                </Text>

                {/* Application summary */}
                <View style={styles.summaryCard}>
                    <View>
                        <Text style={styles.summaryLabel}>
                            TOTAL APPLICATIONS
                        </Text>

                        <Text style={styles.count}>
                            {apps.length}
                        </Text>

                        <Text style={styles.summaryHint}>
                            {loading
                                ? "Loading applications..."
                                : `${apps.length} saved applications`}
                        </Text>
                    </View>

                    <View style={styles.summaryIcon}>
                        <Text style={styles.gridIcon}>▦</Text>
                    </View>
                </View>

                {/* Search */}
                <View style={styles.searchBox}>
                    <Text style={styles.searchIcon}>⌕</Text>

                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search applications..."
                        placeholderTextColor={COLORS.muted}
                        style={styles.searchInput}
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="never"
                    />

                    {search.length > 0 && (
                        <Pressable onPress={() => setSearch("")}>
                            <Text style={styles.clear}>✕</Text>
                        </Pressable>
                    )}
                </View>

                {/* Recent applications */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        RECENT APPS
                    </Text>

                    <Text style={styles.resultCount}>
                        {recentAppItems.length} recent
                    </Text>
                </View>

                {recentAppItems.length === 0 ? (
                    <View style={styles.recentEmpty}>
                        <Text style={styles.recentEmptyText}>
                            Apps you launch will appear here. Your last five
                            launched apps are saved on this device.
                        </Text>
                    </View>
                ) : (
                    recentAppItems.map((app) =>
                        renderAppCard(app, true)
                    )
                )}

                {/* All applications */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        ALL APPLICATIONS
                    </Text>

                    <Text style={styles.resultCount}>
                        {filteredApps.length} apps
                    </Text>
                </View>

                {loading && (
                    <View style={styles.messageCard}>
                        <ActivityIndicator
                            size="large"
                            color={COLORS.purple}
                        />

                        <Text style={styles.messageText}>
                            Loading your apps...
                        </Text>
                    </View>
                )}

                {!loading && !!error && (
                    <View style={styles.messageCard}>
                        <Text style={styles.errorTitle}>
                            Unable to load apps
                        </Text>

                        <Text style={styles.messageText}>
                            {error}
                        </Text>

                        <Pressable
                            style={styles.retryButton}
                            onPress={() => void loadApps()}
                        >
                            <Text style={styles.retryText}>
                                Try again
                            </Text>
                        </Pressable>
                    </View>
                )}

                {!loading &&
                    !error &&
                    filteredApps.map((app) => renderAppCard(app))}

                {!loading &&
                    !error &&
                    filteredApps.length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>⌕</Text>

                            <Text style={styles.emptyTitle}>
                                {apps.length === 0
                                    ? "No applications yet"
                                    : "No apps found"}
                            </Text>

                            <Text style={styles.emptyText}>
                                {apps.length === 0
                                    ? "Add an application to your Windows app library."
                                    : "Try another name or clear your search."}
                            </Text>
                        </View>
                    )}

                {/* Add application */}
                <Pressable
                    style={styles.addButton}
                    onPress={() => router.push("/apps/add")}
                >
                    <Text style={styles.addButtonText}>
                        ＋ Add application
                    </Text>
                </Pressable>

                {/* Quick actions */}
                <View style={styles.quickActions}>
                    <Text style={styles.sectionTitle}>
                        QUICK ACTIONS
                    </Text>

                    <View style={styles.quickActionsRow}>
                        <Pressable
                            style={styles.quickActionButton}
                            onPress={() => router.push("/apps/add")}
                        >
                            <Text style={styles.quickActionIcon}>＋</Text>
                            <Text style={styles.quickActionText}>
                                Add App
                            </Text>
                        </Pressable>

                        <Pressable
                            style={styles.quickActionButton}
                            onPress={() => void loadApps()}
                            disabled={loading}
                        >
                            <Text style={styles.quickActionIcon}>↻</Text>
                            <Text style={styles.quickActionText}>
                                Refresh Apps
                            </Text>
                        </Pressable>

                        <Pressable
                            style={styles.quickActionButton}
                            onPress={() => router.push("/connection")}
                        >
                            <Text style={styles.quickActionIcon}>⌁</Text>
                            <Text style={styles.quickActionText}>
                                Connection
                            </Text>
                        </Pressable>
                    </View>
                </View>

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
    if (
        value.includes("browser") ||
        value.includes("brave") ||
        value.includes("edge") ||
        value.includes("chrome")
    ) {
        return "🌐";
    }
    if (value.includes("code") || value.includes("studio")) {
        return "💻";
    }
    if (
        value.includes("music") ||
        value.includes("spotify")
    ) {
        return "🎵";
    }
    if (value.includes("calculator")) return "🧮";
    if (value.includes("paint")) return "🎨";

    return "🖥️";
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },

    content: {
        padding: 22,
        paddingTop: 30,
        paddingBottom: 36,
    },

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

    realAppIcon: {
        width: 32,
        height: 32,
    },

    appEmoji: {
        fontSize: 22,
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

    summaryHint: {
        color: COLORS.muted,
        fontSize: 11,
        marginTop: 3,
    },

    summaryIcon: {
        width: 54,
        height: 54,
        borderRadius: 16,
        backgroundColor: "#242846",
        alignItems: "center",
        justifyContent: "center",
    },

    gridIcon: {
        color: COLORS.purple,
        fontSize: 29,
    },

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

    searchIcon: {
        color: COLORS.muted,
        fontSize: 25,
        marginRight: 8,
    },

    searchInput: {
        flex: 1,
        color: COLORS.white,
        fontSize: 13,
        paddingVertical: 15,
    },

    clear: {
        color: COLORS.muted,
        padding: 6,
    },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 13,
        marginTop: 4,
    },

    sectionTitle: {
        color: COLORS.muted,
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 1.4,
    },

    resultCount: {
        color: COLORS.muted,
        fontSize: 11,
    },

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

    appEmoji: {
        fontSize: 22,
    },

    appInfo: {
        flex: 1,
        minWidth: 0,
    },

    appName: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: "700",
    },

    appPath: {
        color: COLORS.muted,
        fontSize: 10,
        marginTop: 4,
    },

    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 7,
    },

    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.green,
        marginRight: 5,
    },

    statusText: {
        color: COLORS.green,
        fontSize: 9,
    },

    recentStatus: {
        color: COLORS.muted,
        fontSize: 10,
        marginTop: 6,
    },

    cardActions: {
        alignItems: "stretch",
        gap: 8,
        marginLeft: 6,
    },

    launchButton: {
        backgroundColor: "#252A46",
        borderRadius: 9,
        paddingHorizontal: 10,
        paddingVertical: 9,
        alignItems: "center",
    },

    deleteButton: {
        backgroundColor: "#3A2028",
        borderRadius: 9,
        paddingHorizontal: 10,
        paddingVertical: 8,
        alignItems: "center",
    },

    disabledButton: {
        opacity: 0.55,
    },

    launchText: {
        color: COLORS.purple,
        fontSize: 10,
        fontWeight: "700",
    },

    deleteText: {
        color: COLORS.red,
        fontSize: 10,
        fontWeight: "700",
    },

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

    errorTitle: {
        color: COLORS.red,
        fontSize: 15,
        fontWeight: "700",
    },

    retryButton: {
        backgroundColor: "#252A46",
        borderRadius: 9,
        paddingHorizontal: 18,
        paddingVertical: 10,
        marginTop: 16,
    },

    retryText: {
        color: COLORS.purple,
        fontSize: 12,
        fontWeight: "700",
    },

    emptyState: {
        alignItems: "center",
        paddingVertical: 35,
        paddingHorizontal: 16,
        backgroundColor: COLORS.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    emptyIcon: {
        color: COLORS.muted,
        fontSize: 32,
    },

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

    recentEmpty: {
        backgroundColor: COLORS.card,
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: 14,
        padding: 16,
        marginBottom: 22,
    },

    recentEmptyText: {
        color: COLORS.muted,
        fontSize: 12,
        lineHeight: 18,
    },

    addButton: {
        backgroundColor: COLORS.purple,
        borderRadius: 13,
        alignItems: "center",
        padding: 16,
        marginTop: 12,
    },

    addButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },

    quickActions: {
        marginTop: 24,
        marginBottom: 8,
    },

    quickActionsRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 13,
    },

    quickActionButton: {
        flex: 1,
        minHeight: 88,
        padding: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.card,
        justifyContent: "center",
        alignItems: "center",
    },

    quickActionIcon: {
        color: COLORS.purple,
        fontSize: 23,
        marginBottom: 7,
    },

    quickActionText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: "600",
        textAlign: "center",
    },

    footer: {
        color: "#596174",
        fontSize: 9,
        letterSpacing: 1,
        textAlign: "center",
        marginTop: 26,
    },
});
