
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   Alert,
// } from "react-native";
// import { router } from "expo-router";

// const C = {
//   bg: "#0B0D12",
//   card: "#151922",
//   border: "#292F3D",
//   purple: "#7785FF",
//   white: "#F5F7FA",
//   muted: "#9299AA",
//   red: "#F97066",
// };

// export default function LockScreen() {
//   const [pin, setPin] = useState("");
//   const [loading, setLoading] = useState(false);

//   function pressKey(key: string) {
//     if (key === "delete") {
//       setPin((current) => current.slice(0, -1));
//       return;
//     }

//     if (pin.length >= 4 || loading) return;

//     const nextPin = pin + key;
//     setPin(nextPin);

//     if (nextPin.length === 4) {
//       setLoading(true);

//       // UI preview only: actual PIN verification baad mein.
//       setTimeout(() => {
//         setLoading(false);
//         setPin("");

//         Alert.alert(
//           "Demo PIN",
//           "PIN verification abhi connect nahi hai. Dashboard preview khol rahe hain.",
//           [
//             {
//               text: "Continue",
//               onPress: () => router.replace("/(tabs)"),
//             },
//             {
//               text: "Cancel",
//               style: "cancel",
//             },
//           ]
//         );
//       }, 250);
//     }
//   }

//   return (
//     <View style={s.screen}>
//       <View style={s.top}>
//         <View style={s.logo}>
//           <Text style={s.logoText}>D</Text>
//         </View>
//         <Text style={s.brand}>DESKPILOT</Text>
//         <Text style={s.tagline}>YOUR LAPTOP, UNDER YOUR CONTROL</Text>
//       </View>

//       <View style={s.center}>
//         <View style={s.lockIcon}>
//           <Text style={s.lockEmoji}>⌑</Text>
//         </View>

//         <Text style={s.title}>Welcome back</Text>
//         <Text style={s.subtitle}>
//           Enter your 4-digit PIN to continue
//         </Text>

//         <View style={s.indicators}>
//           {[0, 1, 2, 3].map((index) => (
//             <View
//               key={index}
//               style={[
//                 s.indicator,
//                 pin.length > index && s.indicatorFilled,
//               ]}
//             />
//           ))}
//         </View>

//         <View style={s.keypad}>
//           {["1", "2", "3", "4", "5", "6", "7", "8", "9", "help", "0", "delete"].map(
//             (key) => (
//               <Pressable
//                 key={key}
//                 style={s.key}
//                 onPress={() => {
//                   if (key === "help") {
//                     router.push("/setup-pin");
//                   } else {
//                     pressKey(key);
//                   }
//                 }}
//               >
//                 <Text style={s.keyText}>
//                   {key === "delete"
//                     ? "⌫"
//                     : key === "help"
//                       ? "?"
//                       : key}
//                 </Text>
//               </Pressable>
//             )
//           )}
//         </View>

//         <Pressable
//           onPress={() => router.push("/setup-pin")}
//           style={s.forgot}
//         >
//           <Text style={s.forgotText}>Forgot PIN?  Set up again</Text>
//         </Pressable>
//       </View>

//       <View style={s.bottom}>
//         <View style={s.secureRow}>
//           <Text style={s.secureIcon}>◆</Text>
//           <Text style={s.secureText}>YOUR ACCESS, YOUR CONTROL</Text>
//         </View>
//         <Text style={s.version}>DESKPILOT • UI PREVIEW</Text>
//       </View>
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: C.bg,
//     paddingHorizontal: 25,
//     paddingTop: 48,
//     paddingBottom: 24,
//     justifyContent: "space-between",
//   },
//   top: { alignItems: "center" },
//   logo: {
//     width: 53,
//     height: 53,
//     borderRadius: 17,
//     backgroundColor: "#252A46",
//     borderWidth: 1,
//     borderColor: "#454D7C",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   logoText: { color: C.purple, fontSize: 27, fontWeight: "900" },
//   brand: {
//     color: C.white,
//     fontSize: 17,
//     fontWeight: "900",
//     letterSpacing: 3,
//     marginTop: 12,
//   },
//   tagline: {
//     color: C.muted,
//     fontSize: 8,
//     letterSpacing: 1.3,
//     marginTop: 6,
//   },
//   center: { alignItems: "center" },
//   lockIcon: {
//     width: 62,
//     height: 62,
//     borderRadius: 20,
//     backgroundColor: C.card,
//     borderWidth: 1,
//     borderColor: C.border,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 22,
//   },
//   lockEmoji: { color: C.purple, fontSize: 36 },
//   title: { color: C.white, fontSize: 25, fontWeight: "800" },
//   subtitle: {
//     color: C.muted,
//     fontSize: 12,
//     marginTop: 9,
//     textAlign: "center",
//   },
//   indicators: {
//     flexDirection: "row",
//     gap: 17,
//     marginTop: 28,
//     marginBottom: 28,
//   },
//   indicator: {
//     width: 13,
//     height: 13,
//     borderRadius: 7,
//     backgroundColor: "#252A35",
//     borderWidth: 1,
//     borderColor: "#41485B",
//   },
//   indicatorFilled: {
//     backgroundColor: C.purple,
//     borderColor: C.purple,
//   },
//   keypad: {
//     width: "100%",
//     maxWidth: 310,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "center",
//     gap: 12,
//   },
//   key: {
//     width: "29%",
//     height: 54,
//     borderRadius: 15,
//     borderWidth: 1,
//     borderColor: C.border,
//     backgroundColor: C.card,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   keyText: { color: C.white, fontSize: 21, fontWeight: "600" },
//   forgot: { marginTop: 24, padding: 8 },
//   forgotText: { color: C.purple, fontSize: 12, fontWeight: "600" },
//   bottom: { alignItems: "center" },
//   secureRow: { flexDirection: "row", alignItems: "center", gap: 8 },
//   secureIcon: { color: C.purple, fontSize: 10 },
//   secureText: {
//     color: C.muted,
//     fontSize: 9,
//     letterSpacing: 1.2,
//     fontWeight: "700",
//   },
//   version: {
//     color: "#596174",
//     fontSize: 9,
//     marginTop: 12,
//     letterSpacing: 1,
//   },
// });





import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { getConnectionSettings } from "../services/connection.service";
import {
  getApps,
  launchApp,
  type DesktopApp,
} from "../services/app.service";

export default function HomeScreen() {
  const router = useRouter();

  const [isOnline, setIsOnline] = useState(false);
  const [checking, setChecking] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apps, setApps] = useState<DesktopApp[]>([]);
  const [launchingId, setLaunchingId] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState("");

  const checkConnection = useCallback(async () => {
    try {
      const settings = await getConnectionSettings();
      const ip = settings.ip.trim();
      const port = settings.port.trim();

      if (!ip || !port) {
        setIsOnline(false);
        return;
      }

      const response = await fetch(
        `http://${ip}:${port}/health`
      );

      if (!response.ok) {
        setIsOnline(false);
        return;
      }

      const data = await response.json();

      setIsOnline(
        data.success === true || data.status === "online"
      );
      setLastChecked(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch {
      setIsOnline(false);
    } finally {
      setChecking(false);
    }
  }, []);

  const loadApps = useCallback(async () => {
    try {
      const result = await getApps();
      setApps(result);
    } catch (error) {
      console.log("Failed to load apps:", error);
      setApps([]);
    }
  }, []);

  const refreshDashboard = useCallback(async () => {
    setRefreshing(true);

    await Promise.all([
      checkConnection(),
      loadApps(),
    ]);

    setRefreshing(false);
  }, [checkConnection, loadApps]);

  useFocusEffect(
    useCallback(() => {
      refreshDashboard();

      const interval = setInterval(() => {
        checkConnection();
      }, 10000);

      return () => clearInterval(interval);
    }, [refreshDashboard, checkConnection])
  );

  const handleLaunch = async (app: DesktopApp) => {
    if (launchingId) return;

    if (!isOnline) {
      Alert.alert(
        "Laptop Offline",
        "Laptop ka connection check karo aur phir try karo."
      );
      return;
    }

    try {
      setLaunchingId(app.id);

      await launchApp(app.id);

      Alert.alert(
        "Launch Request Sent",
        `${app.name} ko launch karne ki request bhej di gayi hai.`
      );
    } catch (error) {
      Alert.alert(
        "Launch Failed",
        error instanceof Error
          ? error.message
          : "App launch nahi ho paayi."
      );
    } finally {
      setLaunchingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshDashboard}
            tintColor="#A78BFA"
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>DESKPILOT</Text>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>
              Your laptop, under control.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={refreshDashboard}
            accessibilityLabel="Refresh dashboard"
          >
            <Text style={styles.refreshIcon}>↻</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusTop}>
            <Text style={styles.cardLabel}>LAPTOP STATUS</Text>

            <View
              style={[
                styles.statusBadge,
                isOnline ? styles.onlineBadge : styles.offlineBadge,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  isOnline ? styles.onlineDot : styles.offlineDot,
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  isOnline ? styles.onlineText : styles.offlineText,
                ]}
              >
                {checking
                  ? "CHECKING"
                  : isOnline
                    ? "ONLINE"
                    : "OFFLINE"}
              </Text>
            </View>
          </View>

          <Text style={styles.statusTitle}>
            {checking
              ? "Checking connection..."
              : isOnline
                ? "Laptop is reachable"
                : "Laptop not reachable"}
          </Text>

          <Text style={styles.statusDescription}>
            {isOnline
              ? "Your DeskPilot server responded successfully."
              : "Check that the laptop is ON, the backend is running, and the IP and port are correct."}
          </Text>

          <View style={styles.statusFooter}>
            <Text style={styles.lastChecked}>
              {lastChecked
                ? `Last checked: ${lastChecked}`
                : "Waiting for connection check"}
            </Text>

            {checking && (
              <ActivityIndicator color="#A78BFA" size="small" />
            )}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Quick Launch</Text>
            <Text style={styles.sectionSubtitle}>
              Open your saved laptop apps
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/apps")}
          >
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        </View>

        {apps.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>▣</Text>
            <Text style={styles.emptyTitle}>No apps added yet</Text>
            <Text style={styles.emptyDescription}>
              Add an app to access it directly from your dashboard.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/apps/add")}
            >
              <Text style={styles.primaryButtonText}>
                + Add App
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.appsGrid}>
            {apps.map((app) => (
              <TouchableOpacity
                key={app.id}
                style={styles.appCard}
                onPress={() => handleLaunch(app)}
                disabled={launchingId !== null}
                activeOpacity={0.75}
              >
                <View style={styles.appIcon}>
                  <Text style={styles.appIconText}>
                    {app.name.slice(0, 1).toUpperCase()}
                  </Text>
                </View>

                <Text style={styles.appName} numberOfLines={1}>
                  {app.name}
                </Text>

                <Text style={styles.appAction}>
                  {launchingId === app.id
                    ? "Launching..."
                    : "Tap to launch ↗"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(tabs)/apps")}
          >
            <Text style={styles.actionIcon}>▦</Text>
            <Text style={styles.actionTitle}>My Apps</Text>
            <Text style={styles.actionSubtitle}>
              Manage apps
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/apps/add")}
          >
            <Text style={styles.actionIcon}>＋</Text>
            <Text style={styles.actionTitle}>Add App</Text>
            <Text style={styles.actionSubtitle}>
              Add a new app
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(tabs)/activity")}
          >
            <Text style={styles.actionIcon}>◷</Text>
            <Text style={styles.actionTitle}>Activity</Text>
            <Text style={styles.actionSubtitle}>
              View activity
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(tabs)/settings")}
          >
            <Text style={styles.actionIcon}>⚙</Text>
            <Text style={styles.actionTitle}>Settings</Text>
            <Text style={styles.actionSubtitle}>
              Configure app
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          DeskPilot • Remote control made simple
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1020",
  },
  content: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  eyebrow: {
    color: "#A78BFA",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 8,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 14,
    marginTop: 5,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#171F35",
    borderWidth: 1,
    borderColor: "#28334F",
    alignItems: "center",
    justifyContent: "center",
  },
  refreshIcon: {
    color: "#C4B5FD",
    fontSize: 30,
  },
  statusCard: {
    backgroundColor: "#151D32",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#29334D",
    marginBottom: 30,
  },
  statusTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  cardLabel: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 7,
  },
  onlineBadge: {
    backgroundColor: "#123B32",
  },
  offlineBadge: {
    backgroundColor: "#3B202B",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
  },
  onlineDot: {
    backgroundColor: "#34D399",
  },
  offlineDot: {
    backgroundColor: "#FB7185",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  onlineText: {
    color: "#6EE7B7",
  },
  offlineText: {
    color: "#FDA4AF",
  },
  statusTitle: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 9,
  },
  statusDescription: {
    color: "#A5B4CC",
    fontSize: 13,
    lineHeight: 20,
  },
  statusFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#29334D",
    marginTop: 20,
    paddingTop: 14,
  },
  lastChecked: {
    color: "#94A3B8",
    fontSize: 11,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "800",
  },
  sectionSubtitle: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 5,
  },
  seeAll: {
    color: "#C4B5FD",
    fontSize: 13,
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: "#151D32",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#29334D",
    padding: 24,
    alignItems: "center",
    marginBottom: 30,
  },
  emptyIcon: {
    color: "#A78BFA",
    fontSize: 34,
    marginBottom: 12,
  },
  emptyTitle: {
    color: "#F8FAFC",
    fontSize: 17,
    fontWeight: "700",
  },
  emptyDescription: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 18,
  },
  primaryButton: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },
  appsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 30,
  },
  appCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: "#151D32",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#29334D",
    padding: 15,
    minHeight: 135,
  },
  appIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#302454",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },
  appIconText: {
    color: "#DDD6FE",
    fontSize: 19,
    fontWeight: "800",
  },
  appName: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "800",
  },
  appAction: {
    color: "#A78BFA",
    fontSize: 11,
    marginTop: 7,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: "#151D32",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#29334D",
    padding: 16,
    minHeight: 120,
  },
  actionIcon: {
    color: "#C4B5FD",
    fontSize: 25,
    marginBottom: 12,
  },
  actionTitle: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "800",
  },
  actionSubtitle: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 5,
  },
  footer: {
    color: "#64748B",
    fontSize: 11,
    textAlign: "center",
    marginTop: 30,
  },
});
