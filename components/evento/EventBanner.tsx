"use client";

import { EventArtwork } from "@/components/evento/EventArtwork";
import {
  getEventDateLabel,
  getEventTitle,
  UNKNOWN_DATE_LABEL,
} from "@/lib/eventDisplay";

interface EventBannerProps {
  imageUrl?: string | null;
  title?: string | null;
  date?: string | null;
}

export function EventBanner({ imageUrl, title, date }: EventBannerProps) {
  const eventTitle = getEventTitle(title);
  const dateLabel = getEventDateLabel(date);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 pt-6 md:pt-10">
      <div className="w-full aspect-video md:aspect-[16/9] bg-black rounded-[10px] overflow-hidden border-2 border-black relative">
        <EventArtwork
          src={imageUrl}
          title={eventTitle}
          subtitle={dateLabel === UNKNOWN_DATE_LABEL ? undefined : dateLabel}
          variant="banner"
        />
      </div>
    </div>
  );
}
