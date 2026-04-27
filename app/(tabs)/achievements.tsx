import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../../context/AppContext";
import { ARTISTS, TATTOO_STYLES } from "../../data/mock";

// ─── helpers ────────────────────────────────────────────────────────────────
function FloralDivider() {
  return (
    <View className="flex-row items-center justify-center my-1">
      <Text className="text-ink-gold-dim text-[11px] tracking-[4px]">{"\u2726 \u2767 \u2726"}</Text>
    </View>
  );
}

// XP por sessão concluída
const XP_PER_SESSION = 200;
const XP_PER_BOOKING = 50;

type Rank = { label: string; min: number; max: number; color: string; icon: string; nextLabel: string };
const RANKS: Rank[] = [
  { label: "Iniciante",      min: 0,    max: 199,  color: "#71717a", icon: "🪨", nextLabel: "Aprendiz" },
  { label: "Aprendiz",       min: 200,  max: 499,  color: "#a78bfa", icon: "🎨", nextLabel: "Entusiasta" },
  { label: "Entusiasta",     min: 500,  max: 999,  color: "#3b82f6", icon: "💧", nextLabel: "Colecionador" },
  { label: "Colecionador",   min: 1000, max: 1999, color: "#22c55e", icon: "💎", nextLabel: "Viciado em Ink" },
  { label: "Viciado em Ink", min: 2000, max: 3499, color: "#f97316", icon: "🔥", nextLabel: "Ink Master" },
  { label: "Ink Master",     min: 3500, max: 99999, color: "#D4AF37", icon: "👑", nextLabel: "Nível máximo" },
];

function getRank(xp: number): Rank {
  return RANKS.slice().reverse().find((r) => xp >= r.min) ?? RANKS[0];
}

// ─── Seção: Ranking & XP ────────────────────────────────────────────────────
function RankSection({ xp, totalSessions }: { xp: number; totalSessions: number }) {
  const rank = getRank(xp);
  const nextRank = RANKS[RANKS.indexOf(rank) + 1];
  const progress = nextRank
    ? Math.min(((xp - rank.min) / (rank.max - rank.min + 1)) * 100, 100)
    : 100;

  return (
    <View className="mx-4 mb-5 bg-ink-card rounded-2xl border border-ink-border-warm overflow-hidden">
      <View className="h-[3px]" style={{ backgroundColor: rank.color }} />
      <View className="p-5">
        {/* Rank header */}
        <View className="flex-row items-center mb-4">
          <View
            className="w-16 h-16 rounded-full items-center justify-center mr-4 border-2"
            style={{ backgroundColor: rank.color + "22", borderColor: rank.color }}
          >
            <Text style={{ fontSize: 28 }}>{rank.icon}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-ink-muted text-[10px] uppercase tracking-[2px]">Nível Atual</Text>
            <Text className="text-white text-[22px] font-black" style={{ color: rank.color }}>
              {rank.label}
            </Text>
            <Text className="text-ink-muted text-[11px] mt-0.5">{xp} XP acumulados</Text>
          </View>
          <View className="items-end">
            <Text className="text-ink-gold text-[22px] font-black">{totalSessions}</Text>
            <Text className="text-ink-muted text-[9px]">sessões</Text>
          </View>
        </View>

        {/* XP bar */}
        {nextRank && (
          <View>
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-ink-muted text-[10px]">{rank.label}</Text>
              <Text className="text-ink-muted text-[10px]">{rank.nextLabel} ({rank.max + 1} XP)</Text>
            </View>
            <View className="h-2.5 bg-ink-surface rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{ width: `${progress}%`, backgroundColor: rank.color }}
              />
            </View>
            <Text className="text-ink-dim text-[10px] mt-1.5 text-center">
              {nextRank ? `Faltam ${Math.max(0, nextRank.min - xp)} XP para ${nextRank.label}` : "Nível máximo alcançado!"}
            </Text>
          </View>
        )}
        {!nextRank && (
          <View className="bg-[#1a1500] rounded-xl py-2.5 items-center border border-ink-gold">
            <Text className="text-ink-gold text-xs font-black tracking-[2px]">👑 NÍVEL MÁXIMO ALCANÇADO</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Seção: Conquistas ───────────────────────────────────────────────────────
type Badge = { label: string; desc: string; icon: string; earned: boolean; xp: number };

function AchievementsSection({ badges }: { badges: Badge[] }) {
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  return (
    <View className="px-4 mb-5">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white text-sm font-black uppercase tracking-[2px]">Conquistas</Text>
        <View className="bg-ink-gold rounded-full px-2.5 py-1">
          <Text className="text-black text-[10px] font-black">{earned.length}/{badges.length}</Text>
        </View>
      </View>

      {earned.length > 0 && (
        <>
          <Text className="text-ink-muted text-[10px] uppercase tracking-[2px] mb-2">Desbloqueadas</Text>
          <View className="flex-row flex-wrap gap-3 mb-4">
            {earned.map((b) => (
              <View
                key={b.label}
                className="rounded-2xl p-3.5 items-center"
                style={{ width: "47%", backgroundColor: "#1a1500", borderWidth: 1, borderColor: "#D4AF37" }}
              >
                <Text style={{ fontSize: 30 }} className="mb-1.5">{b.icon}</Text>
                <Text className="text-ink-gold text-[11px] font-black text-center">{b.label}</Text>
                <Text className="text-ink-muted text-[9px] text-center mt-0.5 leading-[13px]">{b.desc}</Text>
                <View className="mt-1.5 bg-[#111] rounded-lg px-2 py-0.5">
                  <Text className="text-ink-gold-dim text-[9px] font-bold">+{b.xp} XP ✓</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      <Text className="text-ink-muted text-[10px] uppercase tracking-[2px] mb-2">Bloqueadas</Text>
      <View className="flex-row flex-wrap gap-3">
        {locked.map((b) => (
          <View
            key={b.label}
            className="rounded-2xl p-3.5 items-center"
            style={{ width: "47%", backgroundColor: "#111", borderWidth: 1, borderColor: "#1f1f1f", opacity: 0.5 }}
          >
            <Text style={{ fontSize: 30, filter: "grayscale(1)" }} className="mb-1.5">🔒</Text>
            <Text className="text-ink-dim text-[11px] font-black text-center">{b.label}</Text>
            <Text className="text-ink-dim text-[9px] text-center mt-0.5 leading-[13px]">{b.desc}</Text>
            <View className="mt-1.5 bg-[#1a1a1a] rounded-lg px-2 py-0.5">
              <Text className="text-ink-dim text-[9px]">+{b.xp} XP</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Seção: Desafios ─────────────────────────────────────────────────────────
type Challenge = { label: string; desc: string; icon: string; current: number; goal: number; xp: number; color: string };

function ChallengesSection({ challenges }: { challenges: Challenge[] }) {
  return (
    <View className="px-4 mb-5">
      <Text className="text-white text-sm font-black uppercase tracking-[2px] mb-3">Desafios Ativos</Text>
      <View className="gap-3">
        {challenges.map((c) => {
          const done = c.current >= c.goal;
          const pct = Math.min((c.current / c.goal) * 100, 100);
          return (
            <View
              key={c.label}
              className="bg-ink-card rounded-2xl border border-ink-border-warm p-4"
              style={done ? { borderColor: c.color } : {}}
            >
              <View className="flex-row items-center mb-3">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: c.color + "22", borderWidth: 1, borderColor: c.color }}
                >
                  <Text style={{ fontSize: 18 }}>{c.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white text-[13px] font-black">{c.label}</Text>
                  <Text className="text-ink-muted text-[10px] mt-0.5">{c.desc}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-[11px] font-black" style={{ color: c.color }}>
                    +{c.xp} XP
                  </Text>
                  {done && <Text className="text-[9px] text-ink-green mt-0.5">Concluído ✓</Text>}
                </View>
              </View>
              <View className="flex-row items-center gap-3">
                <View className="flex-1 h-2 bg-ink-surface rounded-full overflow-hidden">
                  <View className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: c.color }} />
                </View>
                <Text className="text-ink-muted text-[10px]">{c.current}/{c.goal}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── Seção: Streak ───────────────────────────────────────────────────────────
function StreakSection({ streak }: { streak: number }) {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const now = new Date();
  // Simula últimos 12 meses com atividade
  const activity = months.map((_, i) => {
    const monthIdx = (now.getMonth() - (11 - i) + 12) % 12;
    return { label: months[monthIdx], active: i >= 12 - streak };
  });

  return (
    <View className="mx-4 mb-5 bg-ink-card rounded-2xl border border-ink-border-warm p-5">
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-white text-sm font-black uppercase tracking-[2px]">Sequência</Text>
          <Text className="text-ink-muted text-[10px] mt-0.5">Meses consecutivos tatuando</Text>
        </View>
        <View className="items-center">
          <Text className="text-[32px] font-black" style={{ color: streak >= 3 ? "#f97316" : "#D4AF37" }}>
            {streak}
          </Text>
          <Text className="text-ink-muted text-[9px]">meses 🔥</Text>
        </View>
      </View>
      <View className="flex-row justify-between">
        {activity.map((m, i) => (
          <View key={i} className="items-center gap-1">
            <View
              className="w-5 h-5 rounded"
              style={{ backgroundColor: m.active ? "#D4AF37" : "#1f1f1f", borderWidth: 1, borderColor: m.active ? "#b8972e" : "#2a2a2a" }}
            />
            <Text className="text-ink-dim" style={{ fontSize: 7 }}>{m.label}</Text>
          </View>
        ))}
      </View>
      {streak >= 3 && (
        <View className="mt-3 bg-[#1a1500] rounded-xl py-2 items-center border border-ink-gold-dim">
          <Text className="text-ink-gold text-[10px] font-black tracking-[1px]">🔥 Sequência de {streak} meses!</Text>
        </View>
      )}
    </View>
  );
}

// ─── Seção: Estatísticas Visuais ─────────────────────────────────────────────
function StatsSection({ bookings }: { bookings: ReturnType<typeof useApp>["bookings"] }) {
  // Estilos mais usados
  const styleCounts: Record<string, number> = {};
  bookings.forEach((b) => { styleCounts[b.styleId] = (styleCounts[b.styleId] ?? 0) + 1; });
  const topStyles = Object.entries(styleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id, count]) => {
      const style = TATTOO_STYLES.find((s) => s.id === id);
      return { label: style?.label ?? id, emoji: style?.emoji ?? "🎨", count };
    });
  const maxCount = topStyles[0]?.count ?? 1;

  // Artistas mais frequentes
  const artistCounts: Record<string, number> = {};
  bookings.forEach((b) => { artistCounts[b.artistId] = (artistCounts[b.artistId] ?? 0) + 1; });
  const topArtists = Object.entries(artistCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, count]) => {
      const artist = ARTISTS.find((a) => a.id === id);
      return { name: artist?.name ?? "?", avatar: artist?.avatar ?? "", count };
    });

  return (
    <View className="px-4 mb-5">
      <Text className="text-white text-sm font-black uppercase tracking-[2px] mb-3">Estatísticas</Text>

      {/* Estilos */}
      <View className="bg-ink-card rounded-2xl border border-ink-border-warm p-4 mb-3">
        <Text className="text-ink-muted text-[10px] uppercase tracking-[2px] mb-3">Estilos Favoritos</Text>
        {topStyles.length === 0 ? (
          <Text className="text-ink-dim text-xs text-center py-4">Faça agendamentos para ver seus estilos</Text>
        ) : (
          <View className="gap-2.5">
            {topStyles.map((s) => (
              <View key={s.label} className="flex-row items-center gap-2">
                <Text className="text-base w-6 text-center">{s.emoji}</Text>
                <Text className="text-white text-xs font-bold w-24">{s.label}</Text>
                <View className="flex-1 h-2 bg-ink-surface rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full bg-ink-gold"
                    style={{ width: `${(s.count / maxCount) * 100}%` }}
                  />
                </View>
                <Text className="text-ink-muted text-[10px] w-4 text-right">{s.count}x</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Top Artistas */}
      <View className="bg-ink-card rounded-2xl border border-ink-border-warm p-4">
        <Text className="text-ink-muted text-[10px] uppercase tracking-[2px] mb-3">Artistas Mais Frequentes</Text>
        {topArtists.length === 0 ? (
          <Text className="text-ink-dim text-xs text-center py-4">Nenhum dado disponível ainda</Text>
        ) : (
          <View className="flex-row gap-4 justify-center">
            {topArtists.map((a, i) => (
              <View key={a.name} className="items-center">
                <View className="relative mb-2">
                  <Image
                    source={{ uri: a.avatar }}
                    className="w-14 h-14 rounded-full border-2"
                    style={{ borderColor: i === 0 ? "#D4AF37" : "#2a2310" }}
                    resizeMode="cover"
                  />
                  {i === 0 && (
                    <View className="absolute -top-1 -right-1 w-5 h-5 bg-ink-gold rounded-full items-center justify-center">
                      <Text style={{ fontSize: 10 }}>👑</Text>
                    </View>
                  )}
                </View>
                <Text className="text-white text-[11px] font-bold text-center">{a.name.split(" ")[0]}</Text>
                <Text className="text-ink-muted text-[9px]">{a.count} sessão(ões)</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Seção: Loja de Recompensas ──────────────────────────────────────────────
type Reward = { label: string; desc: string; icon: string; cost: number; available: boolean };
const REWARDS: Reward[] = [
  { label: "10% de Desconto",  desc: "Na próxima sessão",         icon: "🏷️", cost: 500,  available: true },
  { label: "Retoque Grátis",   desc: "Válido por 3 meses",        icon: "🎨", cost: 800,  available: true },
  { label: "Sessão Prioritária", desc: "Agendamento com prioridade", icon: "⚡", cost: 1200, available: false },
  { label: "Tattoo Aftercare Kit", desc: "Kit de cuidados pós-tattoo", icon: "💎", cost: 1500, available: false },
  { label: "Tattoo Flash Grátis", desc: "Design exclusivo do estúdio", icon: "🌟", cost: 3000, available: false },
  { label: "Sessão Completa",  desc: "1 tattoo M sem custo",       icon: "👑", cost: 5000, available: false },
];

function RewardsSection({ xp }: { xp: number }) {
  return (
    <View className="px-4 mb-5">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-white text-sm font-black uppercase tracking-[2px]">Loja de Recompensas</Text>
        <View className="bg-ink-surface rounded-xl px-3 py-1 border border-ink-gold-dim">
          <Text className="text-ink-gold text-[11px] font-black">{xp} XP</Text>
        </View>
      </View>
      <Text className="text-ink-muted text-[10px] mb-3 leading-[15px]">
        Use seus XP para resgatar recompensas exclusivas do Ink Studio.
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {REWARDS.map((r) => {
          const canAfford = xp >= r.cost;
          return (
            <View
              key={r.label}
              className="rounded-2xl border p-4"
              style={{
                width: "47%",
                backgroundColor: canAfford ? "#1a1500" : "#111",
                borderColor: canAfford ? "#D4AF37" : "#1f1f1f",
                opacity: canAfford ? 1 : 0.55,
              }}
            >
              <Text style={{ fontSize: 26 }} className="mb-2">{r.icon}</Text>
              <Text className="text-[11px] font-black mb-0.5" style={{ color: canAfford ? "#D4AF37" : "#a1a1aa" }}>
                {r.label}
              </Text>
              <Text className="text-ink-dim text-[10px] mb-2 leading-[14px]">{r.desc}</Text>
              <TouchableOpacity
                className="rounded-xl py-1.5 items-center"
                activeOpacity={canAfford ? 0.8 : 1}
                style={{ backgroundColor: canAfford ? "#D4AF37" : "#1a1a1a" }}
              >
                <Text className="text-[10px] font-black" style={{ color: canAfford ? "#000" : "#52525b" }}>
                  {canAfford ? `Resgatar · ${r.cost} XP` : `${r.cost} XP`}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      <View className="mt-4 items-center px-4">
        <Text className="text-ink-dim text-[10px] text-center leading-[15px]">
          Recompensas para fins demonstrativos.{"\n"}Em breve disponíveis para resgate real.
        </Text>
      </View>
    </View>
  );
}

// ─── Tela Principal ──────────────────────────────────────────────────────────
export default function AchievementsScreen() {
  const { bookings } = useApp();

  const totalSessions = bookings.length;
  const completedSessions = bookings.filter((b) => b.status === "completed").length;

  // XP calculado
  const xp = completedSessions * XP_PER_SESSION + totalSessions * XP_PER_BOOKING;

  // Streak: número de meses únicos com bookings (max 12)
  const uniqueMonths = new Set(
    bookings.map((b) => {
      const [d, m, y] = b.preferredDate.split("/");
      return `${y}-${m}`;
    })
  ).size;
  const streak = Math.min(uniqueMonths, 12);

  // Badges
  const badges: Badge[] = [
    { label: "Primeira Tattoo",    desc: "Realizou o primeiro agendamento",    icon: "🎨", earned: totalSessions >= 1,     xp: 100 },
    { label: "Cliente Fiel",       desc: "3 sessões no Ink Studio",            icon: "⭐", earned: totalSessions >= 3,     xp: 250 },
    { label: "Colecionador",       desc: "2 tattoos concluídas",               icon: "🏆", earned: completedSessions >= 2, xp: 300 },
    { label: "Ink Lover",          desc: "5 sessões no total",                 icon: "💎", earned: totalSessions >= 5,     xp: 500 },
    { label: "Veterano",           desc: "10 sessões no total",                icon: "🔥", earned: totalSessions >= 10,    xp: 1000 },
    { label: "Ink Master",         desc: "Atingiu o nível máximo de ranking",  icon: "👑", earned: xp >= 3500,            xp: 2000 },
    { label: "Maratonista",        desc: "Agendamentos em 3 meses seguidos",   icon: "📅", earned: streak >= 3,           xp: 400 },
    { label: "Estilo Único",       desc: "Tattoos em 4 estilos diferentes",    icon: "🌈", earned: new Set(bookings.map((b) => b.styleId)).size >= 4, xp: 350 },
  ];

  // Desafios ativos
  const challenges: Challenge[] = [
    {
      label: "Primeira Sessão",
      desc: "Complete o seu primeiro agendamento",
      icon: "🎯",
      current: Math.min(totalSessions, 1),
      goal: 1,
      xp: 100,
      color: "#D4AF37",
    },
    {
      label: "Trilha do Colecionador",
      desc: "Faça 3 tattoos neste ano",
      icon: "🗓️",
      current: Math.min(totalSessions, 3),
      goal: 3,
      xp: 300,
      color: "#3b82f6",
    },
    {
      label: "Explorador de Estilos",
      desc: "Experimente 3 estilos diferentes",
      icon: "🌈",
      current: Math.min(new Set(bookings.map((b) => b.styleId)).size, 3),
      goal: 3,
      xp: 250,
      color: "#a78bfa",
    },
    {
      label: "Sequência de Fogo",
      desc: "Tattoos em 3 meses consecutivos",
      icon: "🔥",
      current: Math.min(streak, 3),
      goal: 3,
      xp: 400,
      color: "#f97316",
    },
    {
      label: "Ink Master",
      desc: "Acumule 3.500 XP",
      icon: "👑",
      current: Math.min(xp, 3500),
      goal: 3500,
      xp: 2000,
      color: "#22c55e",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-ink-bg" edges={["top"]}>
      {/* HEADER */}
      <View className="px-5 pt-4 pb-1">
        <Text className="text-ink-gold-dim text-[10px] uppercase tracking-[3px]">Ink Studio</Text>
        <Text className="text-white text-[22px] font-black uppercase tracking-[3px]">Conquistas</Text>
        <FloralDivider />
        <Text className="text-ink-muted text-xs mt-1 leading-[18px]">
          Suba de nível, desbloqueie badges e resgate recompensas.
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
      >
        <RankSection xp={xp} totalSessions={totalSessions} />

        <View className="my-3 mx-4"><FloralDivider /></View>

        <ChallengesSection challenges={challenges} />

        <View className="my-3 mx-4"><FloralDivider /></View>

        <AchievementsSection badges={badges} />

        <View className="my-3 mx-4"><FloralDivider /></View>

        <StreakSection streak={streak} />

        <View className="my-3 mx-4"><FloralDivider /></View>

        <StatsSection bookings={bookings} />

        <View className="my-3 mx-4"><FloralDivider /></View>

        <RewardsSection xp={xp} />
      </ScrollView>
    </SafeAreaView>
  );
}
