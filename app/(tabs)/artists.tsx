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

function FloralDivider() {
  return (
    <View className="flex-row items-center justify-center my-1">
      <Text className="text-ink-gold-dim text-[11px] tracking-[4px]">{"\u2726 \u2767 \u2726"}</Text>
    </View>
  );
}

function StylePill({ styleId }: { styleId: string }) {
  const style = TATTOO_STYLES.find((s) => s.id === styleId);
  if (!style) return null;
  return (
    <View className="flex-row items-center bg-[#1a1500] border border-ink-border-warm rounded-[20px] px-2.5 py-1 mr-1.5 mb-1.5">
      <Text className="text-[11px] mr-1">{style.emoji}</Text>
      <Text className="text-ink-gold-dim text-[10px] font-bold">{style.label}</Text>
    </View>
  );
}

function ArtistDetailModal({ artist, onClose, onBook }: {
  artist: Artist;
  onClose: () => void;
  onBook: () => void;
}) {
  const seeds = {
    a1: ["tattoo10", "tattoo11", "tattoo12"],
    a2: ["tattoo20", "tattoo21", "tattoo22"],
    a3: ["tattoo30", "tattoo31", "tattoo32"],
    a4: ["tattoo40", "tattoo41", "tattoo42"],
  }[artist.id] ?? ["tattoo1", "tattoo2", "tattoo3"];

  return (
    <Modal visible animationType="slide" transparent statusBarTranslucent>
      <View className="flex-1 justify-end bg-black/80">
        <View className="bg-[#0f0f0f] rounded-t-[28px] border-t-2 border-ink-gold-dim max-h-[92%] pb-10">
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Handle */}
            <View className="w-12 h-1 bg-ink-gold-dim rounded-full self-center mt-3.5 mb-5" />

            {/* Hero */}
            <View className="items-center px-6 mb-5">
              <View className="relative mb-4">
                <Image
                  source={{ uri: artist.avatar }}
                  className="w-[100px] h-[100px] rounded-full border-[3px] border-ink-gold"
                  resizeMode="cover"
                />
                <View className="absolute bottom-0 right-0 bg-ink-gold rounded-[14px] px-2 py-[3px] border-2 border-[#0f0f0f]">
                  <Text className="text-black text-[9px] font-black">PRO</Text>
                </View>
              </View>
              <Text className="text-white text-[22px] font-black tracking-wide">{artist.name}</Text>
              <Text className="text-ink-gold-dim text-[13px] mt-1">{artist.specialty}</Text>
              <FloralDivider />
              <View className="flex-row gap-6 mt-2">
                {[
                  { label: "Experiência", value: artist.experience },
                  { label: "Instagram", value: artist.instagram },
                ].map((item) => (
                  <View key={item.label} className="items-center">
                    <Text className="text-white text-[13px] font-extrabold">{item.value}</Text>
                    <Text className="text-ink-dim text-[10px] mt-0.5">{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Styles */}
            <View className="px-6 mb-5">
              <Text className="text-ink-muted text-[11px] font-bold uppercase tracking-[2px] mb-2.5">Especialidades</Text>
              <View className="flex-row flex-wrap">
                {artist.styles.map((sid) => <StylePill key={sid} styleId={sid} />)}
              </View>
            </View>

            {/* Mini gallery */}
            <View className="px-6 mb-6">
              <Text className="text-ink-muted text-[11px] font-bold uppercase tracking-[2px] mb-2.5">Trabalhos Recentes</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                {seeds.map((seed) => (
                  <View key={seed} className="w-[140px] h-[180px] rounded-[14px] overflow-hidden border border-ink-border-warm">
                    <Image
                      source={{ uri: `https://picsum.photos/seed/${seed}/300/400` }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                    <View className="absolute top-0 right-0 w-5 h-5 bg-ink-gold-dim rounded-bl-lg" />
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Stats row */}
            <View className="flex-row mx-6 mb-6 bg-ink-card rounded-2xl border border-ink-border-warm overflow-hidden">
              {[
                { value: "★ 4.9", label: "Avaliação" },
                { value: "200+", label: "Tattoos" },
                { value: "~3h", label: "Sessão média" },
              ].map((s, i, arr) => (
                <View
                  key={s.label}
                  className="flex-1 items-center py-3.5"
                  style={{ borderRightWidth: i < arr.length - 1 ? 1 : 0, borderRightColor: "#2a2310" }}
                >
                  <Text className="text-ink-gold text-sm font-black">{s.value}</Text>
                  <Text className="text-ink-muted text-[10px] mt-0.5">{s.label}</Text>
                </View>
              ))}
            </View>

            {/* Actions */}
            <View className="px-6 gap-2.5">
              <TouchableOpacity
                className="bg-ink-gold rounded-[14px] py-4 items-center"
                onPress={onBook}
                activeOpacity={0.85}
                style={{ shadowColor: "#D4AF37", shadowOpacity: 0.45, shadowRadius: 12, elevation: 8 }}
              >
                <Text className="text-black font-black text-sm tracking-[3px] uppercase">
                  {"\u2726 Agendar com " + artist.name.split(" ")[0]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="border border-ink-border rounded-[14px] py-3.5 items-center"
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text className="text-ink-muted text-[13px] font-bold">Fechar</Text>
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
    <SafeAreaView className="flex-1 bg-ink-bg" edges={["top"]}>
      {/* HEADER */}
      <View className="px-5 pt-4 pb-1">
        <Text className="text-ink-gold-dim text-[10px] uppercase tracking-[3px]">Ink Studio</Text>
        <Text className="text-white text-[22px] font-black uppercase tracking-[3px]">Nossos Artistas</Text>
        <FloralDivider />
        <Text className="text-ink-muted text-xs mt-1 leading-[18px]">
          Conheça nossos tatuadores e escolha o ideal para o seu estilo.
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {ARTISTS.map((artist) => (
          <TouchableOpacity
            key={artist.id}
            onPress={() => setSelectedArtist(artist)}
            activeOpacity={0.88}
            className="bg-ink-card border border-ink-border-warm rounded-[20px] mb-4 overflow-hidden"
          >
            {/* Top accent */}
            <View className="h-[3px] bg-ink-gold-dim" />

            <View className="p-5">
              {/* Profile row */}
              <View className="flex-row items-center mb-4">
                <View className="relative">
                  <Image
                    source={{ uri: artist.avatar }}
                    className="w-[72px] h-[72px] rounded-full border-2 border-ink-gold"
                    resizeMode="cover"
                  />
                  <View className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] bg-ink-green rounded-full border-2 border-ink-card" />
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-white font-black text-[17px]">{artist.name}</Text>
                  <Text className="text-ink-gold-dim text-xs font-semibold mt-0.5">{artist.specialty}</Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-ink-gold text-[11px]">★ 4.9</Text>
                    <Text className="text-ink-dim text-[10px] ml-2">{artist.experience}</Text>
                  </View>
                </View>
              </View>

              {/* Style pills */}
              <View className="flex-row flex-wrap mb-4">
                {artist.styles.map((sid) => <StylePill key={sid} styleId={sid} />)}
              </View>

              {/* Instagram */}
              <View className="flex-row items-center mb-4">
                <View className="bg-ink-surface rounded-lg px-2.5 py-[5px]">
                  <Text className="text-ink-muted text-[11px]">{artist.instagram}</Text>
                </View>
              </View>

              {/* Action buttons */}
              <View className="flex-row gap-2.5">
                <TouchableOpacity
                  onPress={() => setSelectedArtist(artist)}
                  className="flex-1 border border-ink-gold-dim rounded-xl py-[11px] items-center"
                  activeOpacity={0.8}
                >
                  <Text className="text-ink-gold-dim text-xs font-bold">Ver Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => bookArtist(artist)}
                  className="flex-1 bg-ink-gold rounded-xl py-[11px] items-center"
                  activeOpacity={0.85}
                  style={{ shadowColor: "#D4AF37", shadowOpacity: 0.35, shadowRadius: 8, elevation: 5 }}
                >
                  <Text className="text-black text-xs font-black uppercase tracking-wide">Book</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Bottom note */}
        <View className="items-center pt-2">
          <Text className="text-ink-dim text-[11px] text-center leading-[18px]">
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
