// services/userService.ts
import { apiService } from "./apiService";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  cpf: string;        // formatado: 000.000.000-00
  phone: string;
  instagram: string;
  avatarUrl: string;
  birthDate: string;  // YYYY-MM-DD
  attendedEventsCount: number;
}

export interface UpdateProfilePayload {
  fullName: string;
  phone: string;
  instagram: string;
}

export const userService = {
  getProfile: (userId: string) =>
    apiService.get<UserProfile>(`/client/users/${userId}`),

  updateProfile: (userId: string, payload: UpdateProfilePayload) =>
    apiService.patch<{ success: boolean }>(`/client/users/${userId}`, payload),

  // Rota nova para upload da foto de perfil
  uploadAvatar: async (userId: string, file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    // Dica: o seu apiService.post precisa aceitar FormData sem forçar o cabeçalho 
    // 'Content-Type': 'application/json', pois o navegador define o 'multipart/form-data' 
    // automaticamente com o boundary correto.
    return apiService.post<{ success: boolean; avatarUrl: string }>(
      `/client/users/${userId}/avatar`,
      formData
    );
  },
};