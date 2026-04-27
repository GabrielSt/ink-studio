import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GOLD = "#D4AF37";
const GOLD_DIM = "#b8972e";

function FloralDivider() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 4 }}>
      <Text style={{ color: GOLD_DIM, fontSize: 11, letterSpacing: 4 }}>{"\u2726 \u2767 \u2726"}</Text>
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
    color: GOLD,
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
  { name: "Bepantol Derma", type: "Cicatrizante", badge: "Recomendado", badgeColor: GOLD },
  { name: "Lubriderm S/ Perfume", type: "Hidratante", badge: "Popular", badgeColor: "#22c55e" },
  { name: "Neutrogena SPF 70", type: "Protetor Solar", badge: "Essencial", badgeColor: "#3b82f6" },
  { name: "Sabão Granado", type: "Limpeza", badge: "Neutro", badgeColor: "#8b5cf6" },
];

export default function AftercareScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0a0a" }} edges={["top"]}>
      {/* HEADER */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 }}>
        <Text style={{ color: GOLD_DIM, fontSize: 10, textTransform: "uppercase", letterSpacing: 3 }}>Ink Studio</Text>
        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "900", textTransform: "uppercase", letterSpacing: 3 }}>Cuidados</Text>
        <FloralDivider />
        <Text style={{ color: "#a1a1aa", fontSize: 12, marginTop: 4, lineHeight: 18 }}>
          Como cuidar da sua tatuagem para garantir a melhor cura.
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 }}
      >
        {/* TIMELINE */}
        <Text style={{ color: "#fff", fontSize: 14, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
          Fases de Cicatrização
        </Text>
        {STAGES.map((stage, i) => (
          <View key={stage.day} style={{ flexDirection: "row", marginBottom: 16 }}>
            {/* Timeline line + dot */}
            <View style={{ alignItems: "center", marginRight: 14, width: 28 }}>
              <View style={{
                width: 28, height: 28, borderRadius: 14,
                backgroundColor: "#111", borderWidth: 2, borderColor: stage.color,
                alignItems: "center", justifyContent: "center",
              }}>
                <Text style={{ fontSize: 12 }}>{stage.icon}</Text>
              </View>
              {i < STAGES.length - 1 && (
                <View style={{ width: 2, flex: 1, backgroundColor: "#1f1f1f", marginTop: 4 }} />
              )}
            </View>
            {/* Content */}
            <View style={{
              flex: 1, backgroundColor: "#111111",
              borderRadius: 14, borderWidth: 1, borderColor: "#1f1f1f",
              borderLeftWidth: 3, borderLeftColor: stage.color,
              padding: 14, marginBottom: 4,
            }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <Text style={{ color: "#fff", fontSize: 13, fontWeight: "800" }}>{stage.title}</Text>
                <View style={{ backgroundColor: stage.color + "22", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                  <Text style={{ color: stage.color, fontSize: 9, fontWeight: "700" }}>{stage.day}</Text>
                </View>
              </View>
              <Text style={{ color: "#a1a1aa", fontSize: 12, lineHeight: 18 }}>{stage.tip}</Text>
            </View>
          </View>
        ))}

        {/* DIVIDER */}
        <View style={{ marginVertical: 24 }}>
          <FloralDivider />
        </View>

        {/* DOS & DON'TS */}
        <Text style={{ color: "#fff", fontSize: 14, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
          O Que Fazer e Evitar
        </Text>
        <View style={{ backgroundColor: "#111111", borderRadius: 16, borderWidth: 1, borderColor: "#1f1f1f", padding: 16, marginBottom: 24 }}>
          {RULES.map((rule, i) => (
            <View key={i} style={{
              flexDirection: "row", alignItems: "flex-start",
              paddingVertical: 10,
              borderBottomWidth: i < RULES.length - 1 ? 1 : 0,
              borderBottomColor: "#1a1a1a",
            }}>
              <Text style={{ fontSize: 14, marginRight: 12, marginTop: 1 }}>{rule.icon}</Text>
              <Text style={{ color: rule.icon === "✅" ? "#d4d4d8" : "#71717a", fontSize: 13, flex: 1, lineHeight: 18 }}>{rule.text}</Text>
            </View>
          ))}
        </View>

        {/* PRODUCTS */}
        <Text style={{ color: "#fff", fontSize: 14, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
          Produtos Indicados
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
          {PRODUCTS.map((p) => (
            <View key={p.name} style={{
              width: "47%",
              backgroundColor: "#111111", borderRadius: 14,
              borderWidth: 1, borderColor: "#1f1f1f",
              padding: 14,
            }}>
              <View style={{
                alignSelf: "flex-start",
                backgroundColor: p.badgeColor + "22",
                borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, marginBottom: 8,
              }}>
                <Text style={{ color: p.badgeColor, fontSize: 9, fontWeight: "800" }}>{p.badge}</Text>
              </View>
              <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700", marginBottom: 4 }}>{p.name}</Text>
              <Text style={{ color: "#a1a1aa", fontSize: 11 }}>{p.type}</Text>
            </View>
          ))}
        </View>

        {/* RETOQUE CTA */}
        <View style={{
          backgroundColor: "#111111", borderWidth: 1, borderColor: GOLD_DIM,
          borderRadius: 18, padding: 20, alignItems: "center",
        }}>
          <Text style={{ fontSize: 28, marginBottom: 8 }}>🎨</Text>
          <Text style={{ color: GOLD, fontSize: 13, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
            Precisa de Retoque?
          </Text>
          <FloralDivider />
          <Text style={{ color: "#a1a1aa", fontSize: 12, textAlign: "center", lineHeight: 18, marginTop: 4 }}>
            {"Após a cura completa (≥2 meses),\nagende seu retoque gratuito com o mesmo artista."}
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 16, backgroundColor: GOLD,
              borderRadius: 12, paddingHorizontal: 28, paddingVertical: 12,
            }}
            activeOpacity={0.85}
          >
            <Text style={{ color: "#000", fontWeight: "900", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>
              Agendar Retoque
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
