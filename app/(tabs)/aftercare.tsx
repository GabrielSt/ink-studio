import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function FloralDivider() {
  return (
    <View className="flex-row items-center justify-center my-1">
      <Text className="text-ink-gold-dim text-[11px] tracking-[4px]">{"\u2726 \u2767 \u2726"}</Text>
    </View>
  );
}

const STAGES = [
  {
    day: "Dia 1–3",
    title: "Inflamação Inicial",
    icon: "🔴",
    color: "#ef4444",
    tip: "Normal ficar vermelho, inchado e sensível. Mantenha o plástico por 2–4h, depois lave com sabão neutro.",
  },
  {
    day: "Dia 4–7",
    title: "Descamação",
    icon: "🟠",
    color: "#f97316",
    tip: "A pele começa a descamar. Não arranque! Hidrate 2–3x ao dia com creme sem perfume.",
  },
  {
    day: "Dia 8–14",
    title: "Coceira & Película",
    icon: "🟡",
    color: "#eab308",
    tip: "Coceira é sinal de cura. Bata levemente, nunca coce. Evite sol e piscina.",
  },
  {
    day: "Dia 15–30",
    title: "Cura Superficial",
    icon: "🟢",
    color: "#22c55e",
    tip: "Aparência opaca é normal — a cor plena volta em 4–6 semanas. Continue hidratando.",
  },
  {
    day: "Mês 2–3",
    title: "Cura Total",
    icon: "✨",
    color: "#D4AF37",
    tip: "A tatuagem está curada! Aplique protetor solar FPS 50+ sempre que exposta ao sol.",
  },
];

const RULES = [
  { icon: "✅", text: "Lave 2–3× ao dia com sabão neutro (sem perfume)" },
  { icon: "✅", text: "Hidrate com Bepantol, Lubriderm ou similar" },
  { icon: "✅", text: "Use roupas leves e soltas sobre a tatuagem" },
  { icon: "✅", text: "Durma em lençol limpo e de cor clara" },
  { icon: "❌", text: "Não mergulhe em piscina, mar ou banheira" },
  { icon: "❌", text: "Não exponha ao sol direto sem protetor" },
  { icon: "❌", text: "Não coce nem arranque a descamação" },
  { icon: "❌", text: "Evite academia nos primeiros 5 dias" },
];

const PRODUCTS = [
  { name: "Bepantol Derma", type: "Cicatrizante", badge: "Recomendado", badgeColor: "#D4AF37" },
  { name: "Lubriderm S/ Perfume", type: "Hidratante", badge: "Popular", badgeColor: "#22c55e" },
  { name: "Neutrogena SPF 70", type: "Protetor Solar", badge: "Essencial", badgeColor: "#3b82f6" },
  { name: "Sabão Granado", type: "Limpeza", badge: "Neutro", badgeColor: "#8b5cf6" },
];

export default function AftercareScreen() {
  return (
    <SafeAreaView className="flex-1 bg-ink-bg" edges={["top"]}>
      {/* HEADER */}
      <View className="px-5 pt-4 pb-1">
        <Text className="text-ink-gold-dim text-[10px] uppercase tracking-[3px]">Ink Studio</Text>
        <Text className="text-white text-[22px] font-black uppercase tracking-[3px]">Cuidados</Text>
        <FloralDivider />
        <Text className="text-ink-muted text-xs mt-1 leading-[18px]">
          Como cuidar da sua tatuagem para garantir a melhor cura.
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 }}
      >
        {/* TIMELINE */}
        <Text className="text-white text-sm font-black uppercase tracking-[2px] mb-3">
          Fases de Cicatrização
        </Text>
        {STAGES.map((stage, i) => (
          <View key={stage.day} className="flex-row mb-4">
            {/* Timeline dot + line */}
            <View className="items-center mr-3.5 w-7">
              <View
                className="w-7 h-7 rounded-full bg-ink-card items-center justify-center"
                style={{ borderWidth: 2, borderColor: stage.color }}
              >
                <Text className="text-xs">{stage.icon}</Text>
              </View>
              {i < STAGES.length - 1 && (
                <View className="w-0.5 flex-1 bg-ink-border mt-1" />
              )}
            </View>
            {/* Content */}
            <View
              className="flex-1 bg-ink-card rounded-[14px] border border-ink-border p-3.5 mb-1"
              style={{ borderLeftWidth: 3, borderLeftColor: stage.color }}
            >
              <View className="flex-row justify-between items-center mb-1.5">
                <Text className="text-white text-[13px] font-extrabold">{stage.title}</Text>
                <View
                  className="rounded-lg px-2 py-[3px]"
                  style={{ backgroundColor: stage.color + "22" }}
                >
                  <Text className="text-[9px] font-bold" style={{ color: stage.color }}>{stage.day}</Text>
                </View>
              </View>
              <Text className="text-ink-muted text-xs leading-[18px]">{stage.tip}</Text>
            </View>
          </View>
        ))}

        {/* DIVIDER */}
        <View className="my-6">
          <FloralDivider />
        </View>

        {/* DOS & DON'TS */}
        <Text className="text-white text-sm font-black uppercase tracking-[2px] mb-3">
          O Que Fazer e Evitar
        </Text>
        <View className="bg-ink-card rounded-2xl border border-ink-border p-4 mb-6">
          {RULES.map((rule, i) => (
            <View
              key={i}
              className="flex-row items-start py-2.5"
              style={{ borderBottomWidth: i < RULES.length - 1 ? 1 : 0, borderBottomColor: "#1a1a1a" }}
            >
              <Text className="text-sm mr-3 mt-[1px]">{rule.icon}</Text>
              <Text
                className="text-[13px] flex-1 leading-[18px]"
                style={{ color: rule.icon === "✅" ? "#d4d4d8" : "#71717a" }}
              >
                {rule.text}
              </Text>
            </View>
          ))}
        </View>

        {/* PRODUCTS */}
        <Text className="text-white text-sm font-black uppercase tracking-[2px] mb-3">
          Produtos Indicados
        </Text>
        <View className="flex-row flex-wrap gap-2.5 mb-7">
          {PRODUCTS.map((p) => (
            <View
              key={p.name}
              className="bg-ink-card rounded-[14px] border border-ink-border p-3.5"
              style={{ width: "47%" }}
            >
              <View
                className="self-start rounded-[6px] px-[7px] py-[3px] mb-2"
                style={{ backgroundColor: p.badgeColor + "22" }}
              >
                <Text className="text-[9px] font-extrabold" style={{ color: p.badgeColor }}>{p.badge}</Text>
              </View>
              <Text className="text-white text-[13px] font-bold mb-1">{p.name}</Text>
              <Text className="text-ink-muted text-[11px]">{p.type}</Text>
            </View>
          ))}
        </View>

        {/* RETOQUE CTA */}
        <View className="bg-ink-card border border-ink-gold-dim rounded-[18px] p-5 items-center">
          <Text className="text-[28px] mb-2">🎨</Text>
          <Text className="text-ink-gold text-[13px] font-black uppercase tracking-[2px] mb-1">
            Precisa de Retoque?
          </Text>
          <FloralDivider />
          <Text className="text-ink-muted text-xs text-center leading-[18px] mt-1">
            {"Após a cura completa (≥2 meses),\nagende seu retoque gratuito com o mesmo artista."}
          </Text>
          <TouchableOpacity
            className="mt-4 bg-ink-gold rounded-xl px-7 py-3"
            activeOpacity={0.85}
          >
            <Text className="text-black font-black text-xs tracking-[2px] uppercase">
              Agendar Retoque
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
