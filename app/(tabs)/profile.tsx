import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Switch,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useApp } from "../../context/AppContext";
import { ARTISTS, TATTOO_STYLES, TATTOO_SIZES, GENERIC_STYLE, Booking } from "../../data/mock";
import { BottomSheet } from "../../components/BottomSheet";
import { ArtistDetailModal } from "../../components/ArtistDetailModal";
import { ImageViewer } from "../../components/ImageViewer";

// ─── Dados do aftercare (inline para o modal) ─────────────────────────────────
const AFTERCARE_STAGES = [
  { day: "Dia 1–3",   title: "Inflamação Inicial", icon: "🔴", color: "#ef4444", tip: "Normal ficar vermelho, inchado e sensível. Mantenha o plástico por 2–4h, depois lave com sabão neutro." },
  { day: "Dia 4–7",   title: "Descamação",          icon: "🟠", color: "#f97316", tip: "A pele começa a descamar. Não arranque! Hidrate 2–3x ao dia com creme sem perfume." },
  { day: "Dia 8–14",  title: "Coceira & Película",  icon: "🟡", color: "#eab308", tip: "Coceira é sinal de cura. Bata levemente, nunca coce. Evite sol e piscina." },
  { day: "Dia 15–30", title: "Cura Superficial",    icon: "🟢", color: "#22c55e", tip: "Aparência opaca é normal — a cor plena volta em 4–6 semanas. Continue hidratando." },
  { day: "Mês 2–3",   title: "Cura Total",          icon: "✨", color: "#D4AF37", tip: "A tatuagem está curada! Aplique protetor solar FPS 50+ sempre que exposta ao sol." },
];
const AFTERCARE_RULES = [
  { icon: "✅", text: "Lave 2–3× ao dia com sabão neutro (sem perfume)" },
  { icon: "✅", text: "Hidrate com Bepantol, Lubriderm ou similar" },
  { icon: "✅", text: "Use roupas leves e soltas sobre a tatuagem" },
  { icon: "❌", text: "Não mergulhe em piscina, mar ou banheira" },
  { icon: "❌", text: "Não exponha ao sol direto sem protetor" },
  { icon: "❌", text: "Não coce nem arranque a descamação" },
];

// ─── helpers ──────────────────────────────────────────────────────────────────
function FloralDivider() {
  return (
    <View className="flex-row items-center justify-center my-1">
      <Text className="text-ink-gold-dim text-[11px] tracking-[4px]">{"\u2726 \u2767 \u2726"}</Text>
    </View>
  );
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

function statusLabel(s: Booking["status"]): { text: string; color: string; bg: string } {
  switch (s) {
    case "pending_quote":  return { text: "Aguardando Orçamento", color: "#f59e0b", bg: "#1a1200" };
    case "quote_received": return { text: "Proposta Recebida",    color: "#D4AF37", bg: "#1a1500" };
    case "confirmed":      return { text: "Agendado",             color: "#22c55e", bg: "#001a0b" };
    case "completed":      return { text: "Concluído",            color: "#a1a1aa", bg: "#111111" };
  }
}

const TATTOO_MOCK_SEEDS = ["ink1", "ink2", "ink3", "ink4", "ink5", "ink6"];

function generateQuote(booking: Booking): { value: number; note: string } {
  const base: Record<string, number> = { xs: 250, s: 480, m: 850, l: 1400, xl: 2200 };
  const raw = (base[booking.sizeId] ?? 700) + Math.floor(Math.random() * 300);
  const rounded = Math.ceil(raw / 50) * 50;
  return { value: rounded, note: "Proposta gerada automaticamente." };
}

// ─── Modal Agendamentos ───────────────────────────────────────────────────────
function BookingsModal({ bookings, updateBooking, onClose }: {
  bookings: Booking[];
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"active" | "done">("active");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [simQuote, setSimQuote] = useState<{ value: number; note: string } | null>(null);
  const [depositDone, setDepositDone] = useState(false);

  const active = bookings.filter((b) => b.status !== "completed");
  const done   = bookings.filter((b) => b.status === "completed");
  const list   = tab === "active" ? active : done;

  const openDetail = (b: Booking) => { setSelected(b); setSimQuote(null); setDepositDone(false); };

  const handleSimulate = () => {
    if (!selected) return;
    const q = generateQuote(selected);
    const deposit = Math.ceil((q.value * 0.2) / 10) * 10;
    setSimQuote(q);
    updateBooking(selected.id, { status: "quote_received", quoteValue: q.value, depositValue: deposit });
    setSelected((p) => p ? { ...p, status: "quote_received", quoteValue: q.value, depositValue: deposit } : null);
  };

  const handlePay = () => {
    if (!selected) return;
    updateBooking(selected.id, { status: "confirmed" });
    setSelected((p) => p ? { ...p, status: "confirmed" } : null);
    setDepositDone(true);
  };

  const activeQuote = simQuote ?? (selected?.quoteValue ? { value: selected.quoteValue, note: "Proposta personalizada." } : null);

  return (
    <BottomSheet visible onClose={onClose} maxHeight="92%">
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 mb-4">
          <Text className="text-white text-lg font-black uppercase tracking-[2px]">Agendamentos</Text>
          <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-ink-surface items-center justify-center">
            <Text className="text-white text-base">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row mx-6 mb-4 bg-ink-surface rounded-xl overflow-hidden">
          {([["active", "Activos"], ["done", "Concluídos"]] as const).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setTab(key)}
              className="flex-1 py-2.5 items-center"
              style={{ backgroundColor: tab === key ? "#D4AF37" : "transparent" }}
            >
              <Text className="text-xs font-black uppercase tracking-wide" style={{ color: tab === key ? "#000" : "#a1a1aa" }}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {list.length === 0 ? (
          <View className="items-center py-10 px-6">
            <Text className="text-[40px] mb-3">🗓️</Text>
            <Text className="text-ink-muted text-sm text-center">Nenhum agendamento {tab === "active" ? "activo" : "concluído"}</Text>
          </View>
        ) : (
          <View className="px-6 gap-3">
            {list.map((b) => {
              const st = statusLabel(b.status);
              return (
                <TouchableOpacity
                  key={b.id}
                  onPress={() => openDetail(b)}
                  activeOpacity={0.8}
                  className="bg-ink-surface rounded-2xl p-4"
                  style={{ borderWidth: 1, borderColor: "#2a2310" }}
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <View className="rounded-[20px] px-2.5 py-1" style={{ backgroundColor: st.bg, borderWidth: 1, borderColor: st.color + "55" }}>
                      <Text className="text-[10px] font-bold" style={{ color: st.color }}>{st.text}</Text>
                    </View>
                    <Text className="text-ink-dim text-[10px]">{b.createdAt}</Text>
                  </View>
                  <Text className="text-white text-sm font-bold mb-0.5">{getArtistName(b.artistId)}</Text>
                  <Text className="text-ink-muted text-xs">{getStyleName(b.styleId)} · {b.preferredDate}</Text>
                  {b.quoteValue ? (
                    <Text className="text-ink-gold text-sm font-black mt-1">R$ {b.quoteValue}</Text>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Detalhe do booking seleccionado */}
        {selected && (
          <View className="mx-6 mt-5 bg-ink-surface rounded-2xl border border-ink-gold-dim p-5">
            <View className="flex-row justify-between items-start mb-3">
              <Text className="text-ink-gold-dim text-[10px] font-bold uppercase tracking-[2px]">Detalhe</Text>
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Text className="text-ink-dim text-xs">fechar ✕</Text>
              </TouchableOpacity>
            </View>
            <View className="gap-2 mb-4">
              {[
                { label: "Artista",  value: getArtistName(selected.artistId) },
                { label: "Estilo",   value: getStyleName(selected.styleId) },
                { label: "Tamanho",  value: getSizeName(selected.sizeId) },
                { label: "Data",     value: `${selected.preferredDate} às ${selected.preferredTime}` },
                { label: "Cliente",  value: selected.clientName },
              ].map(({ label, value }) => (
                <View key={label} className="flex-row justify-between">
                  <Text className="text-ink-muted text-xs">{label}</Text>
                  <Text className="text-white text-xs font-semibold">{value}</Text>
                </View>
              ))}
            </View>

            {depositDone ? (
              <View className="bg-[#001a0b] rounded-xl py-3 items-center border border-ink-green">
                <Text className="text-ink-green font-black text-xs tracking-[2px]">SESSÃO CONFIRMADA ✓</Text>
              </View>
            ) : activeQuote ? (
              <View>
                <View className="bg-[#1a1500] rounded-xl p-4 mb-3 border border-ink-gold">
                  <Text className="text-ink-gold-dim text-[10px] font-bold uppercase mb-1">{"\u2726 Proposta"}</Text>
                  <Text className="text-ink-gold text-[28px] font-black">R$ {activeQuote.value}</Text>
                  <Text className="text-ink-muted text-[11px] mt-1">{activeQuote.note}</Text>
                  <View className="flex-row justify-between items-center mt-3 bg-[#0d0d0d] rounded-lg p-3">
                    <View>
                      <Text className="text-ink-muted text-[10px]">Caução (20%)</Text>
                      <Text className="text-ink-gold text-lg font-black">
                        R$ {selected?.depositValue ?? Math.ceil((activeQuote.value * 0.2) / 10) * 10}
                      </Text>
                    </View>
                    <Text className="text-[24px]">💳</Text>
                  </View>
                </View>
                {selected.status !== "confirmed" && (
                  <TouchableOpacity
                    className="bg-ink-gold rounded-xl py-3.5 items-center"
                    onPress={handlePay}
                    activeOpacity={0.85}
                    style={{ shadowColor: "#D4AF37", shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 }}
                  >
                    <Text className="text-black font-black text-xs tracking-[2px] uppercase">{"\u2726 Confirmar e Pagar Caução"}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : selected.status === "pending_quote" ? (
              <TouchableOpacity
                className="bg-[#1a1500] border-2 border-ink-gold rounded-xl py-3 items-center"
                onPress={handleSimulate}
                activeOpacity={0.85}
              >
                <Text className="text-ink-gold font-black text-xs tracking-[2px] uppercase">{"\u2726 Simular Orçamento"}</Text>
                <Text className="text-ink-dim text-[10px] mt-0.5">(modo demo)</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
    </BottomSheet>
  );
}

// ─── Modal Orçamentos ─────────────────────────────────────────────────────────
function QuotesModal({ bookings, updateBooking, onClose }: {
  bookings: Booking[];
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  onClose: () => void;
}) {
  const pending = bookings.filter((b) => b.status === "pending_quote" || b.status === "quote_received");

  const handleSimulate = (b: Booking) => {
    const q = generateQuote(b);
    const deposit = Math.ceil((q.value * 0.2) / 10) * 10;
    updateBooking(b.id, { status: "quote_received", quoteValue: q.value, depositValue: deposit });
  };
  const handlePay = (b: Booking) => {
    updateBooking(b.id, { status: "confirmed" });
  };

  return (
    <BottomSheet visible onClose={onClose} maxHeight="85%">
        <View className="flex-row justify-between items-center px-6 mb-5">
          <Text className="text-white text-lg font-black uppercase tracking-[2px]">Orçamentos</Text>
          <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-ink-surface items-center justify-center">
            <Text className="text-white text-base">✕</Text>
          </TouchableOpacity>
        </View>

        {pending.length === 0 ? (
          <View className="items-center py-10 px-6">
            <Text className="text-[40px] mb-3">💬</Text>
            <Text className="text-ink-muted text-sm text-center">Nenhum orçamento pendente</Text>
            <FloralDivider />
          </View>
        ) : (
          <View className="px-6 gap-4">
            {pending.map((b) => (
              <View key={b.id} className="bg-ink-surface rounded-2xl p-4 border border-ink-border-warm">
                <Text className="text-white text-sm font-bold mb-1">{getArtistName(b.artistId)}</Text>
                <Text className="text-ink-muted text-xs mb-3">{getStyleName(b.styleId)} · {b.preferredDate}</Text>

                {b.status === "quote_received" && b.quoteValue ? (
                  <View>
                    <View className="bg-[#1a1500] rounded-xl p-3 mb-2 border border-ink-gold">
                      <Text className="text-ink-gold text-[22px] font-black">R$ {b.quoteValue}</Text>
                      <Text className="text-ink-muted text-[10px] mt-0.5">Caução: R$ {b.depositValue}</Text>
                    </View>
                    <TouchableOpacity
                      className="bg-ink-gold rounded-xl py-3 items-center"
                      onPress={() => handlePay(b)}
                      activeOpacity={0.85}
                    >
                      <Text className="text-black font-black text-xs tracking-[2px] uppercase">✦ Pagar Caução</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    className="bg-[#1a1500] border-2 border-ink-gold rounded-xl py-3 items-center"
                    onPress={() => handleSimulate(b)}
                    activeOpacity={0.85}
                  >
                    <Text className="text-ink-gold font-black text-xs tracking-[2px] uppercase">✦ Simular Orçamento</Text>
                    <Text className="text-ink-dim text-[10px] mt-0.5">(modo demo)</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
    </BottomSheet>
  );
}

// ─── Modal Minhas Tattoos ─────────────────────────────────────────────────────
function TattoosModal({ bookings, onClose }: { bookings: Booking[]; onClose: () => void }) {
  const completed = bookings.filter((b) => b.status === "completed");
  const items = TATTOO_MOCK_SEEDS.map((seed, i) => {
    const booking = completed[i] ?? null;
    return { seed, booking };
  });
  const galleryUris = TATTOO_MOCK_SEEDS.map((s) => `https://picsum.photos/seed/${s}/600/800`);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <BottomSheet visible onClose={onClose} maxHeight="92%">
        <View className="flex-row justify-between items-center px-6 mb-2">
          <View>
            <Text className="text-white text-lg font-black uppercase tracking-[2px]">Minhas Tattoos</Text>
            <Text className="text-ink-muted text-xs mt-0.5">{items.length} peças na coleção · <Text className="text-ink-dim">toque para ampliar</Text></Text>
          </View>
          <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-ink-surface items-center justify-center">
            <Text className="text-white text-base">✕</Text>
          </TouchableOpacity>
        </View>
        <FloralDivider />

        <View className="flex-row flex-wrap px-4 gap-3 mt-4">
          {items.map(({ seed, booking }, i) => (
            <TouchableOpacity
              key={seed}
              onPress={() => setLightboxIndex(i)}
              activeOpacity={0.85}
              className="rounded-2xl overflow-hidden border border-ink-border-warm"
              style={{ width: "47%" }}
            >
              <Image
                source={{ uri: `https://picsum.photos/seed/${seed}/400/500` }}
                className="w-full"
                style={{ height: 180 }}
                resizeMode="cover"
              />
              <View className="absolute top-0 right-0 w-6 h-6 bg-ink-gold-dim rounded-bl-xl" />
              {/* zoom hint */}
              <View className="absolute bottom-10 right-2 bg-black/60 rounded-full w-6 h-6 items-center justify-center">
                <Text style={{ color: "#D4AF37", fontSize: 11 }}>⤢</Text>
              </View>
              <View className="bg-ink-surface p-2.5">
                {booking ? (
                  <>
                    <Text className="text-white text-xs font-bold">{getStyleName(booking.styleId)}</Text>
                    <Text className="text-ink-muted text-[10px] mt-0.5">{getArtistName(booking.artistId)}</Text>
                    <Text className="text-ink-dim text-[10px]">{booking.preferredDate}</Text>
                  </>
                ) : (
                  <>
                    <Text className="text-white text-xs font-bold">Sessão #{i + 1}</Text>
                    <Text className="text-ink-muted text-[10px] mt-0.5">Ink Studio</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>

      {lightboxIndex !== null && (
        <ImageViewer
          images={galleryUris}
          initialIndex={lightboxIndex}
          visible
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}

// ─── Modal Artistas Favoritos ─────────────────────────────────────────────────
function FavoriteArtistModal({ onClose }: { onClose: () => void }) {
  const { favoriteArtists, toggleFavoriteArtist, bookings, setPendingArtistId } = useApp();
  const router = useRouter();
  const [selectedArtist, setSelectedArtist] = useState<typeof ARTISTS[0] | null>(null);

  const sessionCount = (id: string) => bookings.filter((b) => b.artistId === id).length;
  const favList = ARTISTS.filter((a) => favoriteArtists.includes(a.id));

  const handleBook = (artist: typeof ARTISTS[0]) => {
    setPendingArtistId(artist.id);
    setSelectedArtist(null);
    onClose();
    router.push("/booking");
  };

  return (
    <>
      <BottomSheet visible onClose={onClose} maxHeight="85%">
          <View className="flex-row justify-between items-center px-6 mb-5">
            <View>
              <Text className="text-white text-lg font-black uppercase tracking-[2px]">Artistas Favoritos</Text>
              <Text className="text-ink-muted text-xs mt-0.5">{favList.length} artista(s) guardado(s)</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-ink-surface items-center justify-center">
              <Text className="text-white text-base">✕</Text>
            </TouchableOpacity>
          </View>

          {favList.length === 0 ? (
            <View className="items-center py-12 px-8">
              <Text className="text-[48px] mb-3">♥</Text>
              <Text className="text-white text-sm font-black mb-1">Nenhum artista favorito</Text>
              <Text className="text-ink-muted text-xs text-center leading-[18px]">
                Vá até a aba Artistas e toque no ♥ para adicionar aos favoritos.
              </Text>
            </View>
          ) : (
            <View className="px-6 gap-3">
              {favList.map((artist) => {
                const sessions = sessionCount(artist.id);
                return (
                  <TouchableOpacity
                    key={artist.id}
                    onPress={() => setSelectedArtist(artist)}
                    activeOpacity={0.85}
                    className="bg-ink-surface rounded-2xl border border-ink-border-warm p-4 flex-row items-center"
                  >
                    <Image
                      source={{ uri: artist.avatar }}
                      className="w-14 h-14 rounded-full border-2 border-ink-gold"
                      resizeMode="cover"
                    />
                    <View className="flex-1 ml-4">
                      <Text className="text-white text-sm font-black">{artist.name}</Text>
                      <Text className="text-ink-gold-dim text-[11px] mt-0.5">{artist.specialty}</Text>
                      <Text className="text-ink-muted text-[10px] mt-1">
                        {sessions > 0 ? `${sessions} sessão(ões) juntos` : "Nenhuma sessão ainda"}
                      </Text>
                    </View>
                    <View className="items-end gap-2">
                      <TouchableOpacity
                        onPress={(e) => { e.stopPropagation(); toggleFavoriteArtist(artist.id); }}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        className="w-8 h-8 rounded-full items-center justify-center"
                        style={{ backgroundColor: "#1a1500", borderWidth: 1, borderColor: "#D4AF37" }}
                      >
                        <Text style={{ fontSize: 14, color: "#D4AF37" }}>♥</Text>
                      </TouchableOpacity>
                      <Text className="text-ink-gold-dim text-[10px] font-bold">Ver →</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
      </BottomSheet>

      {/* ArtistDetailModal abre por cima do BottomSheet */}
      {selectedArtist && (
        <ArtistDetailModal
          artist={selectedArtist}
          onClose={() => setSelectedArtist(null)}
          onBook={() => handleBook(selectedArtist)}
          isFav={favoriteArtists.includes(selectedArtist.id)}
          onToggleFav={() => toggleFavoriteArtist(selectedArtist.id)}
        />
      )}
    </>
  );
}

// ─── Modal Cuidados Pós-Tattoo ────────────────────────────────────────────────
function AftercareModal({ onClose }: { onClose: () => void }) {
  return (
    <BottomSheet visible onClose={onClose} maxHeight="92%">
        <View className="flex-row justify-between items-center px-6 mb-2">
          <View>
            <Text className="text-white text-lg font-black uppercase tracking-[2px]">Cuidados Pós-Tattoo</Text>
            <Text className="text-ink-muted text-xs mt-0.5">Guia completo de cicatrização</Text>
          </View>
          <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-ink-surface items-center justify-center">
            <Text className="text-white text-base">✕</Text>
          </TouchableOpacity>
        </View>
        <FloralDivider />

        {/* Timeline */}
        <Text className="text-white text-xs font-black uppercase tracking-[2px] px-6 mt-4 mb-3">Fases de Cicatrização</Text>
        <View className="px-6">
          {AFTERCARE_STAGES.map((stage, i) => (
            <View key={stage.day} className="flex-row mb-3">
              <View className="items-center mr-3 w-6">
                <View className="w-6 h-6 rounded-full bg-ink-surface items-center justify-center" style={{ borderWidth: 2, borderColor: stage.color }}>
                  <Text style={{ fontSize: 9 }}>{stage.icon}</Text>
                </View>
                {i < AFTERCARE_STAGES.length - 1 && <View className="w-0.5 flex-1 bg-ink-border mt-1" />}
              </View>
              <View className="flex-1 bg-ink-surface rounded-[14px] border p-3 mb-1" style={{ borderColor: "#1f1f1f", borderLeftWidth: 3, borderLeftColor: stage.color }}>
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-white text-[12px] font-extrabold">{stage.title}</Text>
                  <View className="rounded px-1.5 py-0.5" style={{ backgroundColor: stage.color + "22" }}>
                    <Text className="text-[8px] font-bold" style={{ color: stage.color }}>{stage.day}</Text>
                  </View>
                </View>
                <Text className="text-ink-muted text-[11px] leading-[16px]">{stage.tip}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Regras */}
        <Text className="text-white text-xs font-black uppercase tracking-[2px] px-6 mt-4 mb-3">O Que Fazer e Evitar</Text>
        <View className="mx-6 bg-ink-surface rounded-2xl border border-ink-border p-4">
          {AFTERCARE_RULES.map((rule, i) => (
            <View key={i} className="flex-row items-start py-2" style={{ borderBottomWidth: i < AFTERCARE_RULES.length - 1 ? 1 : 0, borderBottomColor: "#1a1a1a" }}>
              <Text className="text-sm mr-3 mt-[1px]">{rule.icon}</Text>
              <Text className="text-[12px] flex-1 leading-[17px]" style={{ color: rule.icon === "✅" ? "#d4d4d8" : "#71717a" }}>{rule.text}</Text>
            </View>
          ))}
        </View>

        {/* CTA retoque */}
        <View className="mx-6 mt-5 bg-[#1a1500] border border-ink-gold-dim rounded-[18px] p-4 items-center">
          <Text className="text-[24px] mb-1">🎨</Text>
          <Text className="text-ink-gold text-[12px] font-black uppercase tracking-[2px] mb-1">Precisa de Retoque?</Text>
          <Text className="text-ink-muted text-[10px] text-center leading-[16px] mt-0.5">
            Após a cura completa (≥2 meses), agende seu retoque gratuito com o mesmo artista.
          </Text>
        </View>
    </BottomSheet>
  );
}

// ─── Modal Notificações ───────────────────────────────────────────────────────
function NotificationsModal({ onClose }: { onClose: () => void }) {
  const [toggles, setToggles] = useState({ orcamento: true, confirmacao: true, retoque: false, promo: false });
  const toggle = (key: keyof typeof toggles) => setToggles((p) => ({ ...p, [key]: !p[key] }));

  const items = [
    { key: "orcamento",   label: "Orçamento recebido",   desc: "Quando um artista enviar proposta" },
    { key: "confirmacao", label: "Sessão confirmada",     desc: "Confirmação de pagamento de caução" },
    { key: "retoque",     label: "Lembrete de retoque",   desc: "Após 2 meses da sua tattoo" },
    { key: "promo",       label: "Promoções e novidades", desc: "Ofertas exclusivas do estúdio" },
  ] as const;

  return (
    <BottomSheet visible onClose={onClose} noScroll>
      <View className="pb-10">
        <View className="flex-row justify-between items-center px-6 mb-5">
          <Text className="text-white text-lg font-black uppercase tracking-[2px]">Notificações</Text>
          <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-ink-surface items-center justify-center">
            <Text className="text-white text-base">✕</Text>
          </TouchableOpacity>
        </View>
        {items.map((item, i) => (
          <View
            key={item.key}
            className="flex-row items-center px-6 py-4"
            style={{ borderBottomWidth: i < items.length - 1 ? 1 : 0, borderBottomColor: "#1f1f1f" }}
          >
            <View className="flex-1 mr-4">
              <Text className="text-white text-sm font-bold">{item.label}</Text>
              <Text className="text-ink-muted text-xs mt-0.5">{item.desc}</Text>
            </View>
            <Switch
              value={toggles[item.key]}
              onValueChange={() => toggle(item.key)}
              trackColor={{ false: "#1f1f1f", true: "#b8972e" }}
              thumbColor={toggles[item.key] ? "#D4AF37" : "#52525b"}
            />
          </View>
        ))}
      </View>
    </BottomSheet>
  );
}

// ─── Modal Preferências ───────────────────────────────────────────────────────
function PreferencesModal({ onClose }: { onClose: () => void }) {
  return (
    <BottomSheet visible onClose={onClose} noScroll>
      <View className="pb-10">
        <View className="flex-row justify-between items-center px-6 mb-5">
          <Text className="text-white text-lg font-black uppercase tracking-[2px]">Preferências</Text>
          <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-ink-surface items-center justify-center">
            <Text className="text-white text-base">✕</Text>
          </TouchableOpacity>
        </View>
        {[
          { label: "Tema",   value: "Escuro (Dark)",    icon: "🌑" },
          { label: "Idioma", value: "Português (BR)",   icon: "🌎" },
          { label: "Moeda",  value: "BRL — Real",       icon: "💰" },
          { label: "Região", value: "São Paulo, SP",    icon: "📍" },
        ].map((item, i, arr) => (
          <View
            key={item.label}
            className="flex-row items-center px-6 py-4"
            style={{ borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: "#1f1f1f" }}
          >
            <Text className="text-xl mr-3">{item.icon}</Text>
            <View className="flex-1">
              <Text className="text-ink-muted text-[10px] uppercase tracking-[1px]">{item.label}</Text>
              <Text className="text-white text-sm font-semibold mt-0.5">{item.value}</Text>
            </View>
            <Text className="text-ink-dim text-xs">Em breve</Text>
          </View>
        ))}
        <View className="px-6 mt-4">
          <Text className="text-ink-dim text-xs text-center">Mais opções de personalização em breve.</Text>
        </View>
      </View>
    </BottomSheet>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────
type ModalKey = "bookings" | "quotes" | "tattoos" | "favorite" | "aftercare" | "notifications" | "preferences" | null;

export default function ProfileScreen() {
  const { profile, updateProfile, clearProfile, bookings, updateBooking, favoriteArtists } = useApp();
  const [openModal, setOpenModal] = useState<ModalKey>(null);
  const [editingField, setEditingField] = useState<"name" | "email" | "phone" | null>(null);
  const [editValue, setEditValue] = useState("");

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) updateProfile({ avatar: result.assets[0].uri });
  };

  const startEdit = (field: "name" | "email" | "phone") => {
    setEditingField(field);
    setEditValue(profile[field]);
  };
  const saveEdit = () => {
    if (editingField) updateProfile({ [editingField]: editValue.trim() });
    setEditingField(null);
  };

  const initials = profile.name
    ? profile.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "?";

  const pendingCount  = bookings.filter((b) => b.status === "pending_quote" || b.status === "quote_received").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;

  const CARDS = [
    { key: "bookings",      icon: "🗓️", label: "Agendamentos",  sub: `${bookings.length} total`,               badge: 0 },
    { key: "quotes",        icon: "💬", label: "Orçamentos",    sub: `${pendingCount} pendente(s)`,            badge: pendingCount },
    { key: "tattoos",       icon: "🎨", label: "Minhas Tattoos", sub: `${TATTOO_MOCK_SEEDS.length} peças`,      badge: 0 },
    { key: "favorite",      icon: "♥",  label: "Artistas Fav",  sub: `${favoriteArtists.length} guardado(s)`,  badge: 0 },
    { key: "aftercare",     icon: "💊", label: "Pós-Tattoo",    sub: "Guia de cuidados",                       badge: 0 },
    { key: "notifications", icon: "🔔", label: "Notificações",  sub: "Gerir alertas",                          badge: 0 },
    { key: "preferences",   icon: "⚙️", label: "Preferências",  sub: "Tema · idioma",                          badge: 0 },
  ] as const;

  return (
    <SafeAreaView className="flex-1 bg-ink-bg" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* HEADER */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-ink-gold-dim text-[10px] uppercase tracking-[3px]">Ink Studio</Text>
          <Text className="text-white text-[22px] font-black uppercase tracking-[3px]">Meu Perfil</Text>
          <FloralDivider />
        </View>

        {/* AVATAR + DADOS */}
        <View className="mx-4 mb-5 bg-ink-card rounded-2xl border border-ink-border-warm overflow-hidden">
          <View className="h-[3px] bg-ink-gold-dim" />
          <View className="p-5 items-center">
            {/* Avatar */}
            <TouchableOpacity onPress={pickAvatar} activeOpacity={0.8} className="relative mb-4">
              {profile.avatar ? (
                <Image source={{ uri: profile.avatar }} className="w-20 h-20 rounded-full border-2 border-ink-gold" resizeMode="cover" />
              ) : (
                <View className="w-20 h-20 rounded-full bg-ink-surface border-2 border-ink-gold-dim items-center justify-center">
                  <Text className="text-ink-gold text-[28px] font-black">{initials}</Text>
                </View>
              )}
              <View className="absolute bottom-0 right-0 bg-ink-gold-dim w-6 h-6 rounded-full items-center justify-center border-2 border-ink-card">
                <Text className="text-black text-[10px] font-black">✎</Text>
              </View>
            </TouchableOpacity>

            {/* Nome */}
            <TouchableOpacity onPress={() => startEdit("name")} className="items-center mb-1">
              {editingField === "name" ? (
                <TextInput
                  className="text-white text-lg font-black text-center border-b border-ink-gold pb-0.5"
                  value={editValue}
                  onChangeText={setEditValue}
                  onBlur={saveEdit}
                  onSubmitEditing={saveEdit}
                  autoFocus
                  style={{ minWidth: 160 }}
                />
              ) : (
                <Text className="text-white text-lg font-black">
                  {profile.name || "Toque para adicionar nome"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Email */}
            <TouchableOpacity onPress={() => startEdit("email")} className="mb-0.5">
              {editingField === "email" ? (
                <TextInput
                  className="text-ink-muted text-xs text-center border-b border-ink-gold-dim pb-0.5"
                  value={editValue}
                  onChangeText={setEditValue}
                  onBlur={saveEdit}
                  onSubmitEditing={saveEdit}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoFocus
                  style={{ minWidth: 180 }}
                />
              ) : (
                <Text className="text-ink-muted text-xs">{profile.email || "email@exemplo.com"}</Text>
              )}
            </TouchableOpacity>

            {/* Telefone */}
            <TouchableOpacity onPress={() => startEdit("phone")}>
              {editingField === "phone" ? (
                <TextInput
                  className="text-ink-dim text-xs text-center border-b border-ink-gold-dim pb-0.5"
                  value={editValue}
                  onChangeText={setEditValue}
                  onBlur={saveEdit}
                  onSubmitEditing={saveEdit}
                  keyboardType="phone-pad"
                  autoFocus
                  style={{ minWidth: 140 }}
                />
              ) : (
                <Text className="text-ink-dim text-xs">{profile.phone || "(11) 9 0000-0000"}</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Mini stats */}
          <View className="flex-row border-t border-ink-border">
            {[
              { label: "Sessões",    value: bookings.length },
              { label: "Concluídas", value: completedCount },
              { label: "Pendentes",  value: pendingCount },
            ].map((s, i, arr) => (
              <View key={s.label} className="flex-1 items-center py-3" style={{ borderRightWidth: i < arr.length - 1 ? 1 : 0, borderRightColor: "#1f1f1f" }}>
                <Text className="text-ink-gold text-base font-black">{s.value}</Text>
                <Text className="text-ink-muted text-[9px] mt-0.5">{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* GRID DE CARDS */}
        <View className="px-4">
          <Text className="text-ink-muted text-[10px] uppercase tracking-[3px] mb-3">Acções Rápidas</Text>
          <View className="flex-row flex-wrap gap-3">
            {CARDS.map((card) => (
              <TouchableOpacity
                key={card.key}
                onPress={() => setOpenModal(card.key)}
                activeOpacity={0.8}
                className="bg-ink-card rounded-2xl p-4 border border-ink-border-warm"
                style={{ width: "47%" }}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-[28px]">{card.icon}</Text>
                  {card.badge > 0 && (
                    <View className="bg-ink-gold rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
                      <Text className="text-black text-[10px] font-black">{card.badge}</Text>
                    </View>
                  )}
                </View>
                <Text className="text-white text-sm font-black">{card.label}</Text>
                <Text className="text-ink-dim text-[10px] mt-0.5">{card.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FOOTER */}
        <View className="mx-4 mt-8">
          <TouchableOpacity
            onPress={() => Alert.alert("Limpar Perfil", "Isto irá apagar os seus dados pessoais (não os agendamentos). Continuar?", [
              { text: "Cancelar", style: "cancel" },
              { text: "Limpar", style: "destructive", onPress: clearProfile },
            ])}
            className="border border-ink-border rounded-xl py-3.5 items-center"
            activeOpacity={0.7}
          >
            <Text className="text-ink-muted text-xs font-bold uppercase tracking-[2px]">Limpar Dados do Perfil</Text>
          </TouchableOpacity>
          <FloralDivider />
          <Text className="text-ink-dim text-[10px] text-center mt-1">Ink Studio · Est. 2012 · São Paulo, SP</Text>
        </View>
      </ScrollView>

      {/* MODAIS */}
      {openModal === "bookings"      && <BookingsModal      bookings={bookings} updateBooking={updateBooking} onClose={() => setOpenModal(null)} />}
      {openModal === "quotes"        && <QuotesModal        bookings={bookings} updateBooking={updateBooking} onClose={() => setOpenModal(null)} />}
      {openModal === "tattoos"       && <TattoosModal       bookings={bookings}                              onClose={() => setOpenModal(null)} />}
      {openModal === "favorite"      && <FavoriteArtistModal                                                 onClose={() => setOpenModal(null)} />}
      {openModal === "aftercare"     && <AftercareModal                                                      onClose={() => setOpenModal(null)} />}
      {openModal === "notifications" && <NotificationsModal                                                  onClose={() => setOpenModal(null)} />}
      {openModal === "preferences"   && <PreferencesModal                                                    onClose={() => setOpenModal(null)} />}
    </SafeAreaView>
  );
}
