
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const BG = "#0B0D14";
const CARD = "#151925";
const PURPLE = "#7785FF";
const MUTED = "#9299AA";
const WHITE = "#F5F6FA";

export default function UnlockScreen() {
    const handleUnlock = () => {
        Alert.alert(
            "DeskPilot Unlocked",
            "Demo mode: PIN verification and secure storage will be added later.",
            [
                {
                    text: "Continue",
                    onPress: () => router.replace("/(tabs)"),
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={BG} />

            <View style={styles.top}>
                <View style={styles.logo}>
                    <Ionicons name="laptop-outline" size={30} color={PURPLE} />
                </View>

                <Text style={styles.brand}>DeskPilot</Text>
                <Text style={styles.subtitle}>YOUR LAPTOP, UNDER CONTROL</Text>
            </View>

            <View style={styles.lockCircle}>
                <Ionicons name="shield-checkmark" size={48} color={PURPLE} />
            </View>

            <Text style={styles.title}>You're all set!</Text>

            <Text style={styles.description}>
                Your PIN setup is complete. You're ready to manage your laptop
                remotely with DeskPilot.
            </Text>

            <View style={styles.statusCard}>
                <View style={styles.statusIcon}>
                    <Ionicons name="checkmark-circle" size={24} color="#55D6A2" />
                </View>

                <View style={styles.statusText}>
                    <Text style={styles.statusTitle}>PIN setup completed</Text>
                    <Text style={styles.statusSubtitle}>
                        Demo setup finished successfully
                    </Text>
                </View>

                <Ionicons name="checkmark" size={20} color="#55D6A2" />
            </View>

            <View style={styles.infoCard}>
                <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color={PURPLE}
                />
                <Text style={styles.infoText}>
                    Secure PIN saving and verification will be implemented later.
                </Text>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleUnlock}
                activeOpacity={0.85}
            >
                <Text style={styles.buttonText}>Open Dashboard</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.replace("/")}
            >
                <Ionicons name="arrow-back" size={16} color={MUTED} />
                <Text style={styles.backText}>Back to Lock Screen</Text>
            </TouchableOpacity>

            <Text style={styles.footer}>DESKPILOT • REMOTE CONTROL MADE SIMPLE</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG,
        paddingHorizontal: 25,
        justifyContent: "center",
    },
    top: {
        alignItems: "center",
        marginBottom: 35,
    },
    logo: {
        width: 62,
        height: 62,
        borderRadius: 20,
        backgroundColor: "#1B2033",
        borderWidth: 1,
        borderColor: "#303957",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    brand: {
        color: WHITE,
        fontSize: 25,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
    subtitle: {
        color: MUTED,
        fontSize: 9,
        letterSpacing: 2,
        marginTop: 6,
    },
    lockCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#191E32",
        borderWidth: 1,
        borderColor: "#353E68",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    title: {
        color: WHITE,
        fontSize: 29,
        fontWeight: "800",
        textAlign: "center",
    },
    description: {
        color: MUTED,
        fontSize: 14,
        lineHeight: 22,
        textAlign: "center",
        marginTop: 12,
        marginBottom: 28,
    },
    statusCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: CARD,
        borderWidth: 1,
        borderColor: "#292F40",
        borderRadius: 17,
        padding: 16,
        marginBottom: 14,
    },
    statusIcon: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: "#1A302F",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    statusText: {
        flex: 1,
    },
    statusTitle: {
        color: WHITE,
        fontSize: 14,
        fontWeight: "700",
    },
    statusSubtitle: {
        color: MUTED,
        fontSize: 11,
        marginTop: 5,
    },
    infoCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#171B2B",
        borderRadius: 13,
        padding: 13,
        gap: 10,
        marginBottom: 25,
    },
    infoText: {
        flex: 1,
        color: "#B8BED0",
        fontSize: 11,
        lineHeight: 17,
    },
    button: {
        height: 54,
        backgroundColor: PURPLE,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },
    backButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 7,
        marginTop: 20,
    },
    backText: {
        color: MUTED,
        fontSize: 12,
    },
    footer: {
        color: "#5D6478",
        fontSize: 9,
        textAlign: "center",
        letterSpacing: 1,
        marginTop: 36,
    },
});
