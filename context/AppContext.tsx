import React, { createContext, useContext, useState, ReactNode } from "react";
import { Booking } from "../data/mock";

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
};

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  email: "",
  phone: "",
  avatar: null,
};

type AppContextType = {
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  pendingArtistId: string | null;
  setPendingArtistId: (id: string | null) => void;
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
  clearProfile: () => void;
  favoriteArtists: string[];
  toggleFavoriteArtist: (id: string) => void;
  isFavoriteArtist: (id: string) => boolean;
};

const AppContext = createContext<AppContextType>({
  bookings: [],
  addBooking: () => {},
  updateBooking: () => {},
  pendingArtistId: null,
  setPendingArtistId: () => {},
  profile: DEFAULT_PROFILE,
  updateProfile: () => {},
  clearProfile: () => {},
  favoriteArtists: [],
  toggleFavoriteArtist: () => {},
  isFavoriteArtist: () => false,
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pendingArtistId, setPendingArtistId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [favoriteArtists, setFavoriteArtists] = useState<string[]>([]);

  const addBooking = (b: Booking) => setBookings((prev) => [b, ...prev]);

  const updateBooking = (id: string, patch: Partial<Booking>) =>
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const updateProfile = (patch: Partial<UserProfile>) =>
    setProfile((prev) => ({ ...prev, ...patch }));

  const clearProfile = () => setProfile(DEFAULT_PROFILE);

  const toggleFavoriteArtist = (id: string) =>
    setFavoriteArtists((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );

  const isFavoriteArtist = (id: string) => favoriteArtists.includes(id);

  return (
    <AppContext.Provider
      value={{
        bookings, addBooking, updateBooking,
        pendingArtistId, setPendingArtistId,
        profile, updateProfile, clearProfile,
        favoriteArtists, toggleFavoriteArtist, isFavoriteArtist,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
