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

function FloralDivider() {
  return (
    <View className="flex-row items-center justify-center my-1">
      <Text className="text-ink-gold-dim text-[11px] tracking-[4px]">{"\u2726 \u2767 \u2726"}</Text>
    </View>
  );
}

function statusLabel(s: Booking["status"]): { text: string; color: string; bg: string } {
  switch (s) {
    case "pending_quote":  return { text: "Aguardando Orçamento", color: "#f59e0b", bg: "#1a1200" };
    case "quote_received": return { text: "Proposta Recebida",    color: "#D4AF37", bg: "#1a1500" };
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
        className="bg-ink-card border border-ink-border-warm rounded-2xl p-4 mt-2.5"
      >
        <View className="flex-row justify-between items-center mb-2.5">
          <View
            className="rounded-[20px] px-2.5 py-1"
            style={{ backgroundColor: st.bg, borderWidth: 1, borderColor: st.color + "55" }}
          >
            <Text className="text-[10px] font-bold" style={{ color: st.color }}>{st.text}</Text>
          </View>
          <Text className="text-ink-dim text-[10px]">{b.createdAt}</Text>
        </View>
        <View className="gap-1.5">
          {[
            { label: "Artista", value: getArtistName(b.artistId) },
            { label: "Estilo",  value: getStyleName(b.styleId)  },
            { label: "Data",    value: `${b.preferredDate} às ${b.preferredTime}` },
          ].map(({ label, value }) => (
            <View key={label} className="flex-row justify-between">
              <Text className="text-ink-muted text-xs">{label}</Text>
              <Text className="text-white text-xs font-semibold">{value}</Text>
            </View>
          ))}
          {b.quoteValue ? (
            <View className="flex-row justify-between">
              <Text className="text-ink-muted text-xs">Valor</Text>
              <Text className="text-ink-gold text-[13px] font-black">R$ {b.quoteValue}</Text>
            </View>
          ) : null}
        </View>
        {(b.status === "pending_quote" || b.status === "quote_received") && (
          <View className="mt-3 border-t border-ink-border pt-2.5 items-center">
            <Text className="text-ink-gold-dim text-[11px] font-bold">
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
      <View className="mb-6">
        <View className="flex-row items-center mb-1">
          <Text className="text-white text-sm font-black uppercase tracking-[2px]">{title}</Text>
          <View className="flex-1 h-px bg-ink-border ml-3" />
          <View className="bg-ink-gold-dim rounded-[10px] w-5 h-5 items-center justify-center ml-2">
            <Text className="text-black text-[10px] font-black">{items.length}</Text>
          </View>
        </View>
        {items.map((b) => <BookingCard key={b.id} b={b} />)}
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-ink-bg" edges={["top"]}>
      {/* HEADER */}
      <View className="px-5 pt-4 pb-1">
        <Text className="text-ink-gold-dim text-[10px] uppercase tracking-[3px]">Ink Studio</Text>
        <Text className="text-white text-[22px] font-black uppercase tracking-[3px]">Meu Histórico</Text>
        <FloralDivider />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 }}>
        {bookings.length === 0 ? (
          <View className="items-center pt-[60px]">
            <Text className="text-[48px] mb-4">{"🎨"}</Text>
            <Text className="text-white text-lg font-black uppercase tracking-[2px] text-center mb-2">{"NENHUM\nAGENDAMENTO"}</Text>
            <FloralDivider />
            <Text className="text-ink-muted text-[13px] text-center mt-2 mb-8 leading-5">{"Você ainda não tem pedidos.\nQue tal marcar sua próxima tattoo?\nUse o botão + abaixo!"}</Text>
          </View>
        ) : (
          <>
            {/* Stats */}
            <View className="flex-row gap-2 mb-6">
              {[
                { label: "Pendentes",  value: pending.length + withQuote.length, color: "#f59e0b" },
                { label: "Agendados",  value: confirmed.length,                  color: "#22c55e" },
                { label: "Concluídos", value: completed.length,                  color: "#a1a1aa" },
              ].map((s) => (
                <View key={s.label} className="flex-1 bg-ink-card rounded-xl border border-ink-border-warm p-3 items-center">
                  <Text className="text-[22px] font-black" style={{ color: s.color }}>{s.value}</Text>
                  <Text className="text-ink-muted text-[10px] mt-0.5">{s.label}</Text>
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
        <View className="flex-1 justify-end bg-black/75">
          <View className="bg-ink-card rounded-t-3xl border-t-2 border-ink-gold-dim p-6 pb-10 max-h-[90%]">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="w-12 h-1 bg-ink-gold-dim rounded-full self-center mb-5" />

              {selected && (
                <>
                  <View className="flex-row justify-between items-start mb-4">
                    <View>
                      <Text className="text-ink-gold-dim text-[10px] font-bold uppercase tracking-[2px]">Detalhes do Pedido</Text>
                      <Text className="text-white text-lg font-black mt-1">{getArtistName(selected.artistId)}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setQuoteModal(false)}
                      className="w-8 h-8 rounded-full bg-ink-surface items-center justify-center"
                    >
                      <Text className="text-white text-base">✕</Text>
                    </TouchableOpacity>
                  </View>

                  <View className="bg-[#0d0d0d] rounded-xl p-4 mb-4 gap-2.5">
                    {[
                      { label: "Estilo",  value: getStyleName(selected.styleId) },
                      { label: "Tamanho", value: getSizeName(selected.sizeId) },
                      { label: "Data",    value: `${selected.preferredDate} às ${selected.preferredTime}` },
                      { label: "Cliente", value: selected.clientName },
                    ].map(({ label, value }) => (
                      <View key={label} className="flex-row justify-between">
                        <Text className="text-ink-muted text-xs">{label}</Text>
                        <Text className="text-white text-xs font-semibold">{value}</Text>
                      </View>
                    ))}
                  </View>

                  {activeQuote ? (
                    <View className="bg-[#1a1500] border border-ink-gold rounded-2xl p-5 mb-4">
                      <Text className="text-ink-gold-dim text-[10px] font-bold uppercase tracking-[2px] mb-2">
                        {"\u2726 Proposta do Artista"}
                      </Text>
                      <Text className="text-ink-gold text-[36px] font-black mb-1">
                        R$ {activeQuote.value}
                      </Text>
                      <Text className="text-ink-muted text-xs leading-[18px] mb-3.5">{activeQuote.note}</Text>

                      <View className="bg-[#0d0d0d] rounded-xl p-3.5 flex-row justify-between items-center mb-4">
                        <View>
                          <Text className="text-ink-muted text-[11px]">Caução necessária (20%)</Text>
                          <Text className="text-ink-gold text-[22px] font-black">
                            R$ {selected?.depositValue ?? Math.ceil((activeQuote.value * 0.2) / 10) * 10}
                          </Text>
                          <Text className="text-ink-dim text-[10px] mt-1">Restante pago no dia da sessão.</Text>
                        </View>
                        <Text className="text-[28px]">{"💳"}</Text>
                      </View>

                      {selected.status !== "confirmed" ? (
                        <TouchableOpacity
                          className="bg-ink-gold rounded-xl py-3.5 items-center"
                          onPress={handlePayDeposit}
                          activeOpacity={0.85}
                          style={{ shadowColor: "#D4AF37", shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 }}
                        >
                          <Text className="text-black font-black text-[13px] tracking-[2px] uppercase">
                            {"\u2726 Confirmar e Pagar Caução"}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View className="bg-[#001a0b] rounded-xl py-3.5 items-center border border-ink-green">
                          <Text className="text-ink-green font-black text-[13px] tracking-[2px]">SESSÃO CONFIRMADA ✓</Text>
                        </View>
                      )}
                    </View>
                  ) : (
                    selected.status === "pending_quote" && (
                      <View className="mb-4">
                        <View className="bg-[#1a1200] border border-[#f59e0b55] rounded-xl p-3.5 mb-3.5 flex-row items-start">
                          <Text className="text-base mr-2.5">{"⏳"}</Text>
                          <Text className="text-ink-muted text-xs flex-1 leading-[18px]">
                            Seu pedido está em análise. O artista entrará em contato em até 24h com a proposta.
                          </Text>
                        </View>
                        <TouchableOpacity
                          className="bg-[#1a1500] border-2 border-ink-gold rounded-xl py-3.5 items-center"
                          onPress={handleSimulate}
                          activeOpacity={0.85}
                        >
                          <Text className="text-ink-gold font-black text-[13px] tracking-[2px] uppercase">
                            {"\u2726 Simular Orçamento"}
                          </Text>
                          <Text className="text-ink-dim text-[10px] mt-1">(modo demo)</Text>
                        </TouchableOpacity>
                      </View>
                    )
                  )}

                  <TouchableOpacity
                    className="border border-ink-border rounded-xl py-3.5 items-center mt-1"
                    onPress={() => setQuoteModal(false)}
                    activeOpacity={0.8}
                  >
                    <Text className="text-ink-muted text-[13px] font-bold">Fechar</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL CAUÇÃO PAGA */}
      <Modal visible={depositModal} transparent animationType="fade" statusBarTranslucent>
        <View className="flex-1 items-center justify-center px-6 bg-black/[0.88]">
          <View className="bg-ink-card border border-ink-gold-dim rounded-3xl p-8 w-full items-center">
            <View
              className="w-[72px] h-[72px] rounded-full bg-ink-gold items-center justify-center mb-4"
              style={{ shadowColor: "#D4AF37", shadowOpacity: 0.5, shadowRadius: 16, elevation: 8 }}
            >
              <Text className="text-[32px]">{"🎉"}</Text>
            </View>
            <Text className="text-ink-gold text-[11px] font-black uppercase tracking-[3px] mb-1">Caução Confirmada!</Text>
            <FloralDivider />
            <Text className="text-white text-[20px] font-black text-center uppercase leading-[26px] mt-2 mb-3">{"SESSÃO\nAGENDADA!"}</Text>
            <Text className="text-ink-muted text-[13px] text-center leading-5 mb-6">
              {"Sua caução foi processada com sucesso.\nNos vemos na sessão!"}
            </Text>
            <TouchableOpacity
              className="bg-ink-gold w-full rounded-xl py-3.5 items-center"
              onPress={() => setDepositModal(false)}
              activeOpacity={0.85}
            >
              <Text className="text-black font-black text-[13px] tracking-[3px] uppercase">Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
