
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TouchableOpacity,
    StatusBar,
    Alert,
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
    red: "#FF718B",
};

type PinStep = "current" | "new" | "confirm";

const STEP_INFO: Record<
    PinStep,
    { title: string; subtitle: string }
> = {
    current: {
        title: "Enter current PIN",
        subtitle: "Verify your existing app PIN",
    },
    new: {
        title: "Create new PIN",
        subtitle: "Choose a new 4-digit PIN",
    },
    confirm: {
        title: "Confirm new PIN",
        subtitle: "Enter your new PIN once again",
    },
};

export default function ChangePinScreen() {
    const [step, setStep] = useState<PinStep>("current");
    const [currentPin, setCurrentPin] = useState("");
    const [newPin, setNewPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");

    const currentValue =
        step === "current"
            ? currentPin
            : step === "new"
                ? newPin
                : confirmPin;

    const setCurrentValue = (value: string) => {
        if (step === "current") setCurrentPin(value);
        else if (step === "new") setNewPin(value);
        else setConfirmPin(value);
    };

    const handleDigit = (digit: string) => {
        if (currentValue.length < 4) {
            setCurrentValue(currentValue + digit);
        }
    };

    const handleDelete = () => {
        setCurrentValue(currentValue.slice(0, -1));
    };

    const handleContinue = () => {
        if (currentValue.length !== 4) {
            Alert.alert("Incomplete PIN", "Please enter all 4 digits.");
            return;
        }

        if (step === "current") {
            // Demo only: actual current PIN verification is not implemented.
            setStep("new");
            return;
        }

        if (step === "new") {
            if (newPin === currentPin) {
                Alert.alert(
                    "Choose a different PIN",
                    "Your new PIN should be different from your current PIN."
                );
                setNewPin("");
                return;
            }

            setStep("confirm");
            return;
        }

        if (newPin !== confirmPin) {
            Alert.alert(
                "PINs don't match",
                "Please enter the same new PIN in both fields."
            );
            setConfirmPin("");
            return;
        }

        Alert.alert(
            "Demo complete",
            "Your new PIN passed the UI validation. It has not been saved yet.",
            [
                {
                    text: "Back to Settings",
                    onPress: () => router.back(),
                },
            ]
        );
    };

    const handleBack = () => {
        if (step === "confirm") {
            setConfirmPin("");
            setStep("new");
        } else if (step === "new") {
            setNewPin("");
            setStep("current");
        } else {
            router.back();
        }
    };

    return (
        <View style={s.screen}>
            <StatusBar barStyle="light-content" backgroundColor={C.bg} />

            <View style={s.header}>
                <Pressable
                    style={s.backButton}
                    onPress={handleBack}
                    hitSlop={10}
                >
                    <Ionicons name="arrow-back" size={22} color={C.white} />
                </Pressable>

                <Text style={s.headerTitle}>Change PIN</Text>

                <View style={s.headerSpacer} />
            </View>

            <View style={s.content}>
                <View style={s.iconCircle}>
                    <Ionicons
                        name="lock-closed-outline"
                        size={34}
                        color={C.purple}
                    />
                </View>

                <Text style={s.title}>{STEP_INFO[step].title}</Text>

                <Text style={s.subtitle}>{STEP_INFO[step].subtitle}</Text>

                <View style={s.progressRow}>
                    {(["current", "new", "confirm"] as PinStep[]).map(
                        (item, index) => {
                            const active =
                                ["current", "new", "confirm"].indexOf(step) >= index;

                            return (
                                <View
                                    key={item}
                                    style={[
                                        s.progressBar,
                                        active && s.progressActive,
                                    ]}
                                />
                            );
                        }
                    )}
                </View>

                <View style={s.dotsRow}>
                    {[0, 1, 2, 3].map((index) => (
                        <View
                            key={index}
                            style={[
                                s.dot,
                                currentValue.length > index && s.dotFilled,
                            ]}
                        />
                    ))}
                </View>

                <Text style={s.pinHint}>
                    {currentValue.length}/4 digits entered
                </Text>

                <View style={s.keypad}>
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
                        (digit) => (
                            <TouchableOpacity
                                key={digit}
                                style={s.key}
                                onPress={() => handleDigit(digit)}
                                activeOpacity={0.7}
                            >
                                <Text style={s.keyText}>{digit}</Text>
                            </TouchableOpacity>
                        )
                    )}

                    <View style={s.keyEmpty} />

                    <TouchableOpacity
                        style={s.key}
                        onPress={() => handleDigit("0")}
                        activeOpacity={0.7}
                    >
                        <Text style={s.keyText}>0</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={s.key}
                        onPress={handleDelete}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="backspace-outline"
                            size={24}
                            color={C.white}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[
                        s.continueButton,
                        currentValue.length !== 4 && s.continueDisabled,
                    ]}
                    onPress={handleContinue}
                    activeOpacity={0.85}
                >
                    <Text style={s.continueText}>
                        {step === "confirm" ? "Finish" : "Continue"}
                    </Text>

                    <Ionicons
                        name="arrow-forward"
                        size={19}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <Text style={s.footerNote}>
                    Your PIN security features will be enabled after secure storage
                    is implemented.
                </Text>
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: C.bg,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 22,
        paddingTop: 18,
        paddingBottom: 12,
    },

    backButton: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.border,
        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        color: C.white,
        fontSize: 17,
        fontWeight: "700",
        marginLeft: 14,
    },

    headerSpacer: {
        flex: 1,
    },

    content: {
        flex: 1,
        paddingHorizontal: 25,
        justifyContent: "center",
        paddingBottom: 24,
    },

    iconCircle: {
        width: 76,
        height: 76,
        borderRadius: 25,
        backgroundColor: "#1C2137",
        borderWidth: 1,
        borderColor: "#363E66",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginBottom: 22,
    },

    title: {
        color: C.white,
        fontSize: 25,
        fontWeight: "800",
        textAlign: "center",
    },

    subtitle: {
        color: C.muted,
        fontSize: 13,
        textAlign: "center",
        marginTop: 9,
        marginBottom: 24,
    },

    progressRow: {
        flexDirection: "row",
        gap: 7,
        marginBottom: 26,
    },

    progressBar: {
        flex: 1,
        height: 4,
        borderRadius: 5,
        backgroundColor: C.border,
    },

    progressActive: {
        backgroundColor: C.purple,
    },

    dotsRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 19,
        marginBottom: 10,
    },

    dot: {
        width: 15,
        height: 15,
        borderRadius: 8,
        backgroundColor: "#252A37",
        borderWidth: 1,
        borderColor: "#41495B",
    },

    dotFilled: {
        backgroundColor: C.purple,
        borderColor: C.purple,
    },

    pinHint: {
        color: C.muted,
        fontSize: 11,
        textAlign: "center",
        marginBottom: 21,
    },

    keypad: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignSelf: "center",
        width: "100%",
        maxWidth: 310,
        marginBottom: 20,
    },

    key: {
        width: "31%",
        height: 53,
        margin: "1.16%",
        borderRadius: 15,
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.border,
        alignItems: "center",
        justifyContent: "center",
    },

    keyText: {
        color: C.white,
        fontSize: 21,
        fontWeight: "600",
    },

    keyEmpty: {
        width: "31%",
        height: 53,
        margin: "1.16%",
    },

    continueButton: {
        height: 53,
        borderRadius: 15,
        backgroundColor: C.purple,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },

    continueDisabled: {
        opacity: 0.65,
    },

    continueText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },

    footerNote: {
        color: "#747C90",
        fontSize: 10,
        lineHeight: 16,
        textAlign: "center",
        marginTop: 16,
    },
});
