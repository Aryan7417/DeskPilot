
import React, { useEffect, useRef, useState } from "react";
import {
  AppState,
  type AppStateStatus,
} from "react-native";
import {
  Stack,
  router,
  usePathname,
} from "expo-router";
import { hasPin } from "../services/pin.service";

export default function RootLayout() {
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);
  const [configured, setConfigured] = useState(false);

  const appState = useRef<AppStateStatus>(
    AppState.currentState
  );
  const wasBackgrounded = useRef(false);

  // Check PIN status whenever the route changes.
  useEffect(() => {
    let active = true;

    async function checkPinSetup() {
      try {
        const exists = await hasPin();

        if (active) {
          setConfigured(exists);
        }
      } catch (error) {
        console.error("PIN setup check failed:", error);

        if (active) {
          setConfigured(false);
        }
      } finally {
        if (active) {
          setChecking(false);
        }
      }
    }

    setChecking(true);
    checkPinSetup();

    return () => {
      active = false;
    };
  }, [pathname]);

  // When the app returns from the background,
  // show the PIN screen if a PIN is configured.
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        const previousState = appState.current;

        if (
          previousState === "active" &&
          (nextState === "background" ||
            nextState === "inactive")
        ) {
          wasBackgrounded.current = true;
        }

        if (
          nextState === "active" &&
          wasBackgrounded.current
        ) {
          wasBackgrounded.current = false;

          if (configured) {
            router.replace("/");
          }
        }

        appState.current = nextState;
      }
    );

    return () => subscription.remove();
  }, [configured]);

  // Route rules after PIN status is checked.
  useEffect(() => {
    if (checking) return;

    const isSetupRoute =
      pathname === "/setup-pin" ||
      pathname === "/confirm-pin";

    if (!configured) {
      // A new installation must set up a PIN first.
      if (!isSetupRoute) {
        router.replace("/setup-pin");
      }

      return;
    }

    // Existing PIN: don't allow setup to be reopened directly.
    if (pathname === "/setup-pin") {
      router.replace("/");
    }
  }, [checking, configured, pathname]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="apps/add" />
      <Stack.Screen name="setup-pin" />
      <Stack.Screen name="confirm-pin" />
      <Stack.Screen name="unlock" />
      <Stack.Screen name="connection" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="activity" />
      <Stack.Screen name="about" />
      <Stack.Screen name="change-pin" />
    </Stack>
  );
}
