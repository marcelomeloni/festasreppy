"use client";

import { useState } from "react";
import { getEventInitials, getEventTitle } from "@/lib/eventDisplay";

interface EventArtworkProps {
  src?: string | null;
  title?: string | null;
  subtitle?: string | null;
  variant?: "banner" | "card";
  className?: string;
}

export function EventArtwork({
  src,
  title,
  subtitle,
  variant = "card",
  className = "",
}: EventArtworkProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageSrc = src?.trim() ?? "";
  const eventTitle = getEventTitle(title);
  const initials = getEventInitials(eventTitle);
  const isBanner = variant === "banner";

  if (imageSrc && failedSrc !== imageSrc) {
    return (
      <img
        src={imageSrc}
        alt={`Imagem do evento ${eventTitle}`}
        loading={isBanner ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailedSrc(imageSrc)}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-[#0A0A0A] ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(27,255,17,0.22),transparent_42%),radial-gradient(circle_at_85%_80%,rgba(27,255,17,0.12),transparent_38%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:28px_28px]" />

      <span
        className={`absolute -bottom-6 -right-3 font-bricolage font-extrabold uppercase leading-none text-primary/10 ${
          isBanner ? "text-[180px] md:text-[240px]" : "text-[104px]"
        }`}
      >
        {initials}
      </span>

      <div
        className={`relative z-10 flex h-full w-full flex-col justify-between ${
          isBanner ? "p-6 md:p-10" : "p-4"
        }`}
      >
        <span
          className={`self-start rounded-full border border-primary/40 bg-black/40 px-2.5 py-1 font-bricolage font-extrabold uppercase tracking-[0.18em] text-primary backdrop-blur-sm ${
            isBanner ? "text-[11px]" : "text-[9px]"
          }`}
        >
          Reppy
        </span>

        <div className={isBanner ? "max-w-[80%]" : "max-w-full"}>
          <p
            className={`line-clamp-3 font-bricolage font-extrabold uppercase tracking-tight text-white ${
              isBanner
                ? "text-3xl leading-none md:text-5xl"
                : "text-[15px] leading-tight"
            }`}
          >
            {eventTitle}
          </p>
          {subtitle && (
            <p
              className={`mt-2 font-body font-semibold uppercase tracking-[0.12em] text-white/60 ${
                isBanner ? "text-[11px] md:text-xs" : "text-[9px]"
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
