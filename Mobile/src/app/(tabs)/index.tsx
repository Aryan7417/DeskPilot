
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
};

export default function HomeTab() {
    return (
        <ScrollView
            style={s.screen}
            contentContainerStyle={s.content}
            showsVerticalScrollIndicator={false}
        >
            <Text style={s.brand}>DESKPILOT</Text>
            <Text style={s.title}>Welcome back, Aryan</Text>
            <Text style={s.subtitle}>Your workspace, at a glance.</Text>

            <View style={s.laptop}>
                <Text style={s.device}>▣</Text>
                <Text style={s.laptopTitle}>My Windows Laptop</Text>
                <Text style={s.status}>●  Not connected</Text>
                <Text style={s.description}>
                    Your personal workstation
                </Text>
                <Pressable
                    style={s.secondaryButton}
                    onPress={() => router.push("/connection")}
                >
                    <Text style={s.secondaryText}>Configure connection →</Text>
                </Pressable>
            </View>

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

            <Text style={s.section}>RECENT ACTIVITY</Text>

            <View style={s.recent}>
                <Text style={s.icon}>✦</Text>
                <View style={s.recentInfo}>
                    <Text style={s.cardTitle}>Welcome to DeskPilot</Text>
                    <Text style={s.cardDescription}>
                        Your dashboard is ready to explore.
                    </Text>
                </View>
            </View>

            <Text style={s.footer}>
                DESKPILOT • YOUR LAPTOP, UNDER YOUR CONTROL
            </Text>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    screen: { flex: 1, backgroundColor: C.bg },
    content: { padding: 22, paddingTop: 35, paddingBottom: 35 },
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
    subtitle: { color: C.muted, fontSize: 12, marginTop: 7, marginBottom: 25 },
    laptop: {
        backgroundColor: C.card,
        borderColor: C.border,
        borderWidth: 1,
        borderRadius: 20,
        padding: 19,
        marginBottom: 28,
    },
    device: { color: C.purple, fontSize: 32 },
    laptopTitle: { color: C.white, fontSize: 18, fontWeight: "800", marginTop: 12 },
    status: { color: C.muted, fontSize: 12, marginTop: 10 },
    description: { color: C.muted, fontSize: 11, marginTop: 6 },
    secondaryButton: {
        backgroundColor: "#252A46",
        padding: 13,
        borderRadius: 11,
        alignItems: "center",
        marginTop: 19,
    },
    secondaryText: { color: C.purple, fontWeight: "700", fontSize: 12 },
    section: {
        color: C.white,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1.3,
        marginBottom: 14,
    },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 28 },
    card: {
        width: "48%",
        flexGrow: 1,
        minHeight: 130,
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 16,
        padding: 14,
    },
    icon: { color: C.purple, fontSize: 25, marginBottom: 12 },
    cardTitle: { color: C.white, fontSize: 13, fontWeight: "700" },
    cardDescription: { color: C.muted, fontSize: 10, marginTop: 6 },
    recent: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: C.card,
        borderColor: C.border,
        borderWidth: 1,
        borderRadius: 15,
        padding: 14,
    },
    recentInfo: { flex: 1, marginLeft: 12 },
    footer: {
        color: "#596174",
        fontSize: 8,
        letterSpacing: 1,
        textAlign: "center",
        marginTop: 26,
    },
});
