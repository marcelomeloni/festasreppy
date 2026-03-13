import { apiService } from "./apiService";

export interface MySaleItem {
  transactionId: string;
  eventTitle:    string;
  eventDate:     string;
  lotTitle:      string;
  amount:        number;
  platformFee:   number;
  netAmount:     number;
  escrowStatus:  "pending" | "held" | "released" | "cancelled" | "refunded";
  canWithdraw:   boolean;
  withdrawBlock: string;
  heldAt:        string;
}

export interface MySalesResponse {
  sales: MySaleItem[];
}

export interface WithdrawResponse {
  success:   boolean;
  netAmount: number;
  pixKey:    string;
}

export const marketSellerService = {
  getMySales: (): Promise<MySalesResponse> =>
    apiService.get<MySalesResponse>("/client/market/my-sales"),

  withdraw: (transactionId: string): Promise<WithdrawResponse> =>
    apiService.post<WithdrawResponse>(`/client/market/withdraw/${transactionId}`),
};