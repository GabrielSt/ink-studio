import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import { TATTOO_STYLES, Artist } from "../data/mock";
import { BottomSheet } from "./BottomSheet";
import { ImageViewer } from "./ImageViewer";

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

type Props = {
  artist: Artist;
  onClose: () => void;
  onBook: () => void;
  isFav: boolean;
  onToggleFav: () => void;
};

export function ArtistDetailModal({ artist, onClose, onBook, isFav, onToggleFav }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const seeds = ({
    a1: ["tattoo10", "tattoo11", "tattoo12"],
    a2: ["tattoo20", "tattoo21", "tattoo22"],
    a3: ["tattoo30", "tattoo31", "tattoo32"],
    a4: ["tattoo40", "tattoo41", "tattoo42"],
  } as Record<string, string[]>)[artist.id] ?? ["tattoo1", "tattoo2", "tattoo3"];

  const galleryUris = seeds.map((s) => `https://picsum.photos/seed/${s}/600/800`);

  return (
    <>
      <BottomSheet visible onClose={onClose} maxHeight="92%">
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

          {/* Nome + favoritar */}
          <View className="flex-row items-center gap-3 mb-1">
            <Text className="text-white text-[22px] font-black tracking-wide">{artist.name}</Text>
            <TouchableOpacity
              onPress={onToggleFav}
              activeOpacity={0.7}
              className="w-9 h-9 rounded-full items-center justify-center border"
              style={{ backgroundColor: isFav ? "#1a1500" : "#111", borderColor: isFav ? "#D4AF37" : "#333" }}
            >
              <Text style={{ fontSize: 18, color: isFav ? "#D4AF37" : "#52525b" }}>♥</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-ink-gold-dim text-[13px] mt-0.5">{artist.specialty}</Text>
          {isFav && (
            <View className="mt-1.5 bg-[#1a1500] rounded-lg px-3 py-1 border border-ink-gold-dim">
              <Text className="text-ink-gold text-[10px] font-bold">✦ Artista Favorito</Text>
            </View>
          )}
          <FloralDivider />
          <View className="flex-row gap-6 mt-2">
            {[
              { label: "Experiência", value: artist.experience },
              { label: "Instagram",   value: artist.instagram },
            ].map((item) => (
              <View key={item.label} className="items-center">
                <Text className="text-white text-[13px] font-extrabold">{item.value}</Text>
                <Text className="text-ink-dim text-[10px] mt-0.5">{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Especialidades */}
        <View className="px-6 mb-5">
          <Text className="text-ink-muted text-[11px] font-bold uppercase tracking-[2px] mb-2.5">Especialidades</Text>
          <View className="flex-row flex-wrap">
            {artist.styles.map((sid) => <StylePill key={sid} styleId={sid} />)}
          </View>
        </View>

        {/* Galeria — toque para ampliar */}
        <View className="px-6 mb-6">
          <Text className="text-ink-muted text-[11px] font-bold uppercase tracking-[2px] mb-2.5">
            Trabalhos Recentes · <Text className="text-ink-dim font-normal">toque para ampliar</Text>
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {galleryUris.map((uri, i) => (
              <TouchableOpacity
                key={seeds[i]}
                onPress={() => setLightboxIndex(i)}
                activeOpacity={0.85}
                className="w-[140px] h-[180px] rounded-[14px] overflow-hidden border border-ink-border-warm"
              >
                <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
                <View className="absolute top-0 right-0 w-5 h-5 bg-ink-gold-dim rounded-bl-lg" />
                {/* zoom hint */}
                <View className="absolute bottom-2 right-2 bg-black/60 rounded-full w-6 h-6 items-center justify-center">
                  <Text style={{ color: "#D4AF37", fontSize: 11 }}>⤢</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats */}
        <View className="flex-row mx-6 mb-6 bg-ink-card rounded-2xl border border-ink-border-warm overflow-hidden">
          {[
            { value: "★ 4.9", label: "Avaliação" },
            { value: "200+",  label: "Tattoos" },
            { value: "~3h",   label: "Sessão média" },
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

        {/* Acções */}
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
