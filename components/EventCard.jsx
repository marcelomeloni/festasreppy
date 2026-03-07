"use client";

import Link from "next/link";
import { MapPin, Clock } from "@phosphor-icons/react";

export default function EventCard({ event }) {
  return (
    <Link
      href={`/${event.slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer shrink-0 w-[260px] bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative w-full h-44 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Category pill — floated on top of image */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm font-display text-[10px] font-bold uppercase tracking-widest text-gray-600">
          {event.category}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2.5 p-4 flex-1">
        <h3 className="font-display font-extrabold text-black leading-tight tracking-tight text-[17px] line-clamp-2 group-hover:text-primary transition-colors duration-150">
          {event.title}
        </h3>

        <p className="flex items-center gap-1.5 font-body text-[13px] font-semibold text-primary">
          <Clock size={13} weight="bold" className="shrink-0" />
          {event.date} · {event.time}
        </p>

        <span className="flex items-center gap-1.5 font-body text-[13px] font-medium text-gray-400 mt-auto pt-1 border-t border-gray-100">
          <MapPin size={13} weight="bold" className="shrink-0 text-gray-300" />
          {event.venue.split(",")[0]}
        </span>
      </div>
    </Link>
  );
}