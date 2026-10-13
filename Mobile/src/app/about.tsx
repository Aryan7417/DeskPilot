
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
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
  green: "#55D6A2",
};

function InfoRow({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={s.infoRow}>
      <View style={s.infoIcon}>
        <Ionicons name={icon} size={20} color={C.purple} />
      </View>

      <View style={s.infoText}>
        <Text style={s.infoTitle}>{title}</Text>
        <Text style={s.infoSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

export default function AboutScreen() {
  return (
    <View style={s.screen}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <Pressable
            style={s.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color={C.white} />
          </Pressable>

          <Text style={s.headerTitle}>About DeskPilot</Text>

          <View style={s.headerSpacer} />
        </View>

        {/* App identity */}
        <View style={s.hero}>
          <View style={s.logo}>
            <Ionicons
              name="laptop-outline"
              size={43}
              color={C.purple}
            />
            <View style={s.logoBadge}>
              <Ionicons
                name="radio-outline"
                size={15}
                color={C.white}
              />
            </View>
          </View>

          <Text style={s.appName}>DeskPilot</Text>

          <Text style={s.tagline}>
            YOUR LAPTOP, UNDER YOUR CONTROL
          </Text>

          <View style={s.versionBadge}>
            <View style={s.versionDot} />
            <Text style={s.versionText}>Version 1.0.0 • UI Preview</Text>
          </View>
        </View>

        {/* Description */}
        <View style={s.descriptionCard}>
          <Text style={s.cardHeading}>About the app</Text>

          <Text style={s.description}>
            DeskPilot is designed to help you control and manage your
            Windows laptop remotely from your Android phone.
          </Text>

          <Text style={s.description}>
            Manage applications, view activity and configure your laptop
            connection from one simple interface.
          </Text>
        </View>

        {/* Features */}
        <Text style={s.sectionTitle}>KEY FEATURES</Text>

        <View style={s.group}>
          <InfoRow
            icon="laptop-outline"
            title="Laptop connection"
            subtitle="Configure your laptop network details"
          />

          <View style={s.divider} />

          <InfoRow
            icon="apps-outline"
            title="Application management"
            subtitle="View and manage your saved applications"
          />

          <View style={s.divider} />

          <InfoRow
            icon="time-outline"
            title="Activity overview"
            subtitle="Review recent activity in the app"
          />

          <View style={s.divider} />

          <InfoRow
            icon="keypad-outline"
            title="PIN access"
            subtitle="A dedicated screen for app access settings"
          />
        </View>

        {/* Privacy and security */}
        <Text style={s.sectionTitle}>PRIVACY & SECURITY</Text>

        <View style={s.securityCard}>
          <View style={s.securityHeader}>
            <View style={s.securityIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color={C.green}
              />
            </View>

            <View style={s.securityHeading}>
              <Text style={s.securityTitle}>Security information</Text>
              <Text style={s.securitySubtitle}>
                Current UI preview status
              </Text>
            </View>
          </View>

          <Text style={s.securityDescription}>
            PIN verification, secure PIN storage and real connection
            authentication have not been implemented yet.
          </Text>

          <View style={s.notice}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={C.purple}
            />
            <Text style={s.noticeText}>
              This version is for interface testing. Avoid treating demo
              status indicators as proof of a secure connection.
            </Text>
          </View>
        </View>

        {/* Developer */}
        <Text style={s.sectionTitle}>DEVELOPMENT</Text>

        <View style={s.group}>
          <InfoRow
            icon="code-slash-outline"
            title="Built with"
            subtitle="React Native and Expo"
          />

          <View style={s.divider} />

          <InfoRow
            icon="construct-outline"
            title="Project status"
            subtitle="UI development in progress"
          />
        </View>

        {/* Footer */}
        <View style={s.footerCard}>
          <View style={s.footerLogo}>
            <Text style={s.footerLogoText}>D</Text>
          </View>

          <Text style={s.footerBrand}>DeskPilot</Text>
          <Text style={s.footerText}>
            Simple control. Smarter workflow.
          </Text>

          <Pressable
            style={s.backHomeButton}
            onPress={() => router.replace("/(tabs)")}
          >
            <Ionicons name="home-outline" size={17} color={C.white} />
            <Text style={s.backHomeText}>Back to Dashboard</Text>
          </Pressable>
        </View>

        <Text style={s.copyright}>
          DESKPILOT • VERSION 1.0.0
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
    paddingTop: 22,
    paddingBottom: 35,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 27,
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

  headerTitle: {
    flex: 1,
    color: C.white,
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 13,
  },

  headerSpacer: {
    width: 10,
  },

  hero: {
    alignItems: "center",
    paddingVertical: 15,
  },

  logo: {
    width: 100,
    height: 100,
    borderRadius: 29,
    backgroundColor: "#1B2035",
    borderWidth: 1,
    borderColor: "#424B7B",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  logoBadge: {
    position: "absolute",
    right: -5,
    bottom: -5,
    width: 31,
    height: 31,
    borderRadius: 11,
    backgroundColor: C.purple,
    borderWidth: 3,
    borderColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
  },

  appName: {
    color: C.white,
    fontSize: 29,
    fontWeight: "900",
    marginTop: 20,
  },

  tagline: {
    color: C.muted,
    fontSize: 9,
    letterSpacing: 1.8,
    marginTop: 8,
  },

  versionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 15,
  },

  versionDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.green,
  },

  versionText: {
    color: C.muted,
    fontSize: 10,
    fontWeight: "600",
  },

  descriptionCard: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 17,
    padding: 17,
    marginTop: 25,
  },

  cardHeading: {
    color: C.white,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 11,
  },

  description: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 20,
    marginBottom: 9,
  },

  sectionTitle: {
    color: C.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginTop: 27,
    marginBottom: 12,
  },

  group: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 17,
    paddingHorizontal: 14,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#252A46",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  infoText: {
    flex: 1,
  },

  infoTitle: {
    color: C.white,
    fontSize: 12,
    fontWeight: "700",
  },

  infoSubtitle: {
    color: C.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 5,
  },

  divider: {
    height: 1,
    backgroundColor: C.border,
  },

  securityCard: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 17,
    padding: 16,
  },

  securityHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  securityIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#18352E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  securityHeading: {
    flex: 1,
  },

  securityTitle: {
    color: C.white,
    fontSize: 13,
    fontWeight: "800",
  },

  securitySubtitle: {
    color: C.muted,
    fontSize: 10,
    marginTop: 5,
  },

  securityDescription: {
    color: C.muted,
    fontSize: 11,
    lineHeight: 18,
    marginTop: 15,
  },

  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    backgroundColor: "#1B2034",
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },

  noticeText: {
    flex: 1,
    color: "#B7BED1",
    fontSize: 10,
    lineHeight: 16,
  },

  footerCard: {
    alignItems: "center",
    paddingVertical: 26,
    marginTop: 18,
  },

  footerLogo: {
    width: 47,
    height: 47,
    borderRadius: 15,
    backgroundColor: "#252A46",
    borderWidth: 1,
    borderColor: "#454D7C",
    alignItems: "center",
    justifyContent: "center",
  },

  footerLogoText: {
    color: C.purple,
    fontSize: 25,
    fontWeight: "900",
  },

  footerBrand: {
    color: C.white,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 12,
  },

  footerText: {
    color: C.muted,
    fontSize: 11,
    marginTop: 6,
  },

  backHomeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: C.purple,
    borderRadius: 13,
    paddingHorizontal: 20,
    paddingVertical: 13,
    marginTop: 22,
  },

  backHomeText: {
    color: C.white,
    fontSize: 12,
    fontWeight: "700",
  },

  copyright: {
    color: "#596174",
    fontSize: 8,
    letterSpacing: 1.2,
    textAlign: "center",
    marginTop: 10,
  },
});
