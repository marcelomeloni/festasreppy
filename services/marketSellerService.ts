import { apiService } from "./apiService";

export interface SalesSummary {
  totalWithdrawable: number;
  totalPending: number;
  totalReleased: number;
}

export interface MySaleItem {
  transactionId: string;
  eventTitle:    string;
  eventDate:     string;
  lotTitle:      string;
  amount:        number;
  platformFee:   number;
  netAmount:     number;
  escrowStatus:  "pending" | "held" | "withdraw_requested" | "released" | "cancelled" | "refunded";
  canWithdraw:   boolean;
  withdrawBlock: string;
  heldAt:        string;
  withdrawRequestId?: string;
}

export interface MySalesResponse {
  summary: SalesSummary;
  sales: MySaleItem[];
}

export interface WithdrawResponse {
  success:           boolean;
  requestId:         string;
  status:            "pending";
  requestedAmount:   number;
  transactionsCount: number;
  pixKey:            string;
}

export const marketSellerService = {
  getMySales: (): Promise<MySalesResponse> =>
    apiService.get<MySalesResponse>("/client/market/my-sales"),

  withdraw: (): Promise<WithdrawResponse> =>
    apiService.post<WithdrawResponse>("/client/market/withdraw"),
};