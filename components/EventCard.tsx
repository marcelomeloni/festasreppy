"use client";

import Link from "next/link";
import { MapPin, Clock } from "@phosphor-icons/react";
import { EventArtwork } from "@/components/evento/EventArtwork";
import {
  cleanText,
  getEventCardMeta,
  getEventTitle,
} from "@/lib/eventDisplay";
import type { EventCard as EventCardData } from "@/services/eventsService";

export default function EventCard({ event }: { event: EventCardData }) {
  const title = getEventTitle(event.title);
  const category = cleanText(event.category);
  const meta = getEventCardMeta(event);

  return (
    <Link
      href={`/${event.slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer shrink-0 w-[260px] bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative w-full h-44 overflow-hidden">
        <EventArtwork src={event.image} title={title} variant="card" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm font-display text-[10px] font-bold uppercase tracking-widest text-gray-600">
            {category}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2.5 p-4 flex-1">
        <h3 className="font-display font-extrabold text-black leading-tight tracking-tight text-[17px] line-clamp-2 group-hover:text-primary transition-colors duration-150">
          {title}
        </h3>

        <p
          className={`flex items-center gap-1.5 font-body text-[13px] font-semibold ${
            meta.dateIsPlaceholder ? "text-gray-400" : "text-primary"
          }`}
        >
          <Clock
            size={13}
            weight="bold"
            className={`shrink-0 ${meta.dateIsPlaceholder ? "text-gray-300" : ""}`}
          />
          {meta.dateLabel}
        </p>

        <span className="flex items-center gap-1.5 font-body text-[13px] font-medium text-gray-400 mt-auto pt-1 border-t border-gray-100">
          <MapPin size={13} weight="bold" className="shrink-0 text-gray-300" />
          {meta.locationLabel}
        </span>
      </div>
    </Link>
  );
}
