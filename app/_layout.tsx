import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AppProvider } from "../context/AppContext";

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AppProvider>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#0a0a0a" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0a0a0a" },
            animation: "slide_from_right",
          }}
        />
      </SafeAreaProvider>
    </AppProvider>
  );
}
