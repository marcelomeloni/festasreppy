import { apiService } from "./apiService";

export interface MyTicketEvent {
  slug: string;
  nome: string;
  data: string;
  hora: string;
  local: string;
  imagemUrl: string;
}

export interface MyTicket {
  id: string;
  status: "ativo" | "usado" | "encerrado";
  qrCode: string;
  lote: string;
  ticketPrice: number;
  allowTransfer: boolean;
  isListed: boolean;
  listingPrice: number | null;
  currentBatchPrice: number | null;
  allowReppyMarket: boolean;
  eventId: string;
  listingId: string | null;
  evento: MyTicketEvent;
}

export interface MyTicketsResponse {
  proximos: MyTicket[];
  passados: MyTicket[];
}

export const myTicketsService = {
  getMyTickets: (): Promise<MyTicketsResponse> =>
    apiService.get<MyTicketsResponse>("/client/my-tickets"),

  // Retorna o Response bruto para o chamador decidir o que fazer
  // (share nativo no mobile, nova aba no desktop)
  fetchTicketHTML: (ticketId: string): Promise<Response> =>
    apiService.getraw(`/client/my-tickets/${ticketId}/download`),
};