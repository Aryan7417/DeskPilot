
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
} from "react-native";
import { router } from "expo-router";

const C = {
    bg: "#0B0D12",
    card: "#151922",
    border: "#292F3D",
    purple: "#7785FF",
    white: "#F5F7FA",
    muted: "#9299AA",
    green: "#4ADE80",
};

export default function HomeScreen() {
    return (
        <View style={s.screen}>
            <ScrollView
                contentContainerStyle={s.content}
                showsVerticalScrollIndicator={false}
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

                {/* Laptop status */}
                <View style={s.laptopCard}>
                    <View style={s.laptopTop}>
                        <View style={s.deviceIcon}>
                            <Text style={s.deviceEmoji}>▣</Text>
                        </View>

                        <View style={s.statusBadge}>
                            <View style={s.statusDot} />
                            <Text style={s.statusText}>PREVIEW MODE</Text>
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
                            <Text style={s.detailValue}>Not connected</Text>
                        </View>

                        <View style={s.detailItem}>
                            <Text style={s.detailLabel}>DEVICE</Text>
                            <Text style={s.detailValue}>Windows PC</Text>
                        </View>
                    </View>

                    <Pressable
                        style={s.connectButton}
                        onPress={() => router.push("/connection")}
                    >
                        <Text style={s.connectText}>Configure connection  →</Text>
                    </Pressable>
                </View>

                {/* Quick actions */}
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
                        <Text style={s.recentTitle}>Welcome to DeskPilot</Text>
                        <Text style={s.recentDescription}>
                            Your dashboard is ready to explore.
                        </Text>
                    </View>
                    <Text style={s.time}>NOW</Text>
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
        backgroundColor: C.green,
        marginRight: 6,
    },
    statusText: {
        color: C.purple,
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
