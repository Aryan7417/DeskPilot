
import { View, Text, StyleSheet } from "react-native";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>PREFERENCES</Text>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>
        Customize your DeskPilot experience.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0D12",
    padding: 24,
    paddingTop: 40,
  },
  eyebrow: {
    color: "#7785FF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
  title: {
    color: "#F5F7FA",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 10,
  },
  subtitle: {
    color: "#9299AA",
    fontSize: 14,
    marginTop: 8,
  },
});
