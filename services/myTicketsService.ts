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
  evento:            MyTicketEvent;
}

export interface MyTicketsResponse {
  proximos: MyTicket[];
  passados: MyTicket[];
}

export const myTicketsService = {
  getMyTickets: (): Promise<MyTicketsResponse> =>
    apiService.get<MyTicketsResponse>("/client/my-tickets"),

  fetchTicketHTML: (ticketId: string): Promise<Response> =>
    apiService.getraw(`/client/my-tickets/${ticketId}/download`),
};