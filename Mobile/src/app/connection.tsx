
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    ScrollView,
    StatusBar,
    Alert,
    Keyboard,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const C = {
    bg: "#0B0D12",
    card: "#151922",
    border: "#292F3D",
    purple: "#7785FF",
    white: "#F5F7FA",
    muted: "#9299AA",
    green: "#55D6A2",
    red: "#FF718B",
};

export default function ConnectionScreen() {
    const [ip, setIp] = useState("192.168.1.100");
    const [port, setPort] = useState("3000");
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConnect = () => {
        Keyboard.dismiss();

        if (!ip.trim()) {
            Alert.alert("IP address required", "Enter your laptop's IP address.");
            return;
        }

        const portNumber = Number(port);

        if (
            !Number.isInteger(portNumber) ||
            portNumber < 1 ||
            portNumber > 65535
        ) {
            Alert.alert("Invalid port", "Enter a port between 1 and 65535.");
            return;
        }

        // UI demo only: no real laptop connection is made.
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setConnected(true);

            Alert.alert(
                "Demo connection",
                "UI preview only. A real connection will be added when we integrate the backend."
            );
        }, 700);
    };

    const handleDisconnect = () => {
        setConnected(false);
        Alert.alert("Disconnected", "Demo connection has been stopped.");
    };

    return (
        <View style={s.screen}>
            <StatusBar barStyle="light-content" backgroundColor={C.bg} />

            <ScrollView
                contentContainerStyle={s.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={s.header}>
                    <Pressable style={s.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={22} color={C.white} />
                    </Pressable>

                    <View style={s.headerText}>
                        <Text style={s.eyebrow}>DEVICE MANAGEMENT</Text>
                        <Text style={s.title}>Connection</Text>
                    </View>
                </View>

                <Text style={s.subtitle}>
                    Connect DeskPilot to your Windows laptop on the same network.
                </Text>

                {/* Laptop status card */}
                <View style={s.deviceCard}>
                    <View style={s.deviceTop}>
                        <View style={s.laptopIcon}>
                            <Ionicons
                                name="laptop-outline"
                                size={35}
                                color={C.purple}
                            />
                        </View>

                        <View style={s.deviceInfo}>
                            <Text style={s.deviceName}>My Windows Laptop</Text>
                            <Text style={s.deviceType}>Windows • Remote device</Text>
                        </View>

                        <View
                            style={[
                                s.statusDot,
                                connected && s.statusDotConnected,
                            ]}
                        />
                    </View>

                    <View style={s.deviceDivider} />

                    <View style={s.statusRow}>
                        <View>
                            <Text style={s.smallLabel}>CONNECTION STATUS</Text>
                            <Text
                                style={[
                                    s.statusText,
                                    connected && { color: C.green },
                                ]}
                            >
                                {connected ? "Connected (Demo)" : "Not connected"}
                            </Text>
                        </View>

                        <View
                            style={[
                                s.statusBadge,
                                connected && s.statusBadgeConnected,
                            ]}
                        >
                            <Text
                                style={[
                                    s.statusBadgeText,
                                    connected && { color: C.green },
                                ]}
                            >
                                {connected ? "DEMO" : "OFFLINE"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Connection form */}
                <Text style={s.sectionTitle}>CONNECTION DETAILS</Text>

                <View style={s.formCard}>
                    <Text style={s.inputLabel}>Laptop IP Address</Text>

                    <View style={s.inputWrapper}>
                        <Ionicons
                            name="globe-outline"
                            size={19}
                            color={C.muted}
                        />

                        <TextInput
                            style={s.input}
                            value={ip}
                            onChangeText={setIp}
                            placeholder="e.g. 192.168.1.100"
                            placeholderTextColor="#697184"
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="numbers-and-punctuation"
                        />
                    </View>

                    <Text style={s.helper}>
                        Find the IPv4 address on your Windows laptop.
                    </Text>

                    <Text style={[s.inputLabel, { marginTop: 22 }]}>
                        Server Port
                    </Text>

                    <View style={s.inputWrapper}>
                        <Ionicons
                            name="git-network-outline"
                            size={19}
                            color={C.muted}
                        />

                        <TextInput
                            style={s.input}
                            value={port}
                            onChangeText={setPort}
                            placeholder="3000"
                            placeholderTextColor="#697184"
                            keyboardType="number-pad"
                            maxLength={5}
                        />
                    </View>

                    <Text style={s.helper}>
                        Use the port configured for your DeskPilot backend.
                    </Text>

                    <View style={s.tipBox}>
                        <Ionicons
                            name="information-circle-outline"
                            size={20}
                            color={C.purple}
                        />
                        <Text style={s.tipText}>
                            Your phone and laptop should be connected to the same Wi-Fi
                            network for local network access.
                        </Text>
                    </View>
                </View>

                {/* Connect button */}
                <Pressable
                    style={[
                        s.primaryButton,
                        loading && { opacity: 0.7 },
                    ]}
                    onPress={connected ? handleDisconnect : handleConnect}
                    disabled={loading}
                >
                    <Ionicons
                        name={connected ? "close-circle-outline" : "link-outline"}
                        size={21}
                        color="#FFFFFF"
                    />

                    <Text style={s.primaryButtonText}>
                        {loading
                            ? "Connecting..."
                            : connected
                                ? "Disconnect"
                                : "Connect to Laptop"}
                    </Text>
                </Pressable>

                {/* Help card */}
                <Pressable
                    style={s.helpCard}
                    onPress={() =>
                        Alert.alert(
                            "Find your laptop IP",
                            "On Windows, open Command Prompt and run:\n\nipconfig\n\nLook for IPv4 Address under your active Wi-Fi adapter."
                        )
                    }
                >
                    <View style={s.helpIcon}>
                        <Ionicons
                            name="help-circle-outline"
                            size={23}
                            color={C.purple}
                        />
                    </View>

                    <View style={s.helpInfo}>
                        <Text style={s.helpTitle}>Need help connecting?</Text>
                        <Text style={s.helpSubtitle}>
                            Learn how to find your laptop IP address.
                        </Text>
                    </View>

                    <Ionicons
                        name="chevron-forward"
                        size={19}
                        color={C.muted}
                    />
                </Pressable>

                <Text style={s.footer}>
                    DESKPILOT • SECURE DEVICE CONTROL
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
        paddingHorizontal: 22,
        paddingTop: 24,
        paddingBottom: 35,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
    },

    backButton: {
        width: 43,
        height: 43,
        borderRadius: 13,
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.border,
        alignItems: "center",
        justifyContent: "center",
    },

    headerText: {
        flex: 1,
    },

    eyebrow: {
        color: C.purple,
        fontSize: 9,
        fontWeight: "800",
        letterSpacing: 1.7,
    },

    title: {
        color: C.white,
        fontSize: 27,
        fontWeight: "800",
        marginTop: 3,
    },

    subtitle: {
        color: C.muted,
        fontSize: 13,
        lineHeight: 21,
        marginTop: 15,
        marginBottom: 23,
    },

    deviceCard: {
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 19,
        padding: 17,
    },

    deviceTop: {
        flexDirection: "row",
        alignItems: "center",
    },

    laptopIcon: {
        width: 57,
        height: 57,
        borderRadius: 16,
        backgroundColor: "#252A46",
        borderWidth: 1,
        borderColor: "#363F68",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 13,
    },

    deviceInfo: {
        flex: 1,
    },

    deviceName: {
        color: C.white,
        fontSize: 14,
        fontWeight: "700",
    },

    deviceType: {
        color: C.muted,
        fontSize: 11,
        marginTop: 6,
    },

    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: C.red,
    },

    statusDotConnected: {
        backgroundColor: C.green,
    },

    deviceDivider: {
        height: 1,
        backgroundColor: C.border,
        marginVertical: 17,
    },

    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    smallLabel: {
        color: C.muted,
        fontSize: 9,
        fontWeight: "700",
        letterSpacing: 1,
    },

    statusText: {
        color: C.red,
        fontSize: 13,
        fontWeight: "700",
        marginTop: 7,
    },

    statusBadge: {
        backgroundColor: "#30212A",
        borderRadius: 7,
        paddingHorizontal: 9,
        paddingVertical: 6,
    },

    statusBadgeConnected: {
        backgroundColor: "#18352E",
    },

    statusBadgeText: {
        color: C.red,
        fontSize: 9,
        fontWeight: "800",
        letterSpacing: 0.7,
    },

    sectionTitle: {
        color: C.muted,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.5,
        marginTop: 27,
        marginBottom: 12,
    },

    formCard: {
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 18,
        padding: 17,
    },

    inputLabel: {
        color: C.white,
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 10,
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
        height: 51,
        paddingHorizontal: 13,
        backgroundColor: C.bg,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 12,
    },

    input: {
        flex: 1,
        color: C.white,
        fontSize: 13,
        paddingVertical: 0,
    },

    helper: {
        color: C.muted,
        fontSize: 10,
        lineHeight: 16,
        marginTop: 8,
    },

    tipBox: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
        backgroundColor: "#1B2034",
        borderRadius: 12,
        padding: 12,
        marginTop: 23,
    },

    tipText: {
        flex: 1,
        color: "#B7BED1",
        fontSize: 11,
        lineHeight: 17,
    },

    primaryButton: {
        height: 54,
        borderRadius: 15,
        backgroundColor: C.purple,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginTop: 20,
    },

    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },

    helpCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 15,
        padding: 13,
        marginTop: 15,
    },

    helpIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#252A46",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 11,
    },

    helpInfo: {
        flex: 1,
    },

    helpTitle: {
        color: C.white,
        fontSize: 12,
        fontWeight: "700",
    },

    helpSubtitle: {
        color: C.muted,
        fontSize: 10,
        marginTop: 5,
    },

    footer: {
        color: "#596174",
        fontSize: 8,
        letterSpacing: 1,
        textAlign: "center",
        marginTop: 27,
    },
});
