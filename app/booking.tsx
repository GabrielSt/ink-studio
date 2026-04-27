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
    <View style={{ backgroundColor: "#111111", borderWidth: 1, borderColor: "#2a2a2a", borderRadius: 16, padding: 12, marginBottom: 20 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <TouchableOpacity onPress={prevMonth} style={{ padding: 8 }}>
          <Text style={{ color: "#D4AF37", fontSize: 20, fontWeight: "700" }}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={{ flex: 1, color: "#fff", fontWeight: "900", textAlign: "center", letterSpacing: 2, textTransform: "uppercase", fontSize: 13 }}>
          {MONTHS_PT[viewMonth]} {viewYear}
        </Text>
        <TouchableOpacity onPress={nextMonth} style={{ padding: 8 }}>
          <Text style={{ color: "#D4AF37", fontSize: 20, fontWeight: "700" }}>{">"}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", marginBottom: 6 }}>
        {["D","S","T","Q","Q","S","S"].map((d, i) => (
          <Text key={i} style={{ flex: 1, color: "#D4AF37", fontSize: 11, fontWeight: "800", textAlign: "center" }}>{d}</Text>
        ))}
      </View>
      {weeks.map((week, wi) => (
        <View key={wi} style={{ flexDirection: "row", marginBottom: 4 }}>
          {week.map((day, di) => {
            const past = day !== null && isPast(day);
            const sel = day !== null && isSelected(day);
            return (
              <TouchableOpacity
                key={di}
                style={{ flex: 1, alignItems: "center", paddingVertical: 6 }}
                onPress={() => day && !past && selectDay(day)}
                activeOpacity={day && !past ? 0.7 : 1}
              >
                {day ? (
                  <View style={{ width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: sel ? "#D4AF37" : "transparent" }}>
                    <Text style={{ color: sel ? "#0a0a0a" : past ? "#3a3a3a" : "#fff", fontSize: 13, fontWeight: sel ? "900" : "500" }}>{day}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      {value ? (
        <View style={{ marginTop: 8, backgroundColor: "#1a1a1a", borderRadius: 10, padding: 10, borderLeftWidth: 3, borderLeftColor: "#D4AF37" }}>
          <Text style={{ color: "#D4AF37", fontSize: 12, fontWeight: "800" }}>Data selecionada: {value}</Text>
        </View>
      ) : null}
    </View>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

function Label({ children }: { children: string }) {
  return (
    <Text style={{ color: "#a1a1aa", fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
      {/* TOP BAR */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
        <TouchableOpacity
          onPress={() => {
            if (step > 1) {
              setStep(step - 1);
            } else {
              setPendingArtistId(null);
              router.back();
            }
          }}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#111111", borderWidth: 1, borderColor: "#1f1f1f", alignItems: "center", justifyContent: "center", marginRight: 12 }}
        >
          <Text style={{ color: "#D4AF37", fontSize: 22 }}>{"<"}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#a1a1aa", fontSize: 10, textTransform: "uppercase", letterSpacing: 3 }}>Passo {step} de 3 · {STEP_LABELS[step - 1]}</Text>
          <Text style={{ color: "#fff", fontSize: 17, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2 }}>Agendamento</Text>
        </View>
        <View style={{ borderWidth: 1, borderColor: "#D4AF37", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 }}>
          <Text style={{ color: "#D4AF37", fontSize: 11, fontWeight: "700" }}>{step}/3</Text>
        </View>
      </View>

      {/* PROGRESS */}
      <View style={{ flexDirection: "row", paddingHorizontal: 20, gap: 8, marginBottom: 16 }}>
        {[1, 2, 3].map((s) => (
          <View key={s} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: s <= step ? "#D4AF37" : "#1f1f1f" }} />
        ))}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 32 }}>

          {/* STEP 1 */}
          {step === 1 && (
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>Seus Dados de Contato</Text>
              <Text style={{ color: "#a1a1aa", fontSize: 12, marginBottom: 24, lineHeight: 18 }}>Usaremos esses dados para enviar seu orcamento personalizado.</Text>

              <Label>Nome Completo *</Label>
              <TextInput style={{ backgroundColor: "#111111", borderWidth: 1, borderColor: "#1f1f1f", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: "#fff", fontSize: 14, marginBottom: 20 }} placeholder="Ex: Joao Silva" placeholderTextColor="#52525b" value={form.name} onChangeText={(v) => update("name", v)} />

              <Label>WhatsApp / Telefone *</Label>
              <TextInput style={{ backgroundColor: "#111111", borderWidth: 1, borderColor: "#1f1f1f", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: "#fff", fontSize: 14, marginBottom: 20 }} placeholder="(11) 9 9999-9999" placeholderTextColor="#52525b" keyboardType="phone-pad" value={form.phone} onChangeText={(v) => update("phone", v)} />

              <Label>E-mail *</Label>
              <TextInput style={{ backgroundColor: "#111111", borderWidth: 1, borderColor: "#1f1f1f", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: "#fff", fontSize: 14, marginBottom: 20 }} placeholder="seuemail@exemplo.com" placeholderTextColor="#52525b" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={(v) => update("email", v)} />

              <View style={{ backgroundColor: "#111111", borderWidth: 1, borderColor: "#D4AF37", borderRadius: 16, padding: 16, marginTop: 4 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#D4AF37", alignItems: "center", justifyContent: "center", marginRight: 8 }}>
                    <Text style={{ color: "#000", fontSize: 12, fontWeight: "900" }}>!</Text>
                  </View>
                  <Text style={{ color: "#D4AF37", fontSize: 12, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2 }}>Como funciona o orcamento</Text>
                </View>
                <Text style={{ color: "#a1a1aa", fontSize: 12, lineHeight: 18 }}>
                  {"Apos enviar o pedido, nosso artista analisa e entra em contato via WhatsApp ou e-mail em "}
                  <Text style={{ color: "#fff", fontWeight: "700" }}>ate 24 horas</Text>
                  {" com o valor e disponibilidade."}
                </Text>
              </View>
            </View>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>Detalhes da Tatuagem</Text>
              <Text style={{ color: "#a1a1aa", fontSize: 12, marginBottom: 24, lineHeight: 18 }}>Quanto mais detalhes, mais preciso sera seu orcamento.</Text>

              {/* ARTISTA */}
              <Label>Escolha o Artista *</Label>
              {form.styleId && form.styleId !== "generic" && availableArtists.length < ARTISTS.length && (
                <View style={{ backgroundColor: "#1a150a", borderWidth: 1, borderColor: "#D4AF37", borderRadius: 10, padding: 10, marginBottom: 12, flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: "#D4AF37", fontSize: 11 }}>{"✦ Mostrando artistas que fazem " + (selectedStyle?.label ?? "")}</Text>
                </View>
              )}
              <View style={{ gap: 8, marginBottom: 20 }}>
                {availableArtists.map((artist) => (
                  <TouchableOpacity
                    key={artist.id}
                    onPress={() => update("artistId", artist.id)}
                    activeOpacity={0.8}
                    style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#111111", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: form.artistId === artist.id ? "#D4AF37" : "#1f1f1f" }}
                  >
                    <Image source={{ uri: artist.avatar }} style={{ width: 48, height: 48, borderRadius: 24 }} resizeMode="cover" />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>{artist.name}</Text>
                      <Text style={{ color: "#D4AF37", fontSize: 11, marginTop: 2 }}>{artist.specialty}</Text>
                      <Text style={{ color: "#a1a1aa", fontSize: 10, marginTop: 2 }}>{artist.experience}</Text>
                    </View>
                    <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: form.artistId === artist.id ? "#D4AF37" : "#52525b", backgroundColor: form.artistId === artist.id ? "#D4AF37" : "transparent", alignItems: "center", justifyContent: "center" }}>
                      {form.artistId === artist.id && <Text style={{ color: "#000", fontSize: 10, fontWeight: "900" }}>v</Text>}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* ESTILO */}
              <Label>Estilo *</Label>
              {form.artistId && availableStyles.length < TATTOO_STYLES.length && (
                <View style={{ backgroundColor: "#1a150a", borderWidth: 1, borderColor: "#D4AF37", borderRadius: 10, padding: 10, marginBottom: 12, flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: "#D4AF37", fontSize: 11 }}>{"✦ Estilos de " + (selectedArtist?.name ?? "")}</Text>
                </View>
              )}
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                {availableStyles.map((style) => (
                  <TouchableOpacity
                    key={style.id}
                    onPress={() => update("styleId", style.id)}
                    activeOpacity={0.8}
                    style={{ flexDirection: "row", alignItems: "center", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: form.styleId === style.id ? "#D4AF37" : "#1f1f1f", backgroundColor: form.styleId === style.id ? "#D4AF37" : "#111111" }}
                  >
                    <Text style={{ fontSize: 14, marginRight: 6 }}>{style.emoji}</Text>
                    <Text style={{ fontSize: 11, fontWeight: "700", color: form.styleId === style.id ? "#000" : "#fff" }}>{style.label}</Text>
                  </TouchableOpacity>
                ))}
                {/* Botao estilo generico */}
                <TouchableOpacity
                  onPress={() => update("styleId", "generic")}
                  activeOpacity={0.8}
                  style={{ flexDirection: "row", alignItems: "center", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderStyle: "dashed", borderColor: form.styleId === "generic" ? "#D4AF37" : "#52525b", backgroundColor: form.styleId === "generic" ? "#D4AF37" : "#0d0d0d" }}
                >
                  <Text style={{ fontSize: 14, marginRight: 6 }}>{"✨"}</Text>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: form.styleId === "generic" ? "#000" : "#a1a1aa" }}>Nao sei / Simples</Text>
                </TouchableOpacity>
              </View>
              {form.styleId === "generic" && (
                <View style={{ marginBottom: 16, backgroundColor: "#1a150a", borderRadius: 10, padding: 10, borderLeftWidth: 3, borderLeftColor: "#D4AF37" }}>
                  <Text style={{ color: "#D4AF37", fontSize: 11 }}>{"✦ Qualquer artista pode atender esse pedido"}</Text>
                </View>
              )}
              <View style={{ marginBottom: 20 }} />

              {/* TAMANHO */}
              <Label>Tamanho Estimado *</Label>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
                {TATTOO_SIZES.map((size) => (
                  <TouchableOpacity
                    key={size.id}
                    onPress={() => update("sizeId", size.id)}
                    activeOpacity={0.8}
                    style={{ flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: form.sizeId === size.id ? "#D4AF37" : "#1f1f1f", backgroundColor: form.sizeId === size.id ? "#D4AF37" : "#111111" }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: "900", color: form.sizeId === size.id ? "#000" : "#fff" }}>{size.label}</Text>
                    <Text style={{ fontSize: 9, marginTop: 2, color: form.sizeId === size.id ? "#000" : "#a1a1aa" }}>{size.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {selectedSize && (
                <View style={{ marginBottom: 20, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "#111111", borderWidth: 1, borderColor: "#D4AF37", borderRadius: 12, flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: "#D4AF37", fontSize: 12, fontWeight: "700" }}>{"💰 " + selectedSize.priceRange}</Text>
                </View>
              )}
            </View>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>Local, Data e Referencia</Text>
              <Text style={{ color: "#a1a1aa", fontSize: 12, marginBottom: 24, lineHeight: 18 }}>Finalize com onde e quando voce quer tatuar.</Text>

              <Label>Local no Corpo *</Label>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {BODY_LOCATIONS.map((loc) => (
                  <TouchableOpacity
                    key={loc.id}
                    onPress={() => update("bodyLocation", loc.id)}
                    activeOpacity={0.8}
                    style={{ borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: form.bodyLocation === loc.id ? "#D4AF37" : "#1f1f1f", backgroundColor: form.bodyLocation === loc.id ? "#D4AF37" : "#111111" }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "700", color: form.bodyLocation === loc.id ? "#000" : "#fff" }}>{loc.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Label>Data Preferida *</Label>
              <DatePicker value={form.preferredDate} onChange={(d) => update("preferredDate", d)} />

              <Label>Horario Preferido *</Label>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {TIMES.map((time) => (
                  <TouchableOpacity
                    key={time}
                    onPress={() => update("preferredTime", time)}
                    activeOpacity={0.8}
                    style={{ borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: form.preferredTime === time ? "#D4AF37" : "#1f1f1f", backgroundColor: form.preferredTime === time ? "#D4AF37" : "#111111" }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "700", color: form.preferredTime === time ? "#000" : "#fff" }}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Label>Descricao / Ideia da Tatuagem</Label>
              <TextInput
                style={{ backgroundColor: "#111111", borderWidth: 1, borderColor: "#1f1f1f", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: "#fff", fontSize: 14, marginBottom: 20, minHeight: 100, textAlignVertical: "top" }}
                placeholder="Descreva sua ideia, cores, elementos que deseja..."
                placeholderTextColor="#52525b"
                multiline
                numberOfLines={4}
                value={form.description}
                onChangeText={(v) => update("description", v)}
              />

              <Label>Foto de Referencia (opcional)</Label>
              {form.referenceImage ? (
                <View style={{ position: "relative", marginBottom: 20 }}>
                  <Image source={{ uri: form.referenceImage }} style={{ width: "100%", height: 192, borderRadius: 12 }} resizeMode="cover" />
                  <TouchableOpacity style={{ position: "absolute", top: 8, right: 8, backgroundColor: "rgba(0,0,0,0.7)", borderRadius: 20, width: 32, height: 32, alignItems: "center", justifyContent: "center" }} onPress={() => update("referenceImage", null)}>
                    <Text style={{ color: "#fff", fontSize: 14 }}>X</Text>
                  </TouchableOpacity>
                  <View style={{ position: "absolute", bottom: 8, left: 8, backgroundColor: "#D4AF37", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text style={{ color: "#000", fontSize: 10, fontWeight: "900" }}>Referencia adicionada</Text>
                  </View>
                </View>
              ) : (
                <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={{ backgroundColor: "#111111", borderWidth: 1, borderStyle: "dashed", borderColor: "#1f1f1f", borderRadius: 12, paddingVertical: 32, alignItems: "center", marginBottom: 20 }}>
                  <Text style={{ fontSize: 36, marginBottom: 8 }}>🖼️</Text>
                  <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>Adicionar Referencia</Text>
                  <Text style={{ color: "#a1a1aa", fontSize: 12, marginTop: 4 }}>Toque para escolher da galeria</Text>
                </TouchableOpacity>
              )}

              {/* RESUMO */}
              <View style={{ backgroundColor: "#111111", borderWidth: 1, borderColor: "#1f1f1f", borderRadius: 16, padding: 16, marginBottom: 8 }}>
                <Text style={{ color: "#D4AF37", fontSize: 11, fontWeight: "900", textTransform: "uppercase", letterSpacing: 3, marginBottom: 12 }}>Resumo do Pedido</Text>
                {[
                  { label: "Cliente", value: form.name },
                  { label: "Contato", value: form.phone },
                  { label: "Artista", value: selectedArtist?.name ?? "—" },
                  { label: "Estilo", value: selectedStyle?.label ?? "—" },
                  { label: "Tamanho", value: selectedSize ? `${selectedSize.label} (${selectedSize.description})` : "—" },
                  { label: "Local", value: selectedLocation?.label ?? "—" },
                  { label: "Data/Hora", value: form.preferredDate && form.preferredTime ? `${form.preferredDate} as ${form.preferredTime}` : "—" },
                ].map(({ label, value }) => (
                  <View key={label} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#1f1f1f" }}>
                    <Text style={{ color: "#a1a1aa", fontSize: 12 }}>{label}</Text>
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* BOTTOM BUTTON */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: "#1f1f1f", backgroundColor: "#0a0a0a" }}>
          <TouchableOpacity
            style={{ backgroundColor: "#D4AF37", borderRadius: 12, paddingVertical: 16, alignItems: "center", shadowColor: "#D4AF37", shadowOpacity: 0.45, shadowRadius: 12, elevation: 8 }}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={{ color: "#000", fontWeight: "900", fontSize: 14, letterSpacing: 3, textTransform: "uppercase" }}>
              {step < 3 ? "Proximo >" : "Enviar Pedido de Orcamento"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* MODAL CONFIRMACAO */}
      <Modal visible={showModal} transparent animationType="fade" statusBarTranslucent>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, backgroundColor: "rgba(0,0,0,0.88)" }}>
          <View style={{ backgroundColor: "#111111", borderWidth: 1, borderColor: "#2a2310", borderRadius: 24, padding: 32, width: "100%", alignItems: "center" }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#D4AF37", alignItems: "center", justifyContent: "center", marginBottom: 20, shadowColor: "#D4AF37", shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 }}>
              <Text style={{ color: "#000", fontSize: 36, fontWeight: "900" }}>✓</Text>
            </View>
            <Text style={{ color: "#D4AF37", fontSize: 11, fontWeight: "900", textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>Pedido Enviado!</Text>
            <Text style={{ color: "#b8972e", fontSize: 10, letterSpacing: 4, marginBottom: 8 }}>{"\u2726 \u2767 \u2726"}</Text>
            <Text style={{ color: "#fff", fontSize: 22, fontWeight: "900", textAlign: "center", textTransform: "uppercase", lineHeight: 28, marginBottom: 16 }}>{"ORCAMENTO\nEM ANALISE"}</Text>
            <View style={{ width: "100%", backgroundColor: "#0a0a0a", borderRadius: 16, padding: 16, marginBottom: 20 }}>
              {[
                { emoji: "✅", text: "Pedido recebido com sucesso", done: true },
                { emoji: "🎨", text: `${selectedArtist?.name ?? "Artista"} analisando referencia`, done: false },
                { emoji: "💬", text: "Orcamento enviado via WhatsApp/e-mail em ate 24h", done: false },
                { emoji: "🗓️", text: "Apos aprovacao, sessao confirmada!", done: false },
              ].map((item, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 12 }}>
                  <Text style={{ fontSize: 15, marginRight: 12, marginTop: 2 }}>{item.emoji}</Text>
                  <Text style={{ fontSize: 13, flex: 1, lineHeight: 18, color: item.done ? "#D4AF37" : "#a1a1aa", fontWeight: item.done ? "700" : "400" }}>{item.text}</Text>
                </View>
              ))}
            </View>
            <Text style={{ color: "#a1a1aa", fontSize: 12, textAlign: "center", lineHeight: 18, marginBottom: 24 }}>
              {"Fique atento ao "}
              <Text style={{ color: "#fff", fontWeight: "700" }}>{form.phone}</Text>
              {"\nnosso time entrara em contato em breve!"}
            </Text>
            <TouchableOpacity style={{ backgroundColor: "#D4AF37", width: "100%", borderRadius: 12, paddingVertical: 16, alignItems: "center" }} onPress={handleDone} activeOpacity={0.85}>
              <Text style={{ color: "#000", fontWeight: "900", fontSize: 13, letterSpacing: 3, textTransform: "uppercase" }}>Voltar ao Inicio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
