
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
  red: "#F97066",
};

export default function LockScreen() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  function pressKey(key: string) {
    if (key === "delete") {
      setPin((current) => current.slice(0, -1));
      return;
    }

    if (pin.length >= 4 || loading) return;

    const nextPin = pin + key;
    setPin(nextPin);

    if (nextPin.length === 4) {
      setLoading(true);

      // UI preview only: actual PIN verification baad mein.
      setTimeout(() => {
        setLoading(false);
        setPin("");

        Alert.alert(
          "Demo PIN",
          "PIN verification abhi connect nahi hai. Dashboard preview khol rahe hain.",
          [
            {
              text: "Continue",
              onPress: () => router.replace("/home"),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );
      }, 250);
    }
  }

  return (
    <View style={s.screen}>
      <View style={s.top}>
        <View style={s.logo}>
          <Text style={s.logoText}>D</Text>
        </View>
        <Text style={s.brand}>DESKPILOT</Text>
        <Text style={s.tagline}>YOUR LAPTOP, UNDER YOUR CONTROL</Text>
      </View>

      <View style={s.center}>
        <View style={s.lockIcon}>
          <Text style={s.lockEmoji}>⌑</Text>
        </View>

        <Text style={s.title}>Welcome back</Text>
        <Text style={s.subtitle}>
          Enter your 4-digit PIN to continue
        </Text>

        <View style={s.indicators}>
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={[
                s.indicator,
                pin.length > index && s.indicatorFilled,
              ]}
            />
          ))}
        </View>

        <View style={s.keypad}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "help", "0", "delete"].map(
            (key) => (
              <Pressable
                key={key}
                style={s.key}
                onPress={() => {
                  if (key === "help") {
                    router.push("/setup-pin");
                  } else {
                    pressKey(key);
                  }
                }}
              >
                <Text style={s.keyText}>
                  {key === "delete"
                    ? "⌫"
                    : key === "help"
                      ? "?"
                      : key}
                </Text>
              </Pressable>
            )
          )}
        </View>

        <Pressable
          onPress={() => router.push("/setup-pin")}
          style={s.forgot}
        >
          <Text style={s.forgotText}>Forgot PIN?  Set up again</Text>
        </Pressable>
      </View>

      <View style={s.bottom}>
        <View style={s.secureRow}>
          <Text style={s.secureIcon}>◆</Text>
          <Text style={s.secureText}>YOUR ACCESS, YOUR CONTROL</Text>
        </View>
        <Text style={s.version}>DESKPILOT • UI PREVIEW</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
    paddingHorizontal: 25,
    paddingTop: 48,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  top: { alignItems: "center" },
  logo: {
    width: 53,
    height: 53,
    borderRadius: 17,
    backgroundColor: "#252A46",
    borderWidth: 1,
    borderColor: "#454D7C",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { color: C.purple, fontSize: 27, fontWeight: "900" },
  brand: {
    color: C.white,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 3,
    marginTop: 12,
  },
  tagline: {
    color: C.muted,
    fontSize: 8,
    letterSpacing: 1.3,
    marginTop: 6,
  },
  center: { alignItems: "center" },
  lockIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  lockEmoji: { color: C.purple, fontSize: 36 },
  title: { color: C.white, fontSize: 25, fontWeight: "800" },
  subtitle: {
    color: C.muted,
    fontSize: 12,
    marginTop: 9,
    textAlign: "center",
  },
  indicators: {
    flexDirection: "row",
    gap: 17,
    marginTop: 28,
    marginBottom: 28,
  },
  indicator: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#252A35",
    borderWidth: 1,
    borderColor: "#41485B",
  },
  indicatorFilled: {
    backgroundColor: C.purple,
    borderColor: C.purple,
  },
  keypad: {
    width: "100%",
    maxWidth: 310,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  key: {
    width: "29%",
    height: 54,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.card,
    alignItems: "center",
    justifyContent: "center",
  },
  keyText: { color: C.white, fontSize: 21, fontWeight: "600" },
  forgot: { marginTop: 24, padding: 8 },
  forgotText: { color: C.purple, fontSize: 12, fontWeight: "600" },
  bottom: { alignItems: "center" },
  secureRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  secureIcon: { color: C.purple, fontSize: 10 },
  secureText: {
    color: C.muted,
    fontSize: 9,
    letterSpacing: 1.2,
    fontWeight: "700",
  },
  version: {
    color: "#596174",
    fontSize: 9,
    marginTop: 12,
    letterSpacing: 1,
  },
});
