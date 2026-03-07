import { apiService } from "./apiService";

// ==========================================
// TIPAGENS DA HOME
// ==========================================
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

// ==========================================
// TIPAGENS DOS DETALHES DO EVENTO
// ==========================================
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
  time: string;
  locationName: string;
  address: EventAddress;
  policies: EventPolicies;
  platformFee: PlatformFee;
  organizer: OrganizerData;
}

export interface OfficialLot {
  id:                 string;
  title:              string;
  subtitle:           string;
  price:              number;
  feePayer:           "buyer" | "organizer";
  feePercentage:      number;  // decimal por lote, calculado no backend (ex: 0.07 = 7%)
  available:          boolean;
  unavailableReason?: "sold_out" | "expired" | "not_started" | "";
}

export interface MarketLot {
  id: string;
  title: string;
  subtitle: string;
  price: number;
}

export interface EventDetailResponse {
  event: EventData;
  officialLots: OfficialLot[];
  marketLots: MarketLot[];
}

// ==========================================
// NORMALIZAÇÃO
// ==========================================
function n(v: unknown): number {
  const parsed = Number(v);
  return isFinite(parsed) ? parsed : 0;
}

function normalizeOfficialLot(lot: OfficialLot): OfficialLot {
  return {
    ...lot,
    price:         n(lot.price),
    feePercentage: n(lot.feePercentage),
  };
}

function normalizeMarketLot(lot: MarketLot): MarketLot {
  return { ...lot, price: n(lot.price) };
}

function normalizeEventDetail(raw: EventDetailResponse): EventDetailResponse {
  return {
    ...raw,
    event: {
      ...raw.event,
      platformFee: {
        percentage: n(raw.event?.platformFee?.percentage),
        fixed:      n(raw.event?.platformFee?.fixed),
      },
    },
    officialLots: (raw.officialLots ?? []).map(normalizeOfficialLot),
    marketLots:   (raw.marketLots   ?? []).map(normalizeMarketLot),
  };
}

// ==========================================
// SERVICE
// ==========================================
export const eventsService = {
  getHomeEvents: async (
    lat?: number | null,
    lng?: number | null
  ): Promise<SectionResponse[]> => {
    let endpoint = "/client/home-events";
    if (lat && lng) endpoint += `?lat=${lat}&lng=${lng}`;
    return apiService.get<SectionResponse[]>(endpoint);
  },

  getEventDetail: async (slug: string): Promise<EventDetailResponse> => {
    const raw = await apiService.get<EventDetailResponse>(`/client/events/${slug}`);
    return normalizeEventDetail(raw);
  },
};