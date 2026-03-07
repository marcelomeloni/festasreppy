"use client";

import { useEffect, useState } from "react";
import EventCard from "@/components/EventCard";
import { Fire, MapPin, CalendarBlank, ArrowRight } from "@phosphor-icons/react";
import { useLocation } from "@/contexts/LocationContext"; // Confirme se o caminho do seu context é esse
import { eventsService, SectionResponse } from "@/services/eventsService";

// Mapeamento dos ícones do Phosphor para cada ID de seção que vem da API
const ICON_MAP: Record<string, React.ElementType> = {
  destaque: Fire,
  perto: MapPin,
  proxima: CalendarBlank,
};

export default function EventosPage() {
  const [sections, setSections] = useState<SectionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pegamos a location (que agora tem lat e lng) e o status do contexto
  const { location, status } = useLocation();

  useEffect(() => {
    // Só faz a requisição se o LocationContext já tentou pegar as coordenadas
    if (status === "loading" || status === "idle") return;

    setLoading(true);

    // Passa lat e lng para o service (undefined se não existirem)
    eventsService
      .getHomeEvents(location?.lat, location?.lng)
      .then((data) => {
        setSections(data);
      })
      .catch((err) => {
        console.error("Erro ao carregar eventos da Home:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location?.lat, location?.lng, status]); // Refaz a chamada caso a localização mude

  if (loading && sections.length === 0) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <p className="font-display text-gray-500">Carregando eventos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white">
      <div className="flex flex-col gap-12 py-10">
        {sections.map(({ id, label, events }) => {
          // Se uma seção não tiver eventos (ex: não achou nada perto), a gente não renderiza ela
          if (!events || events.length === 0) return null;

          const Icon = ICON_MAP[id] || Fire; // Fallback para o ícone de fogo se não achar

          return (
            <section key={id}>
              {/* Section header */}
              <div className="max-w-6xl mx-auto px-6 flex items-center justify-between mb-5">
                <h2 className="flex items-center gap-2 font-display text-h3 font-extrabold text-black tracking-tight">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary rounded-card-sm shrink-0">
                    <Icon size={16} weight="bold" />
                  </span>
                  {label}
                </h2>
                
              
              </div>

              {/* Horizontal carousel */}
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