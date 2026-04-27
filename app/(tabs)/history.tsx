import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../../context/AppContext";
import { ARTISTS, TATTOO_STYLES, TATTOO_SIZES, GENERIC_STYLE, Booking } from "../../data/mock";

const GOLD = "#D4AF37";
const GOLD_DIM = "#b8972e";

function FloralDivider() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 4 }}>
      <Text style={{ color: GOLD_DIM, fontSize: 11, letterSpacing: 4 }}>{"\u2726 \u2767 \u2726"}</Text>
    </View>
  );
}

function statusLabel(s: Booking["status"]): { text: string; color: string; bg: string } {
  switch (s) {
    case "pending_quote":  return { text: "Aguardando Orçamento", color: "#f59e0b", bg: "#1a1200" };
    case "quote_received": return { text: "Proposta Recebida",    color: GOLD,      bg: "#1a1500" };
    case "confirmed":      return { text: "Agendado",             color: "#22c55e", bg: "#001a0b" };
    case "completed":      return { text: "Concluído",            color: "#a1a1aa", bg: "#111111" };
  }
}

function getArtistName(id: string) {
  return ARTISTS.find((a) => a.id === id)?.name ?? "Qualquer artista";
}
function getStyleName(id: string) {
  if (id === "generic") return GENERIC_STYLE.label;
  return TATTOO_STYLES.find((s) => s.id === id)?.label ?? id;
}
function getSizeName(id: string) {
  const s = TATTOO_SIZES.find((s) => s.id === id);
  return s ? `${s.label} — ${s.description}` : id;
}

function generateQuote(booking: Booking): { value: number; note: string } {
  const base: Record<string, number> = { xs: 250, s: 480, m: 850, l: 1400, xl: 2200 };
  const raw = (base[booking.sizeId] ?? 700) + Math.floor(Math.random() * 300);
  const rounded = Math.ceil(raw / 50) * 50;
  const notes = [
    "Inclui duas sessões de retoque gratuitas.",
    "Preço final pode variar conforme a complexidade do design.",
    "Sessão estimada em 3–4 horas.",
    "Inclui cicatrizante profissional.",
  ];
  return { value: rounded, note: notes[Math.floor(Math.random() * notes.length)] };
}

export default function HistoryScreen() {
  const router = useRouter();
  const { bookings, updateBooking } = useApp();

  const [selected, setSelected] = useState<Booking | null>(null);
  const [quoteModal, setQuoteModal] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [simQuote, setSimQuote] = useState<{ value: number; note: string } | null>(null);

  const pending   = bookings.filter((b) => b.status === "pending_quote");
  const withQuote = bookings.filter((b) => b.status === "quote_received");
  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const completed = bookings.filter((b) => b.status === "completed");

  const openBooking = (b: Booking) => {
    setSelected(b);
    setSimQuote(null);
    setQuoteModal(true);
  };

  const handleSimulate = () => {
    if (!selected) return;
    const q = generateQuote(selected);
    const deposit = Math.ceil((q.value * 0.2) / 10) * 10;
    setSimQuote(q);
    updateBooking(selected.id, { status: "quote_received", quoteValue: q.value, depositValue: deposit });
    setSelected((prev) => prev ? { ...prev, status: "quote_received", quoteValue: q.value, depositValue: deposit } : null);
  };

  const handlePayDeposit = () => {
    if (!selected) return;
    updateBooking(selected.id, { status: "confirmed" });
    setSelected((prev) => prev ? { ...prev, status: "confirmed" } : null);
    setQuoteModal(false);
    setDepositModal(true);
  };

  const activeQuote = simQuote ?? (selected?.quoteValue ? { value: selected.quoteValue, note: "Proposta personalizada para seu projeto." } : null);

  function BookingCard({ b }: { b: Booking }) {
    const st = statusLabel(b.status);
    return (
      <TouchableOpacity
        onPress={() => openBooking(b)}
        activeOpacity={0.8}
        style={{ backgroundColor: "#111111", borderWidth: 1, borderColor: "#2a2310", borderRadius: 16, padding: 16, marginTop: 10 }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <View style={{ backgroundColor: st.bg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: st.color + "55" }}>
            <Text style={{ color: st.color, fontSize: 10, fontWeight: "700" }}>{st.text}</Text>
          </View>
          <Text style={{ color: "#52525b", fontSize: 10 }}>{b.createdAt}</Text>
        </View>
        <View style={{ gap: 6 }}>
          {[
            { label: "Artista", value: getArtistName(b.artistId) },
            { label: "Estilo",  value: getStyleName(b.styleId)  },
            { label: "Data",    value: `${b.preferredDate} às ${b.preferredTime}` },
          ].map(({ label, value }) => (
            <View key={label} style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: "#a1a1aa", fontSize: 12 }}>{label}</Text>
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>{value}</Text>
            </View>
          ))}
          {b.quoteValue ? (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: "#a1a1aa", fontSize: 12 }}>Valor</Text>
              <Text style={{ color: GOLD, fontSize: 13, fontWeight: "900" }}>R$ {b.quoteValue}</Text>
            </View>
          ) : null}
        </View>
        {(b.status === "pending_quote" || b.status === "quote_received") && (
          <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: "#1f1f1f", paddingTop: 10, alignItems: "center" }}>
            <Text style={{ color: GOLD_DIM, fontSize: 11, fontWeight: "700" }}>
              {b.status === "pending_quote" ? "Toque para ver detalhes e simular orçamento" : "Toque para ver a proposta recebida →"}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  function Section({ title, items }: { title: string; items: Booking[] }) {
    if (items.length === 0) return null;
    return (
      <View style={{ marginBottom: 24 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2 }}>{title}</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "#1f1f1f", marginLeft: 12 }} />
          <View style={{ backgroundColor: GOLD_DIM, borderRadius: 10, width: 20, height: 20, alignItems: "center", justifyContent: "center", marginLeft: 8 }}>
            <Text style={{ color: "#000", fontSize: 10, fontWeight: "900" }}>{items.length}</Text>
          </View>
        </View>
        {items.map((b) => <BookingCard key={b.id} b={b} />)}
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0a0a" }} edges={["top"]}>
      {/* HEADER */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 }}>
        <Text style={{ color: GOLD_DIM, fontSize: 10, textTransform: "uppercase", letterSpacing: 3 }}>Ink Studio</Text>
        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "900", textTransform: "uppercase", letterSpacing: 3 }}>Meu Histórico</Text>
        <FloralDivider />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 }}>
        {bookings.length === 0 ? (
          <View style={{ alignItems: "center", paddingTop: 60 }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>{"🎨"}</Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2, textAlign: "center", marginBottom: 8 }}>{"NENHUM\nAGENDAMENTO"}</Text>
            <FloralDivider />
            <Text style={{ color: "#a1a1aa", fontSize: 13, textAlign: "center", marginTop: 8, marginBottom: 32, lineHeight: 20 }}>{"Você ainda não tem pedidos.\nQue tal marcar sua próxima tattoo?\nUse o botão + abaixo!"}</Text>
          </View>
        ) : (
          <>
            {/* Stats */}
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 24 }}>
              {[
                { label: "Pendentes", value: pending.length + withQuote.length, color: "#f59e0b" },
                { label: "Agendados", value: confirmed.length, color: "#22c55e" },
                { label: "Concluídos", value: completed.length, color: "#a1a1aa" },
              ].map((s) => (
                <View key={s.label} style={{ flex: 1, backgroundColor: "#111111", borderRadius: 12, borderWidth: 1, borderColor: "#2a2310", padding: 12, alignItems: "center" }}>
                  <Text style={{ color: s.color, fontSize: 22, fontWeight: "900" }}>{s.value}</Text>
                  <Text style={{ color: "#a1a1aa", fontSize: 10, marginTop: 2 }}>{s.label}</Text>
                </View>
              ))}
            </View>
            <Section title="Aguardando Orçamento" items={pending} />
            <Section title="Proposta Recebida" items={withQuote} />
            <Section title="Agendamentos Futuros" items={confirmed} />
            <Section title="Concluídos" items={completed} />
          </>
        )}
      </ScrollView>

      {/* MODAL DETALHE + SIMULAR ORÇAMENTO */}
      <Modal visible={quoteModal} transparent animationType="slide" statusBarTranslucent>
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.75)" }}>
          <View style={{ backgroundColor: "#111111", borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 2, borderColor: GOLD_DIM, padding: 24, paddingBottom: 40, maxHeight: "90%" }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ width: 48, height: 4, backgroundColor: GOLD_DIM, borderRadius: 2, alignSelf: "center", marginBottom: 20 }} />

              {selected && (
                <>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <View>
                      <Text style={{ color: GOLD_DIM, fontSize: 10, fontWeight: "700", textTransform: "uppercase", letterSpacing: 2 }}>Detalhes do Pedido</Text>
                      <Text style={{ color: "#fff", fontSize: 18, fontWeight: "900", marginTop: 4 }}>{getArtistName(selected.artistId)}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setQuoteModal(false)} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#1f1f1f", alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ color: "#fff", fontSize: 16 }}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ backgroundColor: "#0d0d0d", borderRadius: 12, padding: 16, marginBottom: 16, gap: 10 }}>
                    {[
                      { label: "Estilo",   value: getStyleName(selected.styleId) },
                      { label: "Tamanho",  value: getSizeName(selected.sizeId) },
                      { label: "Data",     value: `${selected.preferredDate} às ${selected.preferredTime}` },
                      { label: "Cliente",  value: selected.clientName },
                    ].map(({ label, value }) => (
                      <View key={label} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: "#a1a1aa", fontSize: 12 }}>{label}</Text>
                        <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>{value}</Text>
                      </View>
                    ))}
                  </View>

                  {activeQuote ? (
                    <View style={{ backgroundColor: "#1a1500", borderWidth: 1, borderColor: GOLD, borderRadius: 16, padding: 20, marginBottom: 16 }}>
                      <Text style={{ color: GOLD_DIM, fontSize: 10, fontWeight: "700", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
                        {"\u2726 Proposta do Artista"}
                      </Text>
                      <Text style={{ color: GOLD, fontSize: 36, fontWeight: "900", marginBottom: 4 }}>
                        R$ {activeQuote.value}
                      </Text>
                      <Text style={{ color: "#a1a1aa", fontSize: 12, lineHeight: 18, marginBottom: 14 }}>{activeQuote.note}</Text>

                      <View style={{ backgroundColor: "#0d0d0d", borderRadius: 12, padding: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <View>
                          <Text style={{ color: "#a1a1aa", fontSize: 11 }}>Caução necessária (20%)</Text>
                          <Text style={{ color: GOLD, fontSize: 22, fontWeight: "900" }}>
                            R$ {selected?.depositValue ?? Math.ceil((activeQuote.value * 0.2) / 10) * 10}
                          </Text>
                          <Text style={{ color: "#52525b", fontSize: 10, marginTop: 4 }}>Restante pago no dia da sessão.</Text>
                        </View>
                        <Text style={{ fontSize: 28 }}>{"💳"}</Text>
                      </View>

                      {selected.status !== "confirmed" ? (
                        <TouchableOpacity
                          style={{ backgroundColor: GOLD, borderRadius: 12, paddingVertical: 14, alignItems: "center", shadowColor: GOLD, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 }}
                          onPress={handlePayDeposit}
                          activeOpacity={0.85}
                        >
                          <Text style={{ color: "#000", fontWeight: "900", fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>
                            {"\u2726 Confirmar e Pagar Caução"}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={{ backgroundColor: "#001a0b", borderRadius: 12, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "#22c55e" }}>
                          <Text style={{ color: "#22c55e", fontWeight: "900", fontSize: 13, letterSpacing: 2 }}>SESSÃO CONFIRMADA ✓</Text>
                        </View>
                      )}
                    </View>
                  ) : (
                    selected.status === "pending_quote" && (
                      <View style={{ marginBottom: 16 }}>
                        <View style={{ backgroundColor: "#1a1200", borderWidth: 1, borderColor: "#f59e0b55", borderRadius: 12, padding: 14, marginBottom: 14, flexDirection: "row", alignItems: "flex-start" }}>
                          <Text style={{ fontSize: 16, marginRight: 10 }}>{"⏳"}</Text>
                          <Text style={{ color: "#a1a1aa", fontSize: 12, flex: 1, lineHeight: 18 }}>
                            Seu pedido está em análise. O artista entrará em contato em até 24h com a proposta.
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={{ backgroundColor: "#1a1500", borderWidth: 2, borderColor: GOLD, borderRadius: 12, paddingVertical: 14, alignItems: "center" }}
                          onPress={handleSimulate}
                          activeOpacity={0.85}
                        >
                          <Text style={{ color: GOLD, fontWeight: "900", fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>
                            {"\u2726 Simular Orçamento"}
                          </Text>
                          <Text style={{ color: "#52525b", fontSize: 10, marginTop: 4 }}>(modo demo)</Text>
                        </TouchableOpacity>
                      </View>
                    )
                  )}

                  <TouchableOpacity
                    style={{ borderWidth: 1, borderColor: "#1f1f1f", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 4 }}
                    onPress={() => setQuoteModal(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={{ color: "#a1a1aa", fontSize: 13, fontWeight: "700" }}>Fechar</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL CAUÇÃO PAGA */}
      <Modal visible={depositModal} transparent animationType="fade" statusBarTranslucent>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, backgroundColor: "rgba(0,0,0,0.88)" }}>
          <View style={{ backgroundColor: "#111111", borderWidth: 1, borderColor: GOLD_DIM, borderRadius: 24, padding: 32, width: "100%", alignItems: "center" }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: GOLD, alignItems: "center", justifyContent: "center", marginBottom: 16, shadowColor: GOLD, shadowOpacity: 0.5, shadowRadius: 16, elevation: 8 }}>
              <Text style={{ fontSize: 32 }}>{"🎉"}</Text>
            </View>
            <Text style={{ color: GOLD, fontSize: 11, fontWeight: "900", textTransform: "uppercase", letterSpacing: 3, marginBottom: 4 }}>Caução Confirmada!</Text>
            <FloralDivider />
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "900", textAlign: "center", textTransform: "uppercase", lineHeight: 26, marginTop: 8, marginBottom: 12 }}>{"SESSÃO\nAGENDADA!"}</Text>
            <Text style={{ color: "#a1a1aa", fontSize: 13, textAlign: "center", lineHeight: 20, marginBottom: 24 }}>
              {"Sua caução foi processada com sucesso.\nNos vemos na sessão!"}
            </Text>
            <TouchableOpacity
              style={{ backgroundColor: GOLD, width: "100%", borderRadius: 12, paddingVertical: 14, alignItems: "center" }}
              onPress={() => setDepositModal(false)}
              activeOpacity={0.85}
            >
              <Text style={{ color: "#000", fontWeight: "900", fontSize: 13, letterSpacing: 3, textTransform: "uppercase" }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
