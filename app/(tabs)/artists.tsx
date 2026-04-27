import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ARTISTS, TATTOO_STYLES, Artist } from "../../data/mock";
import { useApp } from "../../context/AppContext";
import { ArtistDetailModal } from "../../components/ArtistDetailModal";

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

export default function ArtistsScreen() {
  const router = useRouter();
  const { setPendingArtistId, isFavoriteArtist, toggleFavoriteArtist } = useApp();
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
        {ARTISTS.map((artist) => {
          const fav = isFavoriteArtist(artist.id);
          return (
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

                  {/* Botão favoritar no card */}
                  <TouchableOpacity
                    onPress={() => toggleFavoriteArtist(artist.id)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    className="w-9 h-9 rounded-full items-center justify-center border"
                    style={{
                      backgroundColor: fav ? "#1a1500" : "#111",
                      borderColor: fav ? "#D4AF37" : "#333",
                    }}
                  >
                    <Text style={{ fontSize: 18, color: fav ? "#D4AF37" : "#52525b" }}>♥</Text>
                  </TouchableOpacity>
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
          );
        })}

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
          isFav={isFavoriteArtist(selectedArtist.id)}
          onToggleFav={() => toggleFavoriteArtist(selectedArtist.id)}
        />
      )}
    </SafeAreaView>
  );
}
