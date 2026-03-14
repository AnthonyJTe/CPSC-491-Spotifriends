import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0B0B12" },
          gestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ animation: "fade" }}
        />
        <Stack.Screen
          name="login"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="signup"
          options={{ animation: "slide_from_right" }}
        />
      </Stack>
    </>
  );
}