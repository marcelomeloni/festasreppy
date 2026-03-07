import { apiService } from "./apiService";

// ==========================================
// TIPAGENS
// ==========================================

export interface TransferResponse {
  message: string;
}

export interface RefundResponse {
  id: string;
  amount: number;
  status: string;
  message: string;
}

export interface MarketListing {
  id: string;
  price: number;
}

// ==========================================
// SERVICE
// ==========================================

export const ticketService = {

  // Transfere o ingresso para outro usuário via CPF
  transfer: (ticketId: string, cpf: string): Promise<TransferResponse> =>
    apiService.post<TransferResponse>(`/client/tickets/${ticketId}/transfer`, { cpf }),

  // Solicita reembolso do ingresso
  refund: (ticketId: string, reason?: string): Promise<RefundResponse> =>
    apiService.post<RefundResponse>(`/client/tickets/${ticketId}/refund`, { reason }),

  // ── Reppy Market ──────────────────────────────────────────────────────────

  // Cria listagem no Reppy Market
  createListing: (ticketId: string, price: number): Promise<MarketListing> =>
    apiService.post<MarketListing>(`/client/tickets/${ticketId}/market`, { price }),

  // Atualiza o preço da listagem
  updateListing: (listingId: string, price: number): Promise<MarketListing> =>
    apiService.patch<MarketListing>(`/client/market/listings/${listingId}`, { price }),

  // Remove a listagem do Market
  deleteListing: (listingId: string): Promise<{ message: string }> =>
    apiService.delete(`/client/market/listings/${listingId}`),
};