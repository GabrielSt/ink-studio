import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AppProvider } from "../context/AppContext";

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <SafeAreaProvider>
          <StatusBar style="light" backgroundColor="#0a0a0a" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#0a0a0a" },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="booking"
              options={{
                headerShown: false,
                animation: "slide_from_bottom",
                presentation: "modal",
              }}
            />
          </Stack>
        </SafeAreaProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
