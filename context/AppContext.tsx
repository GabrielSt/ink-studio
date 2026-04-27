import React, { createContext, useContext, useState, ReactNode } from "react";
import { Booking } from "../data/mock";

type AppContextType = {
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  pendingArtistId: string | null;
  setPendingArtistId: (id: string | null) => void;
};

const AppContext = createContext<AppContextType>({
  bookings: [],
  addBooking: () => {},
  updateBooking: () => {},
  pendingArtistId: null,
  setPendingArtistId: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pendingArtistId, setPendingArtistId] = useState<string | null>(null);

  const addBooking = (b: Booking) =>
    setBookings((prev) => [b, ...prev]);

  const updateBooking = (id: string, patch: Partial<Booking>) =>
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } : b))
    );

  return (
    <AppContext.Provider
      value={{ bookings, addBooking, updateBooking, pendingArtistId, setPendingArtistId }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
