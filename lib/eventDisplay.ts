import type {
  EventAddress,
  EventData,
  EventCard as EventCardData,
} from "@/services/eventsService";

export const UNKNOWN_DATE_LABEL = "Data a divulgar";
export const UNKNOWN_LOCATION_LABEL = "Local a divulgar";
export const UNKNOWN_TITLE_LABEL = "Evento na Reppy";

export function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function cleanText(value: unknown): string {
  return hasText(value) ? value.trim() : "";
}

function isMissingDate(value: string): boolean {
  return /^data a (definir|divulgar)$/i.test(value.trim());
}

function isMissingLocation(value: string): boolean {
  return /^local a (definir|divulgar)$/i.test(value.trim());
}

export function getEventTitle(title: unknown): string {
  return cleanText(title) || UNKNOWN_TITLE_LABEL;
}

export function getEventInitials(value: unknown): string {
  const words = cleanText(value).split(/\s+/).filter(Boolean);
  if (words.length === 0) return "RP";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

export function getEventDateLabel(value: unknown): string {
  const date = cleanText(value);
  return !date || isMissingDate(date) ? UNKNOWN_DATE_LABEL : date;
}

type EventCardMetaInput = Pick<
  EventCardData,
  "date" | "time" | "venue" | "city" | "state"
>;

export interface EventCardMeta {
  dateLabel: string;
  dateIsPlaceholder: boolean;
  locationLabel: string;
  locationIsPlaceholder: boolean;
}

export function getEventCardMeta(event: EventCardMetaInput): EventCardMeta {
  const date = cleanText(event.date);
  const time = cleanText(event.time);
  const dateParts = [date, time].filter(Boolean);

  const city = cleanText(event.city);
  const state = cleanText(event.state);
  const cityState = [city, state].filter(Boolean).join(" - ");
  const rawVenue = cleanText(event.venue);
  const venue = isMissingLocation(rawVenue) ? "" : rawVenue;
  const location = cityState || venue;

  return {
    dateLabel: dateParts.join(" · ") || UNKNOWN_DATE_LABEL,
    dateIsPlaceholder: dateParts.length === 0,
    locationLabel: location || UNKNOWN_LOCATION_LABEL,
    locationIsPlaceholder: !location,
  };
}

type EventLocationInput = Pick<EventData, "locationName" | "address">;

export interface EventLocationPresentation {
  hasLocation: boolean;
  venueName: string;
  cityState: string;
  addressLines: string[];
  label: string;
  mapQuery: string | null;
}

export function getEventLocationPresentation(
  event: EventLocationInput,
): EventLocationPresentation {
  const address: Partial<EventAddress> = event.address ?? {};
  const venueName = cleanText(event.locationName);
  const streetLine = [cleanText(address.street), cleanText(address.number)]
    .filter(Boolean)
    .join(", ");
  const city = cleanText(address.city);
  const state = cleanText(address.state);
  const cityState = [city, state].filter(Boolean).join(", ");
  const neighborhood = cleanText(address.neighborhood);
  const zipCode = cleanText(address.zipCode);

  const addressLines = [
    streetLine,
    [neighborhood, cityState].filter(Boolean).join(" — "),
    zipCode ? `CEP: ${zipCode}` : "",
  ].filter(Boolean);

  const label = [venueName, cityState].filter(Boolean).join(" — ");
  const mapQuery =
    [streetLine, neighborhood, cityState, zipCode].filter(Boolean).join(", ") ||
    venueName ||
    null;

  return {
    hasLocation: Boolean(label || addressLines.length > 0 || mapQuery),
    venueName,
    cityState,
    addressLines,
    label: label || UNKNOWN_LOCATION_LABEL,
    mapQuery,
  };
}
