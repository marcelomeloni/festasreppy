import { apiService } from "./apiService";

export interface MyTicketEvent {
  slug:      string;
  nome:      string;
  data:      string;
  hora:      string;
  local:     string;
  imagemUrl: string;
}

export interface MyTicket {
  id:                string;
  eventId:           string;
  status:            "ativo" | "usado" | "encerrado";
  qrCode:            string;
  lote:              string;
  ticketPrice:       number;
  allowTransfer:     boolean;
  allowReppyMarket:  boolean;
  currentBatchPrice: number | null;
  isListed:          boolean;
  listingId:         string | null;
  listingPrice:      number | null;
  daysUntil:         number | null;
  eventStatus:       string;
  orderId:           string;
  orderTotal:        number;
  refundStatus:      string | null;
  evento:            MyTicketEvent;
}

export interface MyTicketsResponse {
  proximos: MyTicket[];
  passados: MyTicket[];
}

export const myTicketsService = {
  getMyTickets: (): Promise<MyTicketsResponse> =>
    apiService.get<MyTicketsResponse>("/client/my-tickets"),

  fetchTicketQRCode: (ticketId: string): Promise<string> =>
    apiService
      .get<{ qrCodeBase64: string }>(`/client/my-tickets/${ticketId}/qr`)
      .then(res => res.qrCodeBase64),

  fetchTicketHTML: (ticketId: string): Promise<Response> =>
    apiService.getraw(`/client/my-tickets/${ticketId}/download`),
};