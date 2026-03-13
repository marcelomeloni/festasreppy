import { apiService } from "./apiService";
import { OfficialLot, PlatformFee } from "./eventsService";

export interface CartItem {
  lotId:         string;
  lotTitle:      string;
  lotSubtitle:   string;
  price:         number;
  finalPrice:    number;
  feePayer:      "buyer" | "organizer";
  feePercentage: number;
  qty:           number;
}

export interface CartPayload {
  eventId:        string;
  eventSlug:      string;
  eventTitle:     string;
  eventDate:      string;
  eventVenue:     string;
  eventOrganizer: string;
  items:          CartItem[];
  subtotal:       number;
  totalFee:       number;
  grandTotal:     number;
}

export interface CheckoutOrderRequest {
  eventId:     string;
  couponCode?: string;
  buyerName:   string;
  buyerEmail:  string;
  buyerCPF:    string;
  items: {
    lotId: string;
    qty:   number;
  }[];
}

export interface CheckoutOrderResponse {
  orderId:            string;
  paymentMethod:      string;
  pixCode?:           string;
  pixQrCode?:         string;
  isGuest?:           boolean;
  confirmationEmail?: string;
  totalAmount:        number;
}

export interface CouponValidateResponse {
  valid:           boolean;
  discountType?:   "percentage" | "fixed";
  discountValue?:  number;
  discountAmount?: number;
  message?:        string;
}

export interface PixStatusResponse {
  orderID: string;
  status:  "PENDING" | "PAID" | "EXPIRED" | "CANCELLED" | "REFUNDED";
}

export function encodeCart(cart: CartPayload): string {
  return btoa(encodeURIComponent(JSON.stringify(cart)));
}

export function decodeCart(encoded: string): CartPayload | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
}

export function buildCartFromSidebar(
  eventId:           string,
  eventSlug:         string,
  eventTitle:        string,
  eventDate:         string,
  eventVenue:        string,
  eventOrganizer:    string,
  lots:              OfficialLot[],
  qtys:              Record<string, number>,
  fee:               PlatformFee,
  resolveFinalPrice: (lot: OfficialLot) => number
): CartPayload {
  const safeNum = (v: unknown) => {
    const n = Number(v);
    return isFinite(n) ? n : 0;
  };

  const items: CartItem[] = lots
    .filter((l) => (qtys[l.id] || 0) > 0)
    .map((l) => ({
      lotId:         l.id,
      lotTitle:      l.title,
      lotSubtitle:   l.subtitle ?? "",
      price:         safeNum(l.price),
      finalPrice:    resolveFinalPrice(l),
      feePayer:      l.feePayer,
      feePercentage: safeNum(l.feePercentage),
      qty:           qtys[l.id],
    }));

  const subtotal   = items.reduce((s, i) => s + i.price * i.qty, 0);
  const totalFee   = items.reduce((s, i) => {
    if (i.feePayer !== "buyer" || i.price === 0) return s;
    const feePerTicket = i.price * safeNum(i.feePercentage) + safeNum(fee.fixed);
    return s + feePerTicket * i.qty;
  }, 0);
  const grandTotal = items.reduce((s, i) => s + i.finalPrice * i.qty, 0);

  return {
    eventId,
    eventSlug,
    eventTitle,
    eventDate,
    eventVenue,
    eventOrganizer,
    items,
    subtotal,
    totalFee,
    grandTotal,
  };
}

export const checkoutService = {
  createOrder: (payload: CheckoutOrderRequest): Promise<CheckoutOrderResponse> =>
    apiService.post<CheckoutOrderResponse>("/client/checkout/orders", payload),

  validateCoupon: (eventId: string, code: string, subtotal: number): Promise<CouponValidateResponse> =>
    apiService.post<CouponValidateResponse>("/client/checkout/coupon", { eventId, code, subtotal }),

  checkPixStatus: (orderId: string): Promise<PixStatusResponse> =>
    apiService.get<PixStatusResponse>(`/client/checkout/orders/${orderId}/pix/status`),
};