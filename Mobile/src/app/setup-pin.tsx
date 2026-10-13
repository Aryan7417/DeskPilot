
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Alert,
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

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "delete", "0", "next"];

export default function SetupPinScreen() {
    const [pin, setPin] = useState("");

    function handleKey(key: string) {
        if (key === "delete") {
            setPin((current) => current.slice(0, -1));
            return;
        }

        if (key === "next") {
            if (pin.length !== 4) {
                Alert.alert("PIN required", "Please enter all 4 digits.");
                return;
            }

            router.push({
                pathname: "/confirm-pin",
                params: { pin },
            });
            return;
        }

        if (pin.length < 4) {
            setPin((current) => current + key);
        }
    }

    return (
        <View style={s.screen}>
            <Pressable onPress={() => router.back()} style={s.backButton}>
                <Text style={s.backText}>‹  Back</Text>
            </Pressable>

            <View style={s.header}>
                <View style={s.logo}>
                    <Text style={s.logoText}>D</Text>
                </View>
                <Text style={s.brand}>DESKPILOT</Text>
                <Text style={s.eyebrow}>SECURITY SETUP</Text>
            </View>

            <View style={s.main}>
                <Text style={s.title}>Create your PIN</Text>
                <Text style={s.subtitle}>
                    Choose a 4-digit PIN to protect access to DeskPilot.
                </Text>

                <View style={s.indicators}>
                    {[0, 1, 2, 3].map((i) => (
                        <View
                            key={i}
                            style={[
                                s.dot,
                                pin.length > i && s.dotFilled,
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
                            <Text style={[s.keyText, key === "next" && s.nextText]}>
                                {key === "delete" ? "⌫" : key === "next" ? "→" : key}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <Text style={s.hint}>
                    Avoid easy PINs such as 1234 or 0000.
                </Text>
            </View>

            <Text style={s.footer}>DESKPILOT • PRIVATE BY DESIGN</Text>
        </View>
    );
}

const s = StyleSheet.create({
    screen: { flex: 1, backgroundColor: C.bg, padding: 24, paddingTop: 40, paddingBottom: 25, justifyContent: "space-between" },
    backButton: { alignSelf: "flex-start", paddingVertical: 8 },
    backText: { color: C.muted, fontSize: 14 },
    header: { alignItems: "center" },
    logo: { width: 50, height: 50, borderRadius: 16, backgroundColor: "#252A46", borderWidth: 1, borderColor: "#454D7C", alignItems: "center", justifyContent: "center" },
    logoText: { color: C.purple, fontSize: 26, fontWeight: "900" },
    brand: { color: C.white, fontSize: 16, fontWeight: "900", letterSpacing: 3, marginTop: 10 },
    eyebrow: { color: C.purple, fontSize: 9, fontWeight: "800", letterSpacing: 2, marginTop: 8 },
    main: { alignItems: "center" },
    title: { color: C.white, fontSize: 25, fontWeight: "800" },
    subtitle: { color: C.muted, fontSize: 12, lineHeight: 20, textAlign: "center", marginTop: 9, maxWidth: 280 },
    indicators: { flexDirection: "row", gap: 18, marginTop: 28, marginBottom: 28 },
    dot: { width: 13, height: 13, borderRadius: 7, backgroundColor: "#252A35", borderWidth: 1, borderColor: "#41485B" },
    dotFilled: { backgroundColor: C.purple, borderColor: C.purple },
    keypad: { width: "100%", maxWidth: 310, flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12 },
    key: { width: "29%", height: 53, borderRadius: 15, borderWidth: 1, borderColor: C.border, backgroundColor: C.card, alignItems: "center", justifyContent: "center" },
    keyText: { color: C.white, fontSize: 21, fontWeight: "600" },
    nextText: { color: C.purple, fontSize: 26 },
    hint: { color: C.muted, fontSize: 10, textAlign: "center", marginTop: 22 },
    footer: { color: "#596174", fontSize: 9, letterSpacing: 1.2, textAlign: "center" },
});
