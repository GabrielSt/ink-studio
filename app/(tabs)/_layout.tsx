import { Tabs, useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../../context/AppContext";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const FAB_SIZE = 58;
const BAR_H = 60;
const GOLD = "#D4AF37";
const DIM  = "#52525b";

function TabItem({ label, active, onPress, icon, badge }: {
  label: string; active: boolean; onPress: () => void;
  icon: React.ReactNode; badge?: number;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-1 items-center justify-center gap-1"
      style={{ height: BAR_H }}
    >
      <View className="relative items-center justify-center">
        {icon}
        {!!badge && badge > 0 && (
          <View className="absolute -top-1 -right-3 bg-ink-gold rounded-full min-w-[14px] h-[14px] items-center justify-center px-0.5">
            <Text className="text-black font-black leading-[14px]" style={{ fontSize: 8 }}>{badge}</Text>
          </View>
        )}
      </View>
      <Text
        className={`uppercase tracking-widest ${active ? "text-ink-gold font-extrabold" : "text-ink-dim font-normal"}`}
        style={{ fontSize: 8, letterSpacing: 0.8 }}
      >
        {label}
      </Text>
      <View className={`w-1 h-1 rounded-full ${active ? "bg-ink-gold" : "bg-transparent"}`} />
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { bookings } = useApp();

  const pendingBadge = bookings.filter(
    (b) => b.status === "pending_quote" || b.status === "quote_received"
  ).length;

  const leftTabs = [
    {
      name: "index",
      label: "Início",
      icon: (a: boolean) => <Ionicons name="home-outline" size={24} color={a ? GOLD : DIM} />,
    },
    {
      name: "artists",
      label: "Artistas",
      icon: (a: boolean) => <Ionicons name="people-outline" size={24} color={a ? GOLD : DIM} />,
    },
  ];
  const rightTabs = [
    {
      name: "achievements",
      label: "Conquistas",
      icon: (a: boolean) => <Ionicons name="trophy-outline" size={24} color={a ? GOLD : DIM} />,
    },
    {
      name: "profile",
      label: "Perfil",
      icon: (a: boolean) => <Ionicons name="person-outline" size={24} color={a ? GOLD : DIM} />,
      badge: pendingBadge,
    },
  ];

  const bottomPad = Math.min(insets.bottom, 16);

  return (
    <View className="bg-ink-bar border-t border-ink-border-warm">
      {/* FAB — flutua acima da barra */}
      <TouchableOpacity
        onPress={() => router.push("/booking")}
        activeOpacity={0.85}
        className="absolute bg-ink-gold items-center justify-center z-20"
        style={{
          top: -(FAB_SIZE / 2),
          left: "50%",
          marginLeft: -(FAB_SIZE / 2),
          width: FAB_SIZE,
          height: FAB_SIZE,
          borderRadius: FAB_SIZE / 2,
          shadowColor: "#D4AF37",
          shadowOpacity: 0.55,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: -2 },
          elevation: 18,
        }}
      >
        <Text className="text-black font-black" style={{ fontSize: 28, lineHeight: 32 }}>+</Text>
      </TouchableOpacity>

      {/* Row de tabs */}
      <View className="flex-row" style={{ height: BAR_H }}>
        {leftTabs.map((tab) => {
          const idx = state.routes.findIndex((r) => r.name === tab.name);
          return (
            <TabItem
              key={tab.name}
              label={tab.label}
              active={state.index === idx}
              onPress={() => navigation.navigate(tab.name)}
              icon={tab.icon(state.index === idx)}
            />
          );
        })}

        {/* Espaço central vazio pro FAB */}
        <View style={{ width: FAB_SIZE + 16 }} />

        {rightTabs.map((tab) => {
          const idx = state.routes.findIndex((r) => r.name === tab.name);
          return (
            <TabItem
              key={tab.name}
              label={tab.label}
              active={state.index === idx}
              onPress={() => navigation.navigate(tab.name)}
              icon={tab.icon(state.index === idx)}
              badge={"badge" in tab ? tab.badge : undefined}
            />
          );
        })}
      </View>

      {/* Safe area */}
      <View style={{ height: bottomPad }} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="artists" />
      <Tabs.Screen name="achievements" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
