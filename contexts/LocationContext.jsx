"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);  // { city, state }
  const [status, setStatus] = useState("idle");     // idle | loading | granted | denied | unsupported

  async function reverseGeocode(lat, lng) {
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
      setLocation({ city, state });
    } catch {
      setLocation({ city: "sua cidade", state: "" });
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

  // Pede permissão imediatamente ao entrar no app
  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, status, requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}