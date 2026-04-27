export type TattooStyle = {
  id: string;
  label: string;
  emoji: string;
  description: string;
};

export type Artist = {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  avatar: string;
  styles: string[];
  instagram: string;
};

export type BodyLocation = {
  id: string;
  label: string;
};

export type TattooSize = {
  id: string;
  label: string;
  description: string;
  priceRange: string;
};

export const TATTOO_STYLES: TattooStyle[] = [
  { id: "realism", label: "Realismo", emoji: "🎨", description: "Fiel à vida real" },
  { id: "blackwork", label: "Blackwork", emoji: "◼️", description: "Tinta preta intensa" },
  { id: "oldschool", label: "Old School", emoji: "⚓", description: "Estilo clássico" },
  { id: "geometric", label: "Geométrico", emoji: "🔺", description: "Formas precisas" },
  { id: "watercolor", label: "Aquarela", emoji: "💧", description: "Cores vibrantes" },
  { id: "fineline", label: "Fine Line", emoji: "✏️", description: "Traços delicados" },
  { id: "tribal", label: "Tribal", emoji: "🌀", description: "Padrões étnicos" },
  { id: "neotraditional", label: "Neo Trad", emoji: "🌹", description: "Moderno e clássico" },
];

export const ARTISTS: Artist[] = [
  {
    id: "a1",
    name: "Dante Cruz",
    specialty: "Realismo & Blackwork",
    experience: "12 anos",
    avatar: "https://i.pravatar.cc/150?img=11",
    styles: ["realism", "blackwork"],
    instagram: "@dante.tattoo",
  },
  {
    id: "a2",
    name: "Lara Voss",
    specialty: "Aquarela & Fine Line",
    experience: "8 anos",
    avatar: "https://i.pravatar.cc/150?img=5",
    styles: ["watercolor", "fineline"],
    instagram: "@laravoss.ink",
  },
  {
    id: "a3",
    name: "Marcus Onyx",
    specialty: "Geométrico & Tribal",
    experience: "10 anos",
    avatar: "https://i.pravatar.cc/150?img=8",
    styles: ["geometric", "tribal"],
    instagram: "@marcus.onyx",
  },
  {
    id: "a4",
    name: "Sofia Reyes",
    specialty: "Old School & Neo Trad",
    experience: "6 anos",
    avatar: "https://i.pravatar.cc/150?img=9",
    styles: ["oldschool", "neotraditional"],
    instagram: "@sofia.reyes.ink",
  },
];

export const BODY_LOCATIONS: BodyLocation[] = [
  { id: "arm", label: "Braço" },
  { id: "forearm", label: "Antebraço" },
  { id: "chest", label: "Peitoral" },
  { id: "back", label: "Costas" },
  { id: "leg", label: "Perna" },
  { id: "calf", label: "Panturrilha" },
  { id: "neck", label: "Pescoço" },
  { id: "hand", label: "Mão" },
  { id: "foot", label: "Pé" },
  { id: "ribs", label: "Costelas" },
  { id: "shoulder", label: "Ombro" },
  { id: "wrist", label: "Pulso" },
  { id: "ankle", label: "Tornozelo" },
  { id: "other", label: "Outro" },
];

export const TATTOO_SIZES: TattooSize[] = [
  { id: "xs", label: "XS", description: "Até 5cm", priceRange: "A partir de R$ 200" },
  { id: "s",  label: "P",  description: "5–10cm",  priceRange: "A partir de R$ 400" },
  { id: "m",  label: "M",  description: "10–20cm", priceRange: "A partir de R$ 700" },
  { id: "l",  label: "G",  description: "20–35cm", priceRange: "A partir de R$ 1.200" },
  { id: "xl", label: "XG", description: "35cm+",   priceRange: "Orçamento custom" },
];

export const GALLERY_IMAGES = [
  { id: "1", uri: "https://picsum.photos/seed/tattoo1/400/500", style: "Realismo" },
  { id: "2", uri: "https://picsum.photos/seed/tattoo2/400/500", style: "Blackwork" },
  { id: "3", uri: "https://picsum.photos/seed/tattoo3/400/500", style: "Geométrico" },
  { id: "4", uri: "https://picsum.photos/seed/tattoo4/400/500", style: "Aquarela" },
  { id: "5", uri: "https://picsum.photos/seed/tattoo5/400/500", style: "Fine Line" },
];

// Estilo genérico — aceito por qualquer artista
export const GENERIC_STYLE: TattooStyle = {
  id: "generic",
  label: "Não sei / Simples",
  emoji: "✨",
  description: "Qualquer artista",
};

// ─── TYPES PARA HISTÓRICO ──────────────────────────────────────────────────

export type BookingStatus =
  | "pending_quote"
  | "quote_received"
  | "confirmed"
  | "completed";

export type Booking = {
  id: string;
  clientName: string;
  artistId: string;
  styleId: string;
  sizeId: string;
  bodyLocation: string;
  preferredDate: string;
  preferredTime: string;
  description: string;
  status: BookingStatus;
  createdAt: string;
  quoteValue?: number;
  depositValue?: number;
};
