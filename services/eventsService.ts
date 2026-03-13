import { apiService } from "./apiService";

export interface EventCard {
  id: string;
  title: string;
  slug: string;
  venue: string;
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
  unavailableReason?: "sold_out" | "expired" | "not_started" | "";
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

function normalizeOfficialLot(lot: OfficialLot): OfficialLot {
  return {
    ...lot,
    price: toNumber(lot.price),
    feePercentage: toNumber(lot.feePercentage),
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
  return {
    ...raw,
    event: {
      ...raw.event,
      platformFee: {
        percentage: toNumber(raw.event?.platformFee?.percentage),
        fixed: toNumber(raw.event?.platformFee?.fixed),
      },
    },
    categories: (raw.categories ?? []).map(normalizeCategory),
    marketLots: (raw.marketLots ?? []).map(normalizeMarketLot),
  };
}

export const eventsService = {
  getHomeEvents: async (
    lat?: number | null,
    lng?: number | null
  ): Promise<SectionResponse[]> => {
    const endpoint =
      lat && lng ? `/client/home-events?lat=${lat}&lng=${lng}` : "/client/home-events";
    return apiService.get<SectionResponse[]>(endpoint);
  },

  getEventDetail: async (slug: string): Promise<EventDetailResponse> => {
    const raw = await apiService.get<EventDetailResponse>(`/client/events/${slug}`);
    return normalizeEventDetail(raw);
  },
};