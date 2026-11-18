"use client";

import { useEffect, useState } from "react";
import EventCard from "@/components/EventCard";
import {
  Fire,
  MapPin,
  CalendarBlank,
  ArrowClockwise,
  WarningCircle,
} from "@phosphor-icons/react";
import { useLocation } from "@/contexts/LocationContext";
import { eventsService, SectionResponse } from "@/services/eventsService";

const ICON_MAP: Record<string, React.ElementType> = {
  destaque: Fire,
  perto: MapPin,
  proxima: CalendarBlank,
};

export default function EventosPage() {
  const [sections, setSections] = useState<SectionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const locationCtx = useLocation();
  const location = locationCtx?.location ?? null;
  const status = locationCtx?.status ?? "idle";

  useEffect(() => {
    if (status === "loading" || status === "idle") return;

    let active = true;

    eventsService
      .getHomeEvents(location?.lat, location?.lng)
      .then((data) => {
        if (active) setSections(data);
      })
      .catch((err) => {
        console.error("Erro ao carregar eventos da Home:", err);
        if (active) {
          setError("Não foi possível carregar os eventos agora.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [location?.lat, location?.lng, status, reloadKey]);

  const retry = () => {
    setLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  };
  const hasEvents = sections.some((section) => section.events.length > 0);

  if (loading && sections.length === 0) {
    return (
      <div className="min-h-screen bg-off-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="h-8 w-44 rounded-full bg-gray-200 animate-pulse" />
          <div className="mt-6 flex gap-2 overflow-hidden">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="w-[260px] h-[300px] shrink-0 rounded-2xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && sections.length === 0) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center bg-white border-2 border-gray-200 rounded-[24px] p-8">
          <span className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500">
            <WarningCircle size={24} weight="fill" />
          </span>
          <h1 className="font-display text-xl font-extrabold text-black mt-5">
            Deu ruim ao carregar
          </h1>
          <p className="font-body text-sm text-gray-500 mt-2">
            Não conseguimos buscar os eventos agora. Tente novamente em instantes.
          </p>
          <button
            type="button"
            onClick={retry}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary border-2 border-black px-5 py-3 font-display text-sm font-extrabold text-black transition-all hover:-translate-y-0.5"
          >
            <ArrowClockwise size={16} weight="bold" />
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!hasEvents) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center bg-white border-2 border-gray-200 rounded-[24px] p-8">
          <span className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-500">
            <CalendarBlank size={24} weight="bold" />
          </span>
          <h1 className="font-display text-xl font-extrabold text-black mt-5">
            Nenhum evento por aqui
          </h1>
          <p className="font-body text-sm text-gray-500 mt-2">
            Ainda não encontramos eventos para mostrar. Tente de novo mais tarde ou
            amplie sua busca.
          </p>
          <button
            type="button"
            onClick={retry}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary border-2 border-black px-5 py-3 font-display text-sm font-extrabold text-black transition-all hover:-translate-y-0.5"
          >
            <ArrowClockwise size={16} weight="bold" />
            Atualizar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white">
      <header className="max-w-6xl mx-auto px-6 pt-10">
        <h1 className="font-display text-3xl font-extrabold text-black tracking-tight">
          Eventos e festas universitárias perto de você
        </h1>
      </header>
      <div className="flex flex-col gap-12 py-10">
        {sections.map(({ id, label, events }) => {
          if (!events || events.length === 0) return null;

          const Icon = ICON_MAP[id] || Fire;

          return (
            <section key={id}>
              <div className="max-w-6xl mx-auto px-6 flex items-center justify-between mb-5">
                <h2 className="flex items-center gap-2 font-display text-h3 font-extrabold text-black tracking-tight">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary rounded-card-sm shrink-0">
                    <Icon size={16} weight="bold" />
                  </span>
                  {label}
                </h2>
              </div>

              <div className="pl-6 md:pl-[max(24px,calc((100vw-1200px)/2+24px))]">
                <div className="carousel-scroll flex gap-2 overflow-x-auto pb-3 pr-6">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
