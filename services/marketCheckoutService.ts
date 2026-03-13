import { apiService } from "./apiService";

export interface MarketCartPayload {
  listingId:    string;
  eventSlug:    string;
  eventTitle:   string;
  eventDate:    string;
  eventVenue:   string;
  lotTitle:     string;
  categoryName: string;
  sellerPrice:  number;
  platformFee:  number;
  total:        number;
}

export interface MarketCheckoutRequest {
  listingId:  string;
  buyerName:  string;
  buyerEmail: string;
  buyerCPF:   string;
}

export interface MarketCheckoutResponse {
  transactionId:      string;
  pixCode:            string;
  pixQrCode?:         string;
  totalAmount:        number;
  isGuest?:           boolean;
  confirmationEmail?: string;
}

export interface MarketPixStatusResponse {
  transactionId: string;
  status: "PENDING" | "PAID" | "EXPIRED" | "CANCELLED";
}

export const MARKET_PLATFORM_FEE = 0.80;

export function encodeMarketCart(cart: MarketCartPayload): string {
  return btoa(encodeURIComponent(JSON.stringify(cart)));
}

export function decodeMarketCart(encoded: string): MarketCartPayload | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
}

export const marketCheckoutService = {
  createTransaction: (payload: MarketCheckoutRequest): Promise<MarketCheckoutResponse> =>
    apiService.post<MarketCheckoutResponse>("/client/checkout/market", payload),

  checkPixStatus: (transactionId: string): Promise<MarketPixStatusResponse> =>
    apiService.get<MarketPixStatusResponse>(
      `/client/checkout/market/${transactionId}/pix/status`
    ),
};