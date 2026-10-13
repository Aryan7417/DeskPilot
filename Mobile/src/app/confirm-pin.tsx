
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

const C = {
    bg: "#0B0D12",
    card: "#151922",
    border: "#292F3D",
    purple: "#7785FF",
    white: "#F5F7FA",
    muted: "#9299AA",
    red: "#F97066",
};

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "delete", "0", "confirm"];

export default function ConfirmPinScreen() {
    const { pin: originalPin } = useLocalSearchParams<{ pin: string }>();
    const [confirmPin, setConfirmPin] = useState("");

    function handleKey(key: string) {
        if (key === "delete") {
            setConfirmPin((current) => current.slice(0, -1));
            return;
        }

        if (key === "confirm") {
            if (confirmPin.length !== 4) {
                Alert.alert("PIN required", "Enter all 4 digits first.");
                return;
            }

            if (confirmPin !== originalPin) {
                setConfirmPin("");
                Alert.alert("PIN mismatch", "PINs match nahi karte. Dobara try karo.");
                return;
            }

            Alert.alert(
                "PIN confirmed",
                "UI preview complete. PIN saving baad mein implement karenge.",
                [
                    {
                        text: "Continue",
                        onPress: () => router.replace("/unlock"),
                    },
                ]
            );
            return;
        }

        if (confirmPin.length < 4) {
            setConfirmPin((current) => current + key);
        }
    }

    return (
        <View style={s.screen}>
            <Pressable onPress={() => router.back()} style={s.back}>
                <Text style={s.backText}>‹  Back</Text>
            </Pressable>

            <View style={s.brandBlock}>
                <View style={s.logo}>
                    <Text style={s.logoText}>D</Text>
                </View>
                <Text style={s.brand}>DESKPILOT</Text>
                <Text style={s.eyebrow}>SECURITY SETUP</Text>
            </View>

            <View style={s.main}>
                <Text style={s.title}>Confirm your PIN</Text>
                <Text style={s.subtitle}>
                    Enter the same 4-digit PIN one more time.
                </Text>

                <View style={s.indicators}>
                    {[0, 1, 2, 3].map((i) => (
                        <View
                            key={i}
                            style={[
                                s.dot,
                                confirmPin.length > i && s.dotFilled,
                            ]}
                        />
                    ))}
                </View>

                <View style={s.keypad}>
                    {KEYS.map((key) => (
                        <Pressable
                            key={key}
                            onPress={() => handleKey(key)}
                            style={s.key}
                        >
                            <Text style={[s.keyText, key === "confirm" && s.confirmText]}>
                                {key === "delete" ? "⌫" : key === "confirm" ? "✓" : key}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            <Text style={s.footer}>DESKPILOT • PRIVATE BY DESIGN</Text>
        </View>
    );
}

const s = StyleSheet.create({
    screen: { flex: 1, backgroundColor: C.bg, padding: 24, paddingTop: 40, paddingBottom: 25, justifyContent: "space-between" },
    back: { alignSelf: "flex-start", paddingVertical: 8 },
    backText: { color: C.muted, fontSize: 14 },
    brandBlock: { alignItems: "center" },
    logo: { width: 50, height: 50, borderRadius: 16, backgroundColor: "#252A46", borderWidth: 1, borderColor: "#454D7C", alignItems: "center", justifyContent: "center" },
    logoText: { color: C.purple, fontSize: 26, fontWeight: "900" },
    brand: { color: C.white, fontSize: 16, fontWeight: "900", letterSpacing: 3, marginTop: 10 },
    eyebrow: { color: C.purple, fontSize: 9, fontWeight: "800", letterSpacing: 2, marginTop: 8 },
    main: { alignItems: "center" },
    title: { color: C.white, fontSize: 24, fontWeight: "800" },
    subtitle: { color: C.muted, fontSize: 12, textAlign: "center", marginTop: 9 },
    indicators: { flexDirection: "row", gap: 18, marginTop: 28, marginBottom: 28 },
    dot: { width: 13, height: 13, borderRadius: 7, backgroundColor: "#252A35", borderWidth: 1, borderColor: "#41485B" },
    dotFilled: { backgroundColor: C.purple, borderColor: C.purple },
    keypad: { width: "100%", maxWidth: 310, flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12 },
    key: { width: "29%", height: 53, borderRadius: 15, borderWidth: 1, borderColor: C.border, backgroundColor: C.card, alignItems: "center", justifyContent: "center" },
    keyText: { color: C.white, fontSize: 21, fontWeight: "600" },
    confirmText: { color: C.purple, fontSize: 25 },
    footer: { color: "#596174", fontSize: 9, letterSpacing: 1.2, textAlign: "center" },
});
