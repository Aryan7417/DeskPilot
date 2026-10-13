
import { Stack } from "expo-router";

export default function RootLayout() {
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
