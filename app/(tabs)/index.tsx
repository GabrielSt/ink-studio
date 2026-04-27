import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ARTISTS, TATTOO_STYLES, GALLERY_IMAGES } from "../../data/mock";
import { useApp } from "../../context/AppContext";

const { width } = Dimensions.get("window");

function FloralDivider() {
  return (
    <View className="flex-row items-center justify-center my-1">
      <Text className="text-ink-gold-dim text-[11px] tracking-[4px]">
        {"\u2726 \u2767 \u2726"}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { setPendingArtistId } = useApp();

  const goToBooking = (artistId?: string) => {
    setPendingArtistId(artistId ?? null);
    router.push("/booking");
  };

  return (
    <SafeAreaView className="flex-1 bg-ink-bg" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} bounces={false}>

        {/* HEADER */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
          <View>
            <Text className="text-ink-gold-dim text-[10px] font-extrabold tracking-[4px] uppercase">Est. 2012</Text>
            <Text className="text-white text-[22px] font-black tracking-[4px] uppercase">INK STUDIO</Text>
            <Text className="text-ink-gold-dim text-[10px] tracking-[4px]">{"\u2726 \u2767 \u2726"}</Text>
          </View>
          <View className="border border-ink-gold-dim rounded-[20px] px-[10px] py-[5px]">
            <Text className="text-ink-gold-dim text-[10px] font-bold tracking-[2px]">SP / BR</Text>
          </View>
        </View>

        {/* HERO */}
        <View className="mx-4 mt-3 rounded-2xl overflow-hidden" style={{ height: 420 }}>
          <ImageBackground
            source={{ uri: "https://picsum.photos/seed/tattoohero/800/900" }}
            className="flex-1"
            resizeMode="cover"
          >
            <View className="flex-1 justify-end bg-black/55">
              <View className="absolute top-0 left-0 right-0 h-[2px] bg-ink-gold-dim" />
              <View className="p-6">
                <View className="bg-ink-gold-dim self-start px-3 py-1 rounded-[4px] mb-1">
                  <Text className="text-black text-[11px] font-black tracking-[3px] uppercase">Arte na Pele</Text>
                </View>
                <FloralDivider />
                <Text className="text-white text-[36px] font-black leading-10 uppercase mt-2">
                  {"A TINTA\nCONTA\nA SUA\nHISTÓRIA."}
                </Text>
                <Text className="text-ink-muted text-[13px] mt-3 leading-5">
                  {"Cada traço, um símbolo. Cada peça, única.\nAgende sua sessão com os melhores artistas."}
                </Text>
                <TouchableOpacity
                  className="mt-5 bg-ink-gold-dim rounded-xl py-4 items-center"
                  onPress={() => goToBooking()}
                  activeOpacity={0.85}
                  style={{ shadowColor: "#b8972e", shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 }}
                >
                  <Text className="text-black font-black text-sm tracking-[3px] uppercase">{"\u2726 Agendar Agora"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* STATS */}
        <View className="flex-row mx-4 mt-4 bg-ink-card rounded-2xl border border-ink-border overflow-hidden">
          {[
            { value: "12+", label: "Anos" },
            { value: "4.000+", label: "Tattoos" },
            { value: "4", label: "Artistas" },
            { value: "\u2605 4.9", label: "Avaliação" },
          ].map((stat, i, arr) => (
            <View
              key={stat.label}
              className="flex-1 items-center py-4"
              style={{ borderRightWidth: i < arr.length - 1 ? 1 : 0, borderRightColor: "#1f1f1f" }}
            >
              <Text className="text-ink-gold-dim text-base font-black">{stat.value}</Text>
              <Text className="text-ink-muted text-[11px] mt-0.5">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ESTILOS */}
        <View className="mt-8 px-5 mb-2">
          <View className="flex-row items-center mb-0.5">
            <Text className="text-white text-lg font-black uppercase tracking-[3px]">Estilos</Text>
            <View className="flex-1 h-px bg-ink-border ml-4" />
          </View>
          <FloralDivider />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}>
          {TATTOO_STYLES.map((style) => (
            <TouchableOpacity
              key={style.id}
              onPress={() => goToBooking()}
              className="mr-3 bg-ink-card border border-ink-border-warm rounded-2xl px-5 py-4 items-center min-w-[100px]"
              activeOpacity={0.75}
            >
              <Text className="text-[28px] mb-2">{style.emoji}</Text>
              <Text className="text-white text-[11px] font-bold">{style.label}</Text>
              <Text className="text-ink-muted text-[9px] mt-1 text-center">{style.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* GALERIA */}
        <View className="mt-8 px-5 mb-2">
          <View className="flex-row items-center mb-0.5">
            <Text className="text-white text-lg font-black uppercase tracking-[3px]">Galeria</Text>
            <View className="flex-1 h-px bg-ink-border ml-4" />
          </View>
          <FloralDivider />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}>
          {GALLERY_IMAGES.map((img) => (
            <View key={img.id} className="mr-3 rounded-2xl overflow-hidden" style={{ width: width * 0.6, height: 220 }}>
              <Image source={{ uri: img.uri }} className="w-full h-full" resizeMode="cover" />
              <View className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-black/65">
                <Text className="text-white text-[11px] font-bold">{img.style}</Text>
              </View>
              <View className="absolute top-0 right-0 w-6 h-6 bg-ink-gold-dim rounded-bl-[10px]" />
            </View>
          ))}
        </ScrollView>

        {/* ARTISTAS */}
        <View className="mt-8 px-5">
          <View className="flex-row items-center mb-0.5">
            <Text className="text-white text-lg font-black uppercase tracking-[3px]">Artistas</Text>
            <View className="flex-1 h-px bg-ink-border ml-4" />
          </View>
          <FloralDivider />
          <View className="mt-3">
            {ARTISTS.map((artist) => (
              <View key={artist.id} className="bg-ink-card border border-ink-border-warm rounded-2xl p-4 mb-3 flex-row items-center">
                <View className="relative">
                  <Image source={{ uri: artist.avatar }} className="w-16 h-16 rounded-full" resizeMode="cover" />
                  <View className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-ink-gold-dim rounded-full border-2 border-ink-bg" />
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-white font-black text-[15px]">{artist.name}</Text>
                  <Text className="text-ink-gold-dim text-[11px] font-semibold mt-0.5">{artist.specialty}</Text>
                  <Text className="text-ink-muted text-[11px] mt-1">{artist.experience} · {artist.instagram}</Text>
                </View>
                <TouchableOpacity
                  className="bg-ink-gold-dim rounded-xl px-3.5 py-2.5"
                  onPress={() => goToBooking(artist.id)}
                  activeOpacity={0.8}
                >
                  <Text className="text-black text-[11px] font-black">BOOK</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* COMO FUNCIONA */}
        <View className="mt-8 px-5">
          <View className="flex-row items-center mb-0.5">
            <Text className="text-white text-lg font-black uppercase tracking-[3px]">Como Funciona</Text>
            <View className="flex-1 h-px bg-ink-border ml-4" />
          </View>
          <FloralDivider />
          <View className="mt-3">
            {[
              { step: "01", title: "Preencha o Formulário", desc: "Informe o estilo, tamanho, local e envie sua referência." },
              { step: "02", title: "Receba seu Orçamento", desc: "Em até 24h o artista entra em contato com o valor e disponibilidade." },
              { step: "03", title: "Confirme e Apareça", desc: "Aprovado o orçamento, pague 20% de caução e sua sessão está garantida!" },
            ].map((item, index) => (
              <View key={item.step} className="flex-row mb-5">
                <View className="items-center mr-4">
                  <View className="w-10 h-10 rounded-full bg-ink-gold-dim items-center justify-center">
                    <Text className="text-black text-xs font-black">{item.step}</Text>
                  </View>
                  {index < 2 && <View className="w-0.5 bg-ink-border mt-1 flex-1" style={{ minHeight: 28 }} />}
                </View>
                <View className="flex-1 pt-1.5">
                  <Text className="text-white font-bold text-[13px]">{item.title}</Text>
                  <Text className="text-ink-muted text-xs mt-1 leading-4">{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* BOTTOM CTA */}
        <View
          className="mx-4 mt-4 mb-6 bg-ink-card border border-ink-gold-dim rounded-2xl p-6 items-center"
          style={{ shadowColor: "#b8972e", shadowOpacity: 0.15, shadowRadius: 20, elevation: 6 }}
        >
          <Text className="text-ink-gold-dim text-[11px] font-bold tracking-[3px] uppercase mb-1">Pronto para a transformação?</Text>
          <FloralDivider />
          <Text className="text-white text-[22px] font-black text-center uppercase leading-7 mt-1">{"MARQUE SUA\nSESSÃO AGORA"}</Text>
          <Text className="text-ink-muted text-[13px] text-center mt-2 mb-5">Slots limitados por semana. Garanta o seu!</Text>
          <TouchableOpacity
            className="bg-ink-gold-dim w-full rounded-xl py-4 items-center"
            onPress={() => goToBooking()}
            activeOpacity={0.85}
            style={{ shadowColor: "#b8972e", shadowOpacity: 0.45, shadowRadius: 12, elevation: 8 }}
          >
            <Text className="text-black font-black text-sm tracking-[3px] uppercase">{"\u2726 Agendar Agora"}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
