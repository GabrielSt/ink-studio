import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ARTISTS, TATTOO_STYLES, Artist } from "../../data/mock";
import { useApp } from "../../context/AppContext";

const GOLD = "#D4AF37";
const GOLD_DIM = "#b8972e";

function FloralDivider() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 4 }}>
      <Text style={{ color: GOLD_DIM, fontSize: 11, letterSpacing: 4 }}>{"\u2726 \u2767 \u2726"}</Text>
    </View>
  );
}

function StylePill({ styleId }: { styleId: string }) {
  const style = TATTOO_STYLES.find((s) => s.id === styleId);
  if (!style) return null;
  return (
    <View style={{
      flexDirection: "row", alignItems: "center",
      backgroundColor: "#1a1500", borderWidth: 1, borderColor: "#2a2310",
      borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6, marginBottom: 6,
    }}>
      <Text style={{ fontSize: 11, marginRight: 4 }}>{style.emoji}</Text>
      <Text style={{ color: GOLD_DIM, fontSize: 10, fontWeight: "700" }}>{style.label}</Text>
    </View>
  );
}

function ArtistDetailModal({ artist, onClose, onBook }: {
  artist: Artist;
  onClose: () => void;
  onBook: () => void;
}) {
  // Fake gallery seeds per artist
  const seeds = {
    a1: ["tattoo10", "tattoo11", "tattoo12"],
    a2: ["tattoo20", "tattoo21", "tattoo22"],
    a3: ["tattoo30", "tattoo31", "tattoo32"],
    a4: ["tattoo40", "tattoo41", "tattoo42"],
  }[artist.id] ?? ["tattoo1", "tattoo2", "tattoo3"];

  return (
    <Modal visible animationType="slide" transparent statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.8)" }}>
        <View style={{
          backgroundColor: "#0f0f0f", borderTopLeftRadius: 28, borderTopRightRadius: 28,
          borderTopWidth: 2, borderColor: GOLD_DIM,
          maxHeight: "92%", paddingBottom: 40,
        }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Handle */}
            <View style={{ width: 48, height: 4, backgroundColor: GOLD_DIM, borderRadius: 2, alignSelf: "center", marginTop: 14, marginBottom: 20 }} />

            {/* Hero */}
            <View style={{ alignItems: "center", paddingHorizontal: 24, marginBottom: 20 }}>
              <View style={{ position: "relative", marginBottom: 16 }}>
                <Image
                  source={{ uri: artist.avatar }}
                  style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: GOLD }}
                  resizeMode="cover"
                />
                <View style={{
                  position: "absolute", bottom: 0, right: 0,
                  backgroundColor: GOLD, borderRadius: 14, paddingHorizontal: 8, paddingVertical: 3,
                  borderWidth: 2, borderColor: "#0f0f0f",
                }}>
                  <Text style={{ color: "#000", fontSize: 9, fontWeight: "900" }}>PRO</Text>
                </View>
              </View>
              <Text style={{ color: "#fff", fontSize: 22, fontWeight: "900", letterSpacing: 1 }}>{artist.name}</Text>
              <Text style={{ color: GOLD_DIM, fontSize: 13, marginTop: 4 }}>{artist.specialty}</Text>
              <FloralDivider />
              <View style={{ flexDirection: "row", gap: 24, marginTop: 8 }}>
                {[
                  { label: "Experiência", value: artist.experience },
                  { label: "Instagram", value: artist.instagram },
                ].map((item) => (
                  <View key={item.label} style={{ alignItems: "center" }}>
                    <Text style={{ color: "#fff", fontSize: 13, fontWeight: "800" }}>{item.value}</Text>
                    <Text style={{ color: "#52525b", fontSize: 10, marginTop: 2 }}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Styles */}
            <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
              <Text style={{ color: "#a1a1aa", fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Especialidades</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {artist.styles.map((sid) => <StylePill key={sid} styleId={sid} />)}
              </View>
            </View>

            {/* Mini gallery */}
            <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
              <Text style={{ color: "#a1a1aa", fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Trabalhos Recentes</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                {seeds.map((seed) => (
                  <View key={seed} style={{ width: 140, height: 180, borderRadius: 14, overflow: "hidden", borderWidth: 1, borderColor: "#2a2310" }}>
                    <Image
                      source={{ uri: `https://picsum.photos/seed/${seed}/300/400` }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                    <View style={{ position: "absolute", top: 0, right: 0, width: 20, height: 20, backgroundColor: GOLD_DIM, borderBottomLeftRadius: 8 }} />
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Stats row */}
            <View style={{ flexDirection: "row", marginHorizontal: 24, marginBottom: 24, backgroundColor: "#111111", borderRadius: 16, borderWidth: 1, borderColor: "#2a2310", overflow: "hidden" }}>
              {[
                { value: "★ 4.9", label: "Avaliação" },
                { value: "200+", label: "Tattoos" },
                { value: "~3h", label: "Sessão média" },
              ].map((s, i, arr) => (
                <View key={s.label} style={{ flex: 1, alignItems: "center", paddingVertical: 14, borderRightWidth: i < arr.length - 1 ? 1 : 0, borderRightColor: "#2a2310" }}>
                  <Text style={{ color: GOLD, fontSize: 14, fontWeight: "900" }}>{s.value}</Text>
                  <Text style={{ color: "#a1a1aa", fontSize: 10, marginTop: 2 }}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* Actions */}
            <View style={{ paddingHorizontal: 24, gap: 10 }}>
              <TouchableOpacity
                style={{ backgroundColor: GOLD, borderRadius: 14, paddingVertical: 16, alignItems: "center", shadowColor: GOLD, shadowOpacity: 0.45, shadowRadius: 12, elevation: 8 }}
                onPress={onBook}
                activeOpacity={0.85}
              >
                <Text style={{ color: "#000", fontWeight: "900", fontSize: 14, letterSpacing: 3, textTransform: "uppercase" }}>
                  {"\u2726 Agendar com " + artist.name.split(" ")[0]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ borderWidth: 1, borderColor: "#1f1f1f", borderRadius: 14, paddingVertical: 14, alignItems: "center" }}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={{ color: "#a1a1aa", fontSize: 13, fontWeight: "700" }}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function ArtistsScreen() {
  const router = useRouter();
  const { setPendingArtistId } = useApp();
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const bookArtist = (artist: Artist) => {
    setPendingArtistId(artist.id);
    setSelectedArtist(null);
    router.push("/booking");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0a0a" }} edges={["top"]}>
      {/* HEADER */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 }}>
        <Text style={{ color: GOLD_DIM, fontSize: 10, textTransform: "uppercase", letterSpacing: 3 }}>Ink Studio</Text>
        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "900", textTransform: "uppercase", letterSpacing: 3 }}>Nossos Artistas</Text>
        <FloralDivider />
        <Text style={{ color: "#a1a1aa", fontSize: 12, marginTop: 4, lineHeight: 18 }}>
          Conheça nossos tatuadores e escolha o ideal para o seu estilo.
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {ARTISTS.map((artist) => (
          <TouchableOpacity
            key={artist.id}
            onPress={() => setSelectedArtist(artist)}
            activeOpacity={0.88}
            style={{
              backgroundColor: "#111111",
              borderWidth: 1, borderColor: "#2a2310",
              borderRadius: 20, marginBottom: 16, overflow: "hidden",
            }}
          >
            {/* Top accent */}
            <View style={{ height: 3, backgroundColor: GOLD_DIM }} />

            <View style={{ padding: 20 }}>
              {/* Profile row */}
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                <View style={{ position: "relative" }}>
                  <Image
                    source={{ uri: artist.avatar }}
                    style={{ width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: GOLD }}
                    resizeMode="cover"
                  />
                  <View style={{
                    position: "absolute", bottom: -2, right: -2,
                    width: 18, height: 18, backgroundColor: "#22c55e",
                    borderRadius: 9, borderWidth: 2, borderColor: "#111111",
                  }} />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={{ color: "#fff", fontWeight: "900", fontSize: 17 }}>{artist.name}</Text>
                  <Text style={{ color: GOLD_DIM, fontSize: 12, fontWeight: "600", marginTop: 2 }}>{artist.specialty}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                    <Text style={{ color: GOLD, fontSize: 11 }}>★ 4.9</Text>
                    <Text style={{ color: "#52525b", fontSize: 10, marginLeft: 8 }}>{artist.experience}</Text>
                  </View>
                </View>
              </View>

              {/* Style pills */}
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 16 }}>
                {artist.styles.map((sid) => <StylePill key={sid} styleId={sid} />)}
              </View>

              {/* Instagram */}
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                <View style={{ backgroundColor: "#1a1a1a", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                  <Text style={{ color: "#a1a1aa", fontSize: 11 }}>{artist.instagram}</Text>
                </View>
              </View>

              {/* Action buttons */}
              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity
                  onPress={() => setSelectedArtist(artist)}
                  style={{ flex: 1, borderWidth: 1, borderColor: GOLD_DIM, borderRadius: 12, paddingVertical: 11, alignItems: "center" }}
                  activeOpacity={0.8}
                >
                  <Text style={{ color: GOLD_DIM, fontSize: 12, fontWeight: "700" }}>Ver Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => bookArtist(artist)}
                  style={{ flex: 1, backgroundColor: GOLD, borderRadius: 12, paddingVertical: 11, alignItems: "center", shadowColor: GOLD, shadowOpacity: 0.35, shadowRadius: 8, elevation: 5 }}
                  activeOpacity={0.85}
                >
                  <Text style={{ color: "#000", fontSize: 12, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1 }}>Book</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Bottom note */}
        <View style={{ alignItems: "center", paddingTop: 8 }}>
          <Text style={{ color: "#52525b", fontSize: 11, textAlign: "center", lineHeight: 18 }}>
            {"Todos os nossos artistas são certificados\ne seguem normas rigorosas de biossegurança."}
          </Text>
          <FloralDivider />
        </View>
      </ScrollView>

      {selectedArtist && (
        <ArtistDetailModal
          artist={selectedArtist}
          onClose={() => setSelectedArtist(null)}
          onBook={() => bookArtist(selectedArtist)}
        />
      )}
    </SafeAreaView>
  );
}
