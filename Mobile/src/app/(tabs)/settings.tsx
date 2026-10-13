
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";

const C = {
  bg: "#0B0D12",
  card: "#151922",
  border: "#292F3D",
  purple: "#7785FF",
  white: "#F5F7FA",
  muted: "#9299AA",
};

function SettingRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={s.row} onPress={onPress}>
      <View style={s.rowIcon}>
        <Text style={s.iconText}>{icon}</Text>
      </View>
      <View style={s.rowInfo}>
        <Text style={s.rowTitle}>{title}</Text>
        <Text style={s.rowSubtitle}>{subtitle}</Text>
      </View>
      <Text style={s.arrow}>›</Text>
    </Pressable>
  );
}

export default function SettingsScreen() {
  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Text style={s.eyebrow}>PREFERENCES</Text>
      <Text style={s.title}>Settings</Text>
      <Text style={s.subtitle}>
        Make DeskPilot work the way you like.
      </Text>

      <Text style={s.section}>CONNECTION</Text>
      <View style={s.group}>
        <SettingRow
          icon="⌁"
          title="Laptop connection"
          subtitle="Configure your Windows laptop"
          onPress={() => router.push("/connection")}
        />
      </View>

      <Text style={s.section}>SECURITY</Text>
      <View style={s.group}>
        <SettingRow
          icon="▣"
          title="Change PIN"
          subtitle="Update your app access PIN"
          onPress={() => router.push("/change-pin")}
        />
        <View style={s.divider} />
        <SettingRow
          icon="◇"
          title="Privacy & security"
          subtitle="Review security information"
          onPress={() => router.push("/about")}
        />
      </View>

      <Text style={s.section}>ABOUT</Text>
      <View style={s.group}>
        <SettingRow
          icon="ⓘ"
          title="About DeskPilot"
          subtitle="App information and version"
          onPress={() => router.push("/about")}
        />
      </View>

      <View style={s.versionCard}>
        <View style={s.logo}>
          <Text style={s.logoText}>D</Text>
        </View>
        <Text style={s.appName}>DeskPilot</Text>
        <Text style={s.version}>Version 1.0.0 • UI Preview</Text>
      </View>

      <Text style={s.footer}>
        DESKPILOT • YOUR LAPTOP, UNDER YOUR CONTROL
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  content: { padding: 22, paddingTop: 32, paddingBottom: 35 },
  eyebrow: { color: C.purple, fontSize: 10, fontWeight: "800", letterSpacing: 2 },
  title: { color: C.white, fontSize: 30, fontWeight: "800", marginTop: 9 },
  subtitle: { color: C.muted, fontSize: 13, lineHeight: 21, marginTop: 8, marginBottom: 28 },
  section: { color: C.muted, fontSize: 10, fontWeight: "800", letterSpacing: 1.4, marginBottom: 11, marginTop: 22 },
  group: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, paddingHorizontal: 13 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 15 },
  rowIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#252A46", alignItems: "center", justifyContent: "center", marginRight: 12 },
  iconText: { color: C.purple, fontSize: 20 },
  rowInfo: { flex: 1 },
  rowTitle: { color: C.white, fontSize: 13, fontWeight: "700" },
  rowSubtitle: { color: C.muted, fontSize: 10, marginTop: 5 },
  arrow: { color: C.muted, fontSize: 25, marginLeft: 8 },
  divider: { height: 1, backgroundColor: C.border },
  versionCard: { alignItems: "center", paddingVertical: 28, marginTop: 18 },
  logo: { width: 48, height: 48, borderRadius: 15, backgroundColor: "#252A46", borderWidth: 1, borderColor: "#454D7C", alignItems: "center", justifyContent: "center" },
  logoText: { color: C.purple, fontSize: 25, fontWeight: "900" },
  appName: { color: C.white, fontSize: 15, fontWeight: "800", marginTop: 12 },
  version: { color: C.muted, fontSize: 10, marginTop: 6 },
  footer: { color: "#596174", fontSize: 8, letterSpacing: 1, textAlign: "center", marginTop: 10 },
});
