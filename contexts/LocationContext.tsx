"use client";

import { createContext, useContext, useState, useEffect } from "react";

// ── tipos ──────────────────────────────────────────────────────────────────
type LocationData = {
  city: string;
  state: string;
  lat?: number;
  lng?: number;
} | null;

type LocationStatus = "idle" | "loading" | "granted" | "denied" | "unsupported";

type LocationContextType = {
  location: LocationData;
  status: LocationStatus;
  requestLocation: () => void;
};

// ── context ────────────────────────────────────────────────────────────────
const LocationContext = createContext<LocationContextType | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<LocationData>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");

  async function reverseGeocode(lat: number, lng: number) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.county ||
        "sua cidade";
      const state = data.address?.state_code || data.address?.state || "";
      setLocation({ city, state, lat, lng });
    } catch {
      setLocation({ city: "sua cidade", state: "", lat, lng });
    }
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      setStatus("unsupported");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setStatus("granted");
        reverseGeocode(coords.latitude, coords.longitude);
      },
      () => {
        setStatus("denied");
        setLocation(null);
      }
    );
  }

  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, status, requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextType {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used inside <LocationProvider>");
  return ctx;
}