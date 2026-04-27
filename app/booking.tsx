import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {
  ARTISTS,
  TATTOO_STYLES,
  BODY_LOCATIONS,
  TATTOO_SIZES,
  GENERIC_STYLE,
} from "../data/mock";
import { useApp } from "../context/AppContext";

type FormData = {
  name: string;
  phone: string;
  email: string;
  artistId: string;
  styleId: string;
  sizeId: string;
  bodyLocation: string;
  preferredDate: string;
  preferredTime: string;
  description: string;
  referenceImage: string | null;
};

const TIMES = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const MONTHS_PT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

// ── Inline DatePicker ──────────────────────────────────────────────────────
function DatePicker({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const selectedDate = value
    ? (() => {
        const p = value.split("/");
        if (p.length === 3) return new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0]));
        return null;
      })()
    : null;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };
  const selectDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    onChange(`${dd}/${mm}/${d.getFullYear()}`);
  };
  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < t;
  };
  const isSelected = (day: number) =>
    !!selectedDate &&
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getFullYear() === viewYear;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <View className="bg-ink-card border border-[#2a2a2a] rounded-2xl p-3 mb-5">
      <View className="flex-row items-center mb-3">
        <TouchableOpacity onPress={prevMonth} className="p-2">
          <Text className="text-ink-gold text-xl font-bold">{"<"}</Text>
        </TouchableOpacity>
        <Text className="flex-1 text-white font-black text-center tracking-[2px] uppercase text-[13px]">
          {MONTHS_PT[viewMonth]} {viewYear}
        </Text>
        <TouchableOpacity onPress={nextMonth} className="p-2">
          <Text className="text-ink-gold text-xl font-bold">{">"}</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row mb-1.5">
        {["D","S","T","Q","Q","S","S"].map((d, i) => (
          <Text key={i} className="flex-1 text-ink-gold text-[11px] font-extrabold text-center">{d}</Text>
        ))}
      </View>
      {weeks.map((week, wi) => (
        <View key={wi} className="flex-row mb-1">
          {week.map((day, di) => {
            const past = day !== null && isPast(day);
            const sel = day !== null && isSelected(day);
            return (
              <TouchableOpacity
                key={di}
                className="flex-1 items-center py-1.5"
                onPress={() => day && !past && selectDay(day)}
                activeOpacity={day && !past ? 0.7 : 1}
              >
                {day ? (
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: sel ? "#D4AF37" : "transparent" }}
                  >
                    <Text
                      className="text-[13px]"
                      style={{
                        color: sel ? "#0a0a0a" : past ? "#3a3a3a" : "#fff",
                        fontWeight: sel ? "900" : "500",
                      }}
                    >
                      {day}
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      {value ? (
        <View className="mt-2 bg-ink-surface rounded-[10px] p-2.5 border-l-[3px] border-ink-gold">
          <Text className="text-ink-gold text-xs font-extrabold">Data selecionada: {value}</Text>
        </View>
      ) : null}
    </View>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

function Label({ children }: { children: string }) {
  return (
    <Text className="text-ink-muted text-[11px] font-bold uppercase tracking-[2px] mb-2">
      {children}
    </Text>
  );
}

const EMPTY_FORM: FormData = {
  name: "", phone: "", email: "",
  artistId: "", styleId: "", sizeId: "",
  bodyLocation: "", preferredDate: "", preferredTime: "",
  description: "", referenceImage: null,
};

export default function BookingScreen() {
  const router = useRouter();
  const { addBooking, pendingArtistId, setPendingArtistId } = useApp();

  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormData>({
    ...EMPTY_FORM,
    artistId: pendingArtistId ?? "",
  });

  const update = (field: keyof FormData, value: string | null) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "artistId" && value) {
        const artist = ARTISTS.find((a) => a.id === value);
        if (artist && next.styleId !== "generic" && next.styleId !== "" && !artist.styles.includes(next.styleId)) {
          next.styleId = "";
        }
      }
      if (field === "styleId" && value && value !== "generic") {
        const artist = ARTISTS.find((a) => a.id === prev.artistId);
        if (artist && !artist.styles.includes(value)) {
          next.artistId = "";
        }
      }
      return next;
    });
  };

  const selectedArtist = ARTISTS.find((a) => a.id === form.artistId);
  const selectedStyle = form.styleId === "generic" ? GENERIC_STYLE : TATTOO_STYLES.find((s) => s.id === form.styleId);
  const selectedSize = TATTOO_SIZES.find((s) => s.id === form.sizeId);
  const selectedLocation = BODY_LOCATIONS.find((l) => l.id === form.bodyLocation);

  const availableStyles = form.artistId
    ? TATTOO_STYLES.filter((s) => selectedArtist?.styles.includes(s.id))
    : TATTOO_STYLES;

  const availableArtists =
    form.styleId && form.styleId !== "generic"
      ? ARTISTS.filter((a) => a.styles.includes(form.styleId))
      : ARTISTS;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") { Alert.alert("Permissao negada", "Precisamos de acesso a sua galeria."); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (!result.canceled && result.assets[0]) update("referenceImage", result.assets[0].uri);
  };

  const validateStep = (): boolean => {
    if (step === 1 && (!form.name.trim() || !form.phone.trim() || !form.email.trim())) {
      Alert.alert("Campos obrigatorios", "Preencha nome, telefone e e-mail."); return false;
    }
    if (step === 2 && (!form.artistId || !form.styleId || !form.sizeId)) {
      Alert.alert("Campos obrigatorios", "Escolha artista, estilo e tamanho."); return false;
    }
    if (step === 3 && (!form.bodyLocation || !form.preferredDate || !form.preferredTime)) {
      Alert.alert("Campos obrigatorios", "Informe local, data e horario."); return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 3) setStep(step + 1);
    else setShowModal(true);
  };

  const handleDone = () => {
    const id = Date.now().toString();
    addBooking({
      id,
      clientName: form.name,
      artistId: form.artistId,
      styleId: form.styleId,
      sizeId: form.sizeId,
      bodyLocation: form.bodyLocation,
      preferredDate: form.preferredDate,
      preferredTime: form.preferredTime,
      description: form.description,
      status: "pending_quote",
      createdAt: new Date().toLocaleDateString("pt-BR"),
    });
    setPendingArtistId(null);
    setShowModal(false);
    setStep(1);
    setForm(EMPTY_FORM);
    router.replace("/");
  };

  const STEP_LABELS = ["Seus Dados", "A Tatuagem", "Detalhes"];

  return (
    <SafeAreaView className="flex-1 bg-ink-bg">
      {/* TOP BAR */}
      <View className="flex-row items-center px-5 pt-4 pb-3">
        <TouchableOpacity
          onPress={() => {
            if (step > 1) {
              setStep(step - 1);
            } else {
              setPendingArtistId(null);
              router.back();
            }
          }}
          className="w-10 h-10 rounded-full bg-ink-card border border-ink-border items-center justify-center mr-3"
        >
          <Text className="text-ink-gold text-[22px]">{"<"}</Text>
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-ink-muted text-[10px] uppercase tracking-[3px]">Passo {step} de 3 · {STEP_LABELS[step - 1]}</Text>
          <Text className="text-white text-[17px] font-black uppercase tracking-[2px]">Agendamento</Text>
        </View>
        <View className="border border-ink-gold rounded-[20px] px-3 py-[5px]">
          <Text className="text-ink-gold text-[11px] font-bold">{step}/3</Text>
        </View>
      </View>

      {/* PROGRESS */}
      <View className="flex-row px-5 gap-2 mb-4">
        {[1, 2, 3].map((s) => (
          <View
            key={s}
            className="flex-1 h-[3px] rounded-sm"
            style={{ backgroundColor: s <= step ? "#D4AF37" : "#1f1f1f" }}
          />
        ))}
      </View>

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 32 }}>

          {/* STEP 1 */}
          {step === 1 && (
            <View className="px-5">
              <Text className="text-white text-lg font-black uppercase tracking-[2px] mb-1">Seus Dados de Contato</Text>
              <Text className="text-ink-muted text-xs mb-6 leading-[18px]">Usaremos esses dados para enviar seu orcamento personalizado.</Text>

              <Label>Nome Completo *</Label>
              <TextInput
                className="bg-ink-card border border-ink-border rounded-xl px-4 py-3.5 text-white text-sm mb-5"
                placeholder="Ex: Joao Silva"
                placeholderTextColor="#52525b"
                value={form.name}
                onChangeText={(v) => update("name", v)}
              />

              <Label>WhatsApp / Telefone *</Label>
              <TextInput
                className="bg-ink-card border border-ink-border rounded-xl px-4 py-3.5 text-white text-sm mb-5"
                placeholder="(11) 9 9999-9999"
                placeholderTextColor="#52525b"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(v) => update("phone", v)}
              />

              <Label>E-mail *</Label>
              <TextInput
                className="bg-ink-card border border-ink-border rounded-xl px-4 py-3.5 text-white text-sm mb-5"
                placeholder="seuemail@exemplo.com"
                placeholderTextColor="#52525b"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(v) => update("email", v)}
              />

              <View className="bg-ink-card border border-ink-gold rounded-2xl p-4 mt-1">
                <View className="flex-row items-center mb-2">
                  <View className="w-6 h-6 rounded-full bg-ink-gold items-center justify-center mr-2">
                    <Text className="text-black text-xs font-black">!</Text>
                  </View>
                  <Text className="text-ink-gold text-xs font-black uppercase tracking-[2px]">Como funciona o orcamento</Text>
                </View>
                <Text className="text-ink-muted text-xs leading-[18px]">
                  {"Apos enviar o pedido, nosso artista analisa e entra em contato via WhatsApp ou e-mail em "}
                  <Text className="text-white font-bold">ate 24 horas</Text>
                  {" com o valor e disponibilidade."}
                </Text>
              </View>
            </View>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <View className="px-5">
              <Text className="text-white text-lg font-black uppercase tracking-[2px] mb-1">Detalhes da Tatuagem</Text>
              <Text className="text-ink-muted text-xs mb-6 leading-[18px]">Quanto mais detalhes, mais preciso sera seu orcamento.</Text>

              {/* ARTISTA */}
              <Label>Escolha o Artista *</Label>
              {form.styleId && form.styleId !== "generic" && availableArtists.length < ARTISTS.length && (
                <View className="bg-[#1a150a] border border-ink-gold rounded-[10px] p-2.5 mb-3 flex-row items-center">
                  <Text className="text-ink-gold text-[11px]">{"✦ Mostrando artistas que fazem " + (selectedStyle?.label ?? "")}</Text>
                </View>
              )}
              <View className="gap-2 mb-5">
                {availableArtists.map((artist) => (
                  <TouchableOpacity
                    key={artist.id}
                    onPress={() => update("artistId", artist.id)}
                    activeOpacity={0.8}
                    className="flex-row items-center bg-ink-card rounded-xl p-3"
                    style={{ borderWidth: 1, borderColor: form.artistId === artist.id ? "#D4AF37" : "#1f1f1f" }}
                  >
                    <Image source={{ uri: artist.avatar }} className="w-12 h-12 rounded-full" resizeMode="cover" />
                    <View className="flex-1 ml-3">
                      <Text className="text-white text-[13px] font-bold">{artist.name}</Text>
                      <Text className="text-ink-gold text-[11px] mt-0.5">{artist.specialty}</Text>
                      <Text className="text-ink-muted text-[10px] mt-0.5">{artist.experience}</Text>
                    </View>
                    <View
                      className="w-5 h-5 rounded-full items-center justify-center"
                      style={{
                        borderWidth: 2,
                        borderColor: form.artistId === artist.id ? "#D4AF37" : "#52525b",
                        backgroundColor: form.artistId === artist.id ? "#D4AF37" : "transparent",
                      }}
                    >
                      {form.artistId === artist.id && <Text className="text-black text-[10px] font-black">v</Text>}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* ESTILO */}
              <Label>Estilo *</Label>
              {form.artistId && availableStyles.length < TATTOO_STYLES.length && (
                <View className="bg-[#1a150a] border border-ink-gold rounded-[10px] p-2.5 mb-3 flex-row items-center">
                  <Text className="text-ink-gold text-[11px]">{"✦ Estilos de " + (selectedArtist?.name ?? "")}</Text>
                </View>
              )}
              <View className="flex-row flex-wrap gap-2 mb-2">
                {availableStyles.map((style) => (
                  <TouchableOpacity
                    key={style.id}
                    onPress={() => update("styleId", style.id)}
                    activeOpacity={0.8}
                    className="flex-row items-center rounded-xl px-3.5 py-2.5"
                    style={{
                      borderWidth: 1,
                      borderColor: form.styleId === style.id ? "#D4AF37" : "#1f1f1f",
                      backgroundColor: form.styleId === style.id ? "#D4AF37" : "#111111",
                    }}
                  >
                    <Text className="text-sm mr-1.5">{style.emoji}</Text>
                    <Text
                      className="text-[11px] font-bold"
                      style={{ color: form.styleId === style.id ? "#000" : "#fff" }}
                    >
                      {style.label}
                    </Text>
                  </TouchableOpacity>
                ))}
                {/* Estilo genérico */}
                <TouchableOpacity
                  onPress={() => update("styleId", "generic")}
                  activeOpacity={0.8}
                  className="flex-row items-center rounded-xl px-3.5 py-2.5"
                  style={{
                    borderWidth: 1,
                    borderStyle: "dashed",
                    borderColor: form.styleId === "generic" ? "#D4AF37" : "#52525b",
                    backgroundColor: form.styleId === "generic" ? "#D4AF37" : "#0d0d0d",
                  }}
                >
                  <Text className="text-sm mr-1.5">{"✨"}</Text>
                  <Text
                    className="text-[11px] font-bold"
                    style={{ color: form.styleId === "generic" ? "#000" : "#a1a1aa" }}
                  >
                    Nao sei / Simples
                  </Text>
                </TouchableOpacity>
              </View>
              {form.styleId === "generic" && (
                <View className="mb-4 bg-[#1a150a] rounded-[10px] p-2.5 border-l-[3px] border-ink-gold">
                  <Text className="text-ink-gold text-[11px]">{"✦ Qualquer artista pode atender esse pedido"}</Text>
                </View>
              )}
              <View className="mb-5" />

              {/* TAMANHO */}
              <Label>Tamanho Estimado *</Label>
              <View className="flex-row gap-2 mb-2">
                {TATTOO_SIZES.map((size) => (
                  <TouchableOpacity
                    key={size.id}
                    onPress={() => update("sizeId", size.id)}
                    activeOpacity={0.8}
                    className="flex-1 rounded-xl py-3 items-center"
                    style={{
                      borderWidth: 1,
                      borderColor: form.sizeId === size.id ? "#D4AF37" : "#1f1f1f",
                      backgroundColor: form.sizeId === size.id ? "#D4AF37" : "#111111",
                    }}
                  >
                    <Text
                      className="text-[13px] font-black"
                      style={{ color: form.sizeId === size.id ? "#000" : "#fff" }}
                    >
                      {size.label}
                    </Text>
                    <Text
                      className="text-[9px] mt-0.5"
                      style={{ color: form.sizeId === size.id ? "#000" : "#a1a1aa" }}
                    >
                      {size.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {selectedSize && (
                <View className="mb-5 px-3 py-2 bg-ink-card border border-ink-gold rounded-xl flex-row items-center">
                  <Text className="text-ink-gold text-xs font-bold">{"💰 " + selectedSize.priceRange}</Text>
                </View>
              )}
            </View>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <View className="px-5">
              <Text className="text-white text-lg font-black uppercase tracking-[2px] mb-1">Local, Data e Referencia</Text>
              <Text className="text-ink-muted text-xs mb-6 leading-[18px]">Finalize com onde e quando voce quer tatuar.</Text>

              <Label>Local no Corpo *</Label>
              <View className="flex-row flex-wrap gap-2 mb-5">
                {BODY_LOCATIONS.map((loc) => (
                  <TouchableOpacity
                    key={loc.id}
                    onPress={() => update("bodyLocation", loc.id)}
                    activeOpacity={0.8}
                    className="rounded-xl px-3.5 py-2.5"
                    style={{
                      borderWidth: 1,
                      borderColor: form.bodyLocation === loc.id ? "#D4AF37" : "#1f1f1f",
                      backgroundColor: form.bodyLocation === loc.id ? "#D4AF37" : "#111111",
                    }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{ color: form.bodyLocation === loc.id ? "#000" : "#fff" }}
                    >
                      {loc.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Label>Data Preferida *</Label>
              <DatePicker value={form.preferredDate} onChange={(d) => update("preferredDate", d)} />

              <Label>Horario Preferido *</Label>
              <View className="flex-row flex-wrap gap-2 mb-5">
                {TIMES.map((time) => (
                  <TouchableOpacity
                    key={time}
                    onPress={() => update("preferredTime", time)}
                    activeOpacity={0.8}
                    className="rounded-xl px-3.5 py-2.5"
                    style={{
                      borderWidth: 1,
                      borderColor: form.preferredTime === time ? "#D4AF37" : "#1f1f1f",
                      backgroundColor: form.preferredTime === time ? "#D4AF37" : "#111111",
                    }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{ color: form.preferredTime === time ? "#000" : "#fff" }}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Label>Descricao / Ideia da Tatuagem</Label>
              <TextInput
                className="bg-ink-card border border-ink-border rounded-xl px-4 py-3.5 text-white text-sm mb-5 min-h-[100px]"
                placeholder="Descreva sua ideia, cores, elementos que deseja..."
                placeholderTextColor="#52525b"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={form.description}
                onChangeText={(v) => update("description", v)}
              />

              <Label>Foto de Referencia (opcional)</Label>
              {form.referenceImage ? (
                <View className="relative mb-5">
                  <Image source={{ uri: form.referenceImage }} className="w-full h-48 rounded-xl" resizeMode="cover" />
                  <TouchableOpacity
                    className="absolute top-2 right-2 bg-black/70 rounded-[20px] w-8 h-8 items-center justify-center"
                    onPress={() => update("referenceImage", null)}
                  >
                    <Text className="text-white text-sm">X</Text>
                  </TouchableOpacity>
                  <View className="absolute bottom-2 left-2 bg-ink-gold rounded-lg px-2 py-1">
                    <Text className="text-black text-[10px] font-black">Referencia adicionada</Text>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={pickImage}
                  activeOpacity={0.8}
                  className="bg-ink-card border border-dashed border-ink-border rounded-xl py-8 items-center mb-5"
                >
                  <Text className="text-[36px] mb-2">🖼️</Text>
                  <Text className="text-white text-[13px] font-bold">Adicionar Referencia</Text>
                  <Text className="text-ink-muted text-xs mt-1">Toque para escolher da galeria</Text>
                </TouchableOpacity>
              )}

              {/* RESUMO */}
              <View className="bg-ink-card border border-ink-border rounded-2xl p-4 mb-2">
                <Text className="text-ink-gold text-[11px] font-black uppercase tracking-[3px] mb-3">Resumo do Pedido</Text>
                {[
                  { label: "Cliente", value: form.name },
                  { label: "Contato", value: form.phone },
                  { label: "Artista", value: selectedArtist?.name ?? "—" },
                  { label: "Estilo",  value: selectedStyle?.label ?? "—" },
                  { label: "Tamanho", value: selectedSize ? `${selectedSize.label} (${selectedSize.description})` : "—" },
                  { label: "Local",   value: selectedLocation?.label ?? "—" },
                  { label: "Data/Hora", value: form.preferredDate && form.preferredTime ? `${form.preferredDate} as ${form.preferredTime}` : "—" },
                ].map(({ label, value }) => (
                  <View key={label} className="flex-row justify-between py-1.5 border-b border-ink-border">
                    <Text className="text-ink-muted text-xs">{label}</Text>
                    <Text className="text-white text-xs font-semibold">{value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* BOTTOM BUTTON */}
        <View className="px-5 py-4 border-t border-ink-border bg-ink-bg">
          <TouchableOpacity
            className="bg-ink-gold rounded-xl py-4 items-center"
            onPress={handleNext}
            activeOpacity={0.85}
            style={{ shadowColor: "#D4AF37", shadowOpacity: 0.45, shadowRadius: 12, elevation: 8 }}
          >
            <Text className="text-black font-black text-sm tracking-[3px] uppercase">
              {step < 3 ? "Proximo >" : "Enviar Pedido de Orcamento"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* MODAL CONFIRMACAO */}
      <Modal visible={showModal} transparent animationType="fade" statusBarTranslucent>
        <View className="flex-1 items-center justify-center px-6 bg-black/[0.88]">
          <View className="bg-ink-card border border-ink-border-warm rounded-3xl p-8 w-full items-center">
            <View
              className="w-20 h-20 rounded-full bg-ink-gold items-center justify-center mb-5"
              style={{ shadowColor: "#D4AF37", shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 }}
            >
              <Text className="text-black text-[36px] font-black">✓</Text>
            </View>
            <Text className="text-ink-gold text-[11px] font-black uppercase tracking-[3px] mb-2">Pedido Enviado!</Text>
            <Text className="text-ink-gold-dim text-[10px] tracking-[4px] mb-2">{"\u2726 \u2767 \u2726"}</Text>
            <Text className="text-white text-[22px] font-black text-center uppercase leading-7 mb-4">{"ORCAMENTO\nEM ANALISE"}</Text>
            <View className="w-full bg-ink-bg rounded-2xl p-4 mb-5">
              {[
                { emoji: "✅", text: "Pedido recebido com sucesso", done: true },
                { emoji: "🎨", text: `${selectedArtist?.name ?? "Artista"} analisando referencia`, done: false },
                { emoji: "💬", text: "Orcamento enviado via WhatsApp/e-mail em ate 24h", done: false },
                { emoji: "🗓️", text: "Apos aprovacao, sessao confirmada!", done: false },
              ].map((item, i) => (
                <View key={i} className="flex-row items-start mb-3">
                  <Text className="text-[15px] mr-3 mt-0.5">{item.emoji}</Text>
                  <Text
                    className="text-[13px] flex-1 leading-[18px]"
                    style={{ color: item.done ? "#D4AF37" : "#a1a1aa", fontWeight: item.done ? "700" : "400" }}
                  >
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
            <Text className="text-ink-muted text-xs text-center leading-[18px] mb-6">
              {"Fique atento ao "}
              <Text className="text-white font-bold">{form.phone}</Text>
              {"\nnosso time entrara em contato em breve!"}
            </Text>
            <TouchableOpacity
              className="bg-ink-gold w-full rounded-xl py-4 items-center"
              onPress={handleDone}
              activeOpacity={0.85}
            >
              <Text className="text-black font-black text-[13px] tracking-[3px] uppercase">Voltar ao Inicio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
