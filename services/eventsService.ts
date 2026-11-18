import { apiService } from "./apiService";

export interface EventCard {
  id: string;
  title: string;
  slug: string;
  venue: string;
  city: string;
  state: string;
  date: string;
  time: string;
  category: string;
  image: string;
}

export interface SectionResponse {
  id: string;
  label: string;
  events: EventCard[];
}

export interface EventAddress {
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
  neighborhood: string;
}

export interface EventPolicies {
  minAge: string;
  requiredDocs: string[];
  refundPolicy: string;
}

export interface PlatformFee {
  percentage: number;
  fixed: number;
}

export interface OrganizerData {
  name: string;
  slug: string;
  logoUrl: string;
}

export interface EventData {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string;
  instagram?: string;
  date: string;
  locationName: string;
  address: EventAddress;
  policies: EventPolicies;
  platformFee: PlatformFee;
  organizer: OrganizerData;
}

export interface OfficialLot {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  feePayer: "buyer" | "organizer";
  feePercentage: number;
  available: boolean;
  unavailableReason?: "sold_out" | "expired" | "not_started" | "waiting_previous" | "";
  quantityTotal: number;
  quantitySold: number;
  minPurchase: number;
  maxPurchase: number;
}

export interface OfficialCategory {
  id: string;
  name: string;
  type: string;
  description: string;
  lots: OfficialLot[];
}

export interface MarketLot {
  id: string;
  title: string;
  subtitle: string;
  categoryName: string;
  price: number;
  sellerId: string;
}

export interface EventDetailResponse {
  event: EventData;
  categories: OfficialCategory[];
  marketLots: MarketLot[];
}

function toNumber(v: unknown): number {
  const parsed = Number(v);
  return isFinite(parsed) ? parsed : 0;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizeEventCard(card: Partial<EventCard>): EventCard {
  return {
    id: text(card.id),
    title: text(card.title),
    slug: text(card.slug),
    venue: text(card.venue),
    city: text(card.city),
    state: text(card.state),
    date: text(card.date),
    time: text(card.time),
    category: text(card.category),
    image: text(card.image),
  };
}

function normalizeSections(sections: SectionResponse[] | null): SectionResponse[] {
  if (!Array.isArray(sections)) return [];
  return sections.map((section) => ({
    id: text(section.id),
    label: text(section.label),
    events: (section.events ?? []).map(normalizeEventCard),
  }));
}

function normalizeAddress(address: Partial<EventAddress> | null | undefined): EventAddress {
  return {
    street: text(address?.street),
    number: text(address?.number),
    city: text(address?.city),
    state: text(address?.state),
    zipCode: text(address?.zipCode),
    neighborhood: text(address?.neighborhood),
  };
}

function normalizeOfficialLot(lot: OfficialLot): OfficialLot {
  return {
    ...lot,
    price: toNumber(lot.price),
    feePercentage: toNumber(lot.feePercentage),
    quantityTotal: toNumber(lot.quantityTotal),
    quantitySold: toNumber(lot.quantitySold),
    minPurchase: toNumber(lot.minPurchase),
    maxPurchase: toNumber(lot.maxPurchase),
  };
}

function normalizeCategory(cat: OfficialCategory): OfficialCategory {
  return {
    ...cat,
    lots: (cat.lots ?? []).map(normalizeOfficialLot),
  };
}

function normalizeMarketLot(lot: MarketLot): MarketLot {
  return { ...lot, price: toNumber(lot.price) };
}

function normalizeEventDetail(raw: EventDetailResponse): EventDetailResponse {
  const event = raw?.event;

  return {
    event: {
      ...event,
      id: text(event?.id),
      slug: text(event?.slug),
      title: text(event?.title),
      description: text(event?.description),
      image_url: text(event?.image_url),
      instagram: text(event?.instagram),
      date: text(event?.date),
      locationName: text(event?.locationName),
      address: normalizeAddress(event?.address),
      policies: {
        minAge: text(event?.policies?.minAge),
        requiredDocs: Array.isArray(event?.policies?.requiredDocs)
          ? event.policies.requiredDocs.filter((doc) => typeof doc === "string")
          : [],
        refundPolicy: text(event?.policies?.refundPolicy),
      },
      platformFee: {
        percentage: toNumber(event?.platformFee?.percentage),
        fixed: toNumber(event?.platformFee?.fixed),
      },
      organizer: {
        name: text(event?.organizer?.name),
        slug: text(event?.organizer?.slug),
        logoUrl: text(event?.organizer?.logoUrl),
      },
    },
    categories: (raw?.categories ?? []).map(normalizeCategory),
    marketLots: (raw?.marketLots ?? []).map(normalizeMarketLot),
  };
}

export const eventsService = {
  getHomeEvents: async (
    lat?: number | null,
    lng?: number | null
  ): Promise<SectionResponse[]> => {
    const endpoint =
      lat && lng ? `/client/home-events?lat=${lat}&lng=${lng}` : "/client/home-events";
    const sections = await apiService.get<SectionResponse[]>(endpoint);
    return normalizeSections(sections);
  },

  getEventDetail: async (slug: string): Promise<EventDetailResponse> => {
    const raw = await apiService.get<EventDetailResponse>(`/client/events/${slug}`);
    return normalizeEventDetail(raw);
  },
};