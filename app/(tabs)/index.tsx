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

const GOLD = "#D4AF37";
const GOLD_DIM = "#b8972e";

function FloralDivider() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 4 }}>
      <Text style={{ color: GOLD_DIM, fontSize: 11, letterSpacing: 4 }}>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0a0a" }} edges={["top"]}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} bounces={false}>
        {/* HEADER */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
          <View>
            <Text style={{ color: GOLD_DIM, fontSize: 10, fontWeight: "800", letterSpacing: 4, textTransform: "uppercase" }}>Est. 2012</Text>
            <Text style={{ color: "#fff", fontSize: 22, fontWeight: "900", letterSpacing: 4, textTransform: "uppercase" }}>INK STUDIO</Text>
            <Text style={{ color: GOLD_DIM, fontSize: 10, letterSpacing: 4 }}>{"\u2726 \u2767 \u2726"}</Text>
          </View>
          <View style={{ borderColor: GOLD_DIM, borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ color: GOLD_DIM, fontSize: 10, fontWeight: "700", letterSpacing: 2 }}>SP / BR</Text>
          </View>
        </View>

        {/* HERO */}
        <View style={{ marginHorizontal: 16, marginTop: 12, borderRadius: 16, overflow: "hidden", height: 420 }}>
          <ImageBackground source={{ uri: "https://picsum.photos/seed/tattoohero/800/900" }} style={{ flex: 1 }} resizeMode="cover">
            <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.55)" }}>
              <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: GOLD_DIM }} />
              <View style={{ padding: 24 }}>
                <View style={{ backgroundColor: GOLD_DIM, alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, marginBottom: 4 }}>
                  <Text style={{ color: "#000", fontSize: 11, fontWeight: "900", letterSpacing: 3, textTransform: "uppercase" }}>Arte na Pele</Text>
                </View>
                <FloralDivider />
                <Text style={{ color: "#fff", fontSize: 36, fontWeight: "900", lineHeight: 40, textTransform: "uppercase", marginTop: 8 }}>{"A TINTA\nCONTA\nA SUA\nHISTÓRIA."}</Text>
                <Text style={{ color: "#a1a1aa", fontSize: 13, marginTop: 12, lineHeight: 20 }}>{"Cada traço, um símbolo. Cada peça, única.\nAgende sua sessão com os melhores artistas."}</Text>
                <TouchableOpacity
                  style={{ marginTop: 20, backgroundColor: GOLD_DIM, borderRadius: 12, paddingVertical: 16, alignItems: "center", shadowColor: GOLD_DIM, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 }}
                  onPress={() => goToBooking()}
                  activeOpacity={0.85}
                >
                  <Text style={{ color: "#000", fontWeight: "900", fontSize: 14, letterSpacing: 3, textTransform: "uppercase" }}>{"\u2726 Agendar Agora"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* STATS */}
        <View style={{ flexDirection: "row", marginHorizontal: 16, marginTop: 16, backgroundColor: "#111111", borderRadius: 16, borderWidth: 1, borderColor: "#1f1f1f", overflow: "hidden" }}>
          {[{ value: "12+", label: "Anos" }, { value: "4.000+", label: "Tattoos" }, { value: "4", label: "Artistas" }, { value: "\u2605 4.9", label: "Avaliação" }].map((stat, i, arr) => (
            <View key={stat.label} style={{ flex: 1, alignItems: "center", paddingVertical: 16, borderRightWidth: i < arr.length - 1 ? 1 : 0, borderRightColor: "#1f1f1f" }}>
              <Text style={{ color: GOLD_DIM, fontSize: 16, fontWeight: "900" }}>{stat.value}</Text>
              <Text style={{ color: "#a1a1aa", fontSize: 11, marginTop: 2 }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ESTILOS */}
        <View style={{ marginTop: 32, paddingHorizontal: 20, marginBottom: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "900", textTransform: "uppercase", letterSpacing: 3 }}>Estilos</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "#1f1f1f", marginLeft: 16 }} />
          </View>
          <FloralDivider />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}>
          {TATTOO_STYLES.map((style) => (
            <TouchableOpacity
              key={style.id}
              onPress={() => goToBooking()}
              style={{ marginRight: 12, backgroundColor: "#111111", borderWidth: 1, borderColor: "#2a2310", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, alignItems: "center", minWidth: 100 }}
              activeOpacity={0.75}
            >
              <Text style={{ fontSize: 28, marginBottom: 8 }}>{style.emoji}</Text>
              <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>{style.label}</Text>
              <Text style={{ color: "#a1a1aa", fontSize: 9, marginTop: 4, textAlign: "center" }}>{style.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* GALERIA */}
        <View style={{ marginTop: 32, paddingHorizontal: 20, marginBottom: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "900", textTransform: "uppercase", letterSpacing: 3 }}>Galeria</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "#1f1f1f", marginLeft: 16 }} />
          </View>
          <FloralDivider />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}>
          {GALLERY_IMAGES.map((img) => (
            <View key={img.id} style={{ marginRight: 12, borderRadius: 16, overflow: "hidden", width: width * 0.6, height: 220 }}>
              <Image source={{ uri: img.uri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
              <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "rgba(0,0,0,0.65)" }}>
                <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>{img.style}</Text>
              </View>
              <View style={{ position: "absolute", top: 0, right: 0, width: 24, height: 24, backgroundColor: GOLD_DIM, borderBottomLeftRadius: 10 }} />
            </View>
          ))}
        </ScrollView>

        {/* ARTISTAS — quick preview */}
        <View style={{ marginTop: 32, paddingHorizontal: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "900", textTransform: "uppercase", letterSpacing: 3 }}>Artistas</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "#1f1f1f", marginLeft: 16 }} />
          </View>
          <FloralDivider />
          <View style={{ marginTop: 12 }}>
            {ARTISTS.map((artist) => (
              <View key={artist.id} style={{ backgroundColor: "#111111", borderWidth: 1, borderColor: "#2a2310", borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: "row", alignItems: "center" }}>
                <View style={{ position: "relative" }}>
                  <Image source={{ uri: artist.avatar }} style={{ width: 64, height: 64, borderRadius: 32 }} resizeMode="cover" />
                  <View style={{ position: "absolute", bottom: -2, right: -2, width: 16, height: 16, backgroundColor: GOLD_DIM, borderRadius: 8, borderWidth: 2, borderColor: "#0a0a0a" }} />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={{ color: "#fff", fontWeight: "900", fontSize: 15 }}>{artist.name}</Text>
                  <Text style={{ color: GOLD_DIM, fontSize: 11, fontWeight: "600", marginTop: 2 }}>{artist.specialty}</Text>
                  <Text style={{ color: "#a1a1aa", fontSize: 11, marginTop: 4 }}>{artist.experience} · {artist.instagram}</Text>
                </View>
                <TouchableOpacity
                  style={{ backgroundColor: GOLD_DIM, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 }}
                  onPress={() => goToBooking(artist.id)}
                  activeOpacity={0.8}
                >
                  <Text style={{ color: "#000", fontSize: 11, fontWeight: "900" }}>BOOK</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* COMO FUNCIONA */}
        <View style={{ marginTop: 32, paddingHorizontal: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "900", textTransform: "uppercase", letterSpacing: 3 }}>Como Funciona</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "#1f1f1f", marginLeft: 16 }} />
          </View>
          <FloralDivider />
          <View style={{ marginTop: 12 }}>
            {[
              { step: "01", title: "Preencha o Formulário", desc: "Informe o estilo, tamanho, local e envie sua referência." },
              { step: "02", title: "Receba seu Orçamento", desc: "Em até 24h o artista entra em contato com o valor e disponibilidade." },
              { step: "03", title: "Confirme e Apareça", desc: "Aprovado o orçamento, pague 20% de caução e sua sessão está garantida!" },
            ].map((item, index) => (
              <View key={item.step} style={{ flexDirection: "row", marginBottom: 20 }}>
                <View style={{ alignItems: "center", marginRight: 16 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: GOLD_DIM, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "#000", fontSize: 12, fontWeight: "900" }}>{item.step}</Text>
                  </View>
                  {index < 2 && <View style={{ width: 2, backgroundColor: "#1f1f1f", marginTop: 4, minHeight: 28 }} />}
                </View>
                <View style={{ flex: 1, paddingTop: 6 }}>
                  <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>{item.title}</Text>
                  <Text style={{ color: "#a1a1aa", fontSize: 12, marginTop: 4, lineHeight: 16 }}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* BOTTOM CTA */}
        <View style={{ marginHorizontal: 16, marginTop: 16, marginBottom: 24, backgroundColor: "#111111", borderWidth: 1, borderColor: GOLD_DIM, borderRadius: 16, padding: 24, alignItems: "center", shadowColor: GOLD_DIM, shadowOpacity: 0.15, shadowRadius: 20, elevation: 6 }}>
          <Text style={{ color: GOLD_DIM, fontSize: 11, fontWeight: "700", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Pronto para a transformação?</Text>
          <FloralDivider />
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "900", textAlign: "center", textTransform: "uppercase", lineHeight: 28, marginTop: 4 }}>{"MARQUE SUA\nSESSÃO AGORA"}</Text>
          <Text style={{ color: "#a1a1aa", fontSize: 13, textAlign: "center", marginTop: 8, marginBottom: 20 }}>Slots limitados por semana. Garanta o seu!</Text>
          <TouchableOpacity
            style={{ backgroundColor: GOLD_DIM, width: "100%", borderRadius: 12, paddingVertical: 16, alignItems: "center", shadowColor: GOLD_DIM, shadowOpacity: 0.45, shadowRadius: 12, elevation: 8 }}
            onPress={() => goToBooking()}
            activeOpacity={0.85}
          >
            <Text style={{ color: "#000", fontWeight: "900", fontSize: 14, letterSpacing: 3, textTransform: "uppercase" }}>{"\u2726 Agendar Agora"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
