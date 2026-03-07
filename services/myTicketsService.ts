import { apiService } from "./apiService";

// ==========================================
// TIPAGENS
// ==========================================

export interface MyTicketEvent {
  slug: string;
  nome: string;
  data: string;
  hora: string;
  local: string;
  imagemUrl: string;
}

export interface MyTicket {
  id: string
  status: 'ativo' | 'usado' | 'encerrado'
  qrCode: string
  lote: string
  ticketPrice: number       
  allowTransfer: boolean
  isListed:     boolean
  listingPrice: number | null
  currentBatchPrice: number | null
  allowReppyMarket: boolean
  eventId: string
  listingId:    string | null

  evento: MyTicketEvent
}

export interface MyTicketsResponse {
  proximos: MyTicket[];
  passados: MyTicket[];
}

// ==========================================
// SERVICE
// ==========================================

export const myTicketsService = {
  getMyTickets: (): Promise<MyTicketsResponse> =>
    apiService.get<MyTicketsResponse>("/client/my-tickets"),

  downloadTicket: async (ticketId: string): Promise<void> => {
    const response = await apiService.getraw(`/client/my-tickets/${ticketId}/download`)

    if (!response.ok) throw new Error("Erro ao baixar ingresso")

    const blob = await response.blob()
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")

    const disposition = response.headers.get("Content-Disposition") ?? ""
    const match       = disposition.match(/filename="?([^"]+)"?/)

    a.download = match?.[1] ?? `ingresso-${ticketId}.pdf`
    a.href = url
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },
};