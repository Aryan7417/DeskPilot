
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Pressable,
    Alert,
} from "react-native";
import { router } from "expo-router";
import { addApp } from "../../services/app.service";

const COLORS = {
    bg: "#0B0D12",
    card: "#151922",
    border: "#292F3D",
    purple: "#7785FF",
    white: "#F5F7FA",
    muted: "#9299AA",
    red: "#F97066",
};

export default function AddAppScreen() {
    const [name, setName] = useState("");
    const [executablePath, setExecutablePath] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const nameError = submitted && !name.trim();
    const pathError =
        submitted &&
        (!executablePath.trim() ||
            !/^[a-zA-Z]:\\/.test(executablePath.trim()));

    async function saveApp() {
        setSubmitted(true);

        const cleanName = name.trim();
        const cleanPath = executablePath.trim();

        if (!cleanName || !/^[a-zA-Z]:\\/.test(cleanPath)) {
            return;
        }

        if (loading) return;

        setLoading(true);

        try {
            await addApp(cleanName, cleanPath);

            Alert.alert(
                "Success",
                "Application DeskPilot mein save ho gayi!",
                [
                    {
                        text: "OK",
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error) {
            Alert.alert(
                "Unable to save",
                error instanceof Error
                    ? error.message
                    : "Backend se connection nahi ho paya."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <Pressable onPress={() => router.back()}>
                <Text style={styles.back}>‹  Back to Apps</Text>
            </Pressable>

            <Text style={styles.eyebrow}>APPLICATION LIBRARY</Text>
            <Text style={styles.title}>Add application</Text>
            <Text style={styles.subtitle}>
                Add a Windows app to your DeskPilot library.
            </Text>

            <View style={styles.card}>
                <Text style={styles.label}>APPLICATION NAME</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Calculator"
                    placeholderTextColor={COLORS.muted}
                    style={[styles.input, nameError && styles.inputError]}
                    autoCapitalize="words"
                />
                {nameError && (
                    <Text style={styles.error}>
                        Application name is required.
                    </Text>
                )}

                <Text style={[styles.label, styles.secondLabel]}>
                    EXECUTABLE PATH
                </Text>
                <TextInput
                    value={executablePath}
                    onChangeText={setExecutablePath}
                    placeholder={"C:\\Windows\\System32\\calc.exe"}
                    placeholderTextColor={COLORS.muted}
                    style={[styles.input, pathError && styles.inputError]}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {pathError && (
                    <Text style={styles.error}>
                        Enter a valid absolute Windows path, e.g. C:\Windows\System32\calc.exe
                    </Text>
                )}

                <Text style={styles.helper}>
                    Use the full path to the application's .exe file on your laptop.
                </Text>

                <View style={styles.tip}>
                    <Text style={styles.tipTitle}>
                        ⓘ Finding the right path
                    </Text>
                    <Text style={styles.tipText}>
                        Right-click the application's shortcut, choose Open file
                        location, then copy the full path of its executable.
                    </Text>
                </View>

                <Pressable
                    onPress={saveApp}
                    disabled={loading}
                    style={[styles.primary, loading && { opacity: 0.6 }]}
                >
                    <Text style={styles.primaryText}>
                        {loading ? "Saving..." : "＋ Save application"}
                    </Text>
                </Pressable>

                <Pressable onPress={() => router.back()} style={styles.cancel}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
            </View>

            <Text style={styles.footer}>
                DESKPILOT • YOUR LAPTOP, UNDER YOUR CONTROL
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.bg },
    content: { padding: 22, paddingTop: 28, paddingBottom: 42 },
    back: { color: COLORS.muted, fontSize: 14, marginBottom: 30 },
    eyebrow: {
        color: COLORS.purple,
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 2,
    },
    title: {
        color: COLORS.white,
        fontSize: 30,
        fontWeight: "700",
        marginTop: 10,
    },
    subtitle: {
        color: COLORS.muted,
        fontSize: 14,
        lineHeight: 22,
        marginTop: 8,
        marginBottom: 26,
    },
    card: {
        backgroundColor: COLORS.card,
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: 22,
        padding: 18,
    },
    label: {
        color: COLORS.muted,
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1.1,
        marginBottom: 10,
    },
    secondLabel: { marginTop: 23 },
    input: {
        backgroundColor: COLORS.bg,
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: 12,
        color: COLORS.white,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontSize: 14,
    },
    inputError: { borderColor: COLORS.red },
    error: { color: COLORS.red, fontSize: 12, marginTop: 7 },
    helper: {
        color: COLORS.muted,
        fontSize: 12,
        lineHeight: 19,
        marginTop: 10,
    },
    tip: {
        backgroundColor: "#1B2030",
        borderColor: "#343D64",
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
        marginTop: 22,
        marginBottom: 24,
    },
    tipTitle: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 8,
    },
    tipText: { color: COLORS.muted, fontSize: 12, lineHeight: 19 },
    primary: {
        backgroundColor: COLORS.purple,
        borderRadius: 13,
        padding: 16,
        alignItems: "center",
    },
    primaryText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
    cancel: {
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: 13,
        padding: 15,
        alignItems: "center",
        marginTop: 10,
    },
    cancelText: { color: COLORS.white, fontSize: 14, fontWeight: "600" },
    footer: {
        color: "#596174",
        fontSize: 9,
        letterSpacing: 1.5,
        textAlign: "center",
        marginTop: 26,
    },
});
