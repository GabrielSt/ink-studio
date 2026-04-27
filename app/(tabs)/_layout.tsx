import { Tabs, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../../context/AppContext";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const GOLD = "#D4AF37";
const GOLD_DIM = "#b8972e";
const BG = "#0a0a0a";
const BORDER = "#1a1a1a";

// ── SVG-style icon paths rendered as text/unicode glyphs ─────────────────────
// We use inline SVG-like compositions with View + Text to keep zero extra deps.

function IconHome({ active }: { active: boolean }) {
  const c = active ? GOLD : "#52525b";
  return (
    <View style={{ alignItems: "center", justifyContent: "center", width: 26, height: 26 }}>
      {/* Roof */}
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, alignItems: "center" }}>
        <View style={{
          width: 0, height: 0,
          borderLeftWidth: 13, borderRightWidth: 13, borderBottomWidth: 10,
          borderLeftColor: "transparent", borderRightColor: "transparent",
          borderBottomColor: c,
        }} />
      </View>
      {/* Body */}
      <View style={{
        position: "absolute", bottom: 0, left: 4, right: 4, height: 14,
        backgroundColor: c, borderTopLeftRadius: 1, borderTopRightRadius: 1,
      }}>
        {/* Door */}
        <View style={{
          position: "absolute", bottom: 0, alignSelf: "center",
          width: 6, height: 8, backgroundColor: BG, borderTopLeftRadius: 3, borderTopRightRadius: 3,
        }} />
      </View>
    </View>
  );
}

function IconPalette({ active }: { active: boolean }) {
  const c = active ? GOLD : "#52525b";
  return (
    <View style={{ alignItems: "center", justifyContent: "center", width: 26, height: 26 }}>
      <View style={{
        width: 22, height: 22, borderRadius: 11,
        borderWidth: 2.5, borderColor: c,
      }}>
        <View style={{
          position: "absolute", bottom: -1, right: 3,
          width: 7, height: 7, borderRadius: 3.5,
          backgroundColor: BG, borderWidth: 2, borderColor: c,
        }} />
      </View>
    </View>
  );
}

function IconScroll({ active }: { active: boolean }) {
  const c = active ? GOLD : "#52525b";
  return (
    <View style={{ alignItems: "center", justifyContent: "center", width: 26, height: 26 }}>
      <View style={{
        width: 18, height: 22, borderRadius: 3,
        borderWidth: 2.5, borderColor: c,
      }}>
        {[6, 11, 16].map((top) => (
          <View key={top} style={{
            position: "absolute", top, left: 3, right: 3,
            height: 2, borderRadius: 1, backgroundColor: c, opacity: 0.7,
          }} />
        ))}
      </View>
    </View>
  );
}

// ── Central FAB booking button ─────────────────────────────────────────────
function BookFAB() {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push("/booking")}
      activeOpacity={0.85}
      style={{
        width: 58, height: 58, borderRadius: 29,
        backgroundColor: GOLD,
        alignItems: "center", justifyContent: "center",
        shadowColor: GOLD, shadowOpacity: 0.55, shadowRadius: 14, shadowOffset: { width: 0, height: 4 },
        elevation: 10,
        marginBottom: 6,
      }}
    >
      <Text style={{ color: "#000", fontSize: 28, fontWeight: "900", lineHeight: 32 }}>+</Text>
    </TouchableOpacity>
  );
}

// ── Tab item ──────────────────────────────────────────────────────────────
function TabItem({
  label, active, onPress, icon, badge,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  badge?: number;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 10, paddingBottom: 4 }}
    >
      <View style={{ position: "relative" }}>
        {icon}
        {!!badge && badge > 0 && (
          <View style={{
            position: "absolute", top: -4, right: -6,
            backgroundColor: GOLD, borderRadius: 8, minWidth: 16, height: 16,
            alignItems: "center", justifyContent: "center", paddingHorizontal: 3,
          }}>
            <Text style={{ color: "#000", fontSize: 9, fontWeight: "900" }}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={{
        color: active ? GOLD : "#52525b",
        fontSize: 9, fontWeight: active ? "800" : "500",
        marginTop: 4, textTransform: "uppercase", letterSpacing: 1,
      }}>
        {label}
      </Text>
      {active && (
        <View style={{ width: 20, height: 2, borderRadius: 1, backgroundColor: GOLD, marginTop: 3 }} />
      )}
    </TouchableOpacity>
  );
}

// ── Custom tab bar ─────────────────────────────────────────────────────────
function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { bookings } = useApp();

  const pendingBadge = bookings.filter(
    (b) => b.status === "pending_quote" || b.status === "quote_received"
  ).length;

  const tabs = [
    { name: "index",   label: "Início",   icon: (a: boolean) => <IconHome active={a} /> },
    { name: "artists", label: "Artistas", icon: (a: boolean) => <IconPalette active={a} /> },
    { name: "history", label: "Histórico",icon: (a: boolean) => <IconScroll active={a} />, badge: pendingBadge },
  ];

  // Split into left / right halves with FAB in center
  const left  = tabs.slice(0, 1);
  const right = tabs.slice(1);

  return (
    <View style={{
      flexDirection: "row", alignItems: "flex-end",
      backgroundColor: BG,
      borderTopWidth: 1, borderTopColor: BORDER,
      paddingBottom: insets.bottom || (Platform.OS === "android" ? 8 : 0),
      shadowColor: "#000", shadowOpacity: 0.6, shadowRadius: 16, shadowOffset: { width: 0, height: -4 },
      elevation: 20,
    }}>
      {/* Left tabs */}
      <View style={{ flex: 1, flexDirection: "row" }}>
        {left.map((tab) => {
          const idx = state.routes.findIndex((r) => r.name === tab.name);
          const active = state.index === idx;
          return (
            <TabItem
              key={tab.name}
              label={tab.label}
              active={active}
              onPress={() => navigation.navigate(tab.name)}
              icon={tab.icon(active)}
            />
          );
        })}
      </View>

      {/* Center FAB */}
      <View style={{ alignItems: "center", paddingBottom: 4, paddingHorizontal: 8 }}>
        <BookFAB />
        <Text style={{ color: GOLD_DIM, fontSize: 8, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" }}>Book</Text>
      </View>

      {/* Right tabs */}
      <View style={{ flex: 1, flexDirection: "row" }}>
        {right.map((tab) => {
          const idx = state.routes.findIndex((r) => r.name === tab.name);
          const active = state.index === idx;
          return (
            <TabItem
              key={tab.name}
              label={tab.label}
              active={active}
              onPress={() => navigation.navigate(tab.name)}
              icon={tab.icon(active)}
              badge={"badge" in tab ? tab.badge : undefined}
            />
          );
        })}
      </View>
    </View>
  );
}

// ── Layout ─────────────────────────────────────────────────────────────────
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="artists" />
      <Tabs.Screen name="history" />
    </Tabs>
  );
}
