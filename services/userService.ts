import { apiService } from "./apiService";

export interface UserProfile {
  id:                  string;
  fullName:            string;
  email:               string;
  cpf:                 string;
  phone:               string;
  instagram:           string;
  avatarUrl:           string;
  birthDate:           string;
  attendedEventsCount: number;
  pixKey:              string;
  pixKeyType:          string;
}

export interface UpdateProfilePayload {
  fullName:  string;
  phone:     string;
  instagram: string;
}

export interface UpdatePixKeyPayload {
  pixKey:     string;
  pixKeyType: string;
}

export const userService = {
  getProfile: (userId: string) =>
    apiService.get<UserProfile>(`/client/users/${userId}`),

  updateProfile: (userId: string, payload: UpdateProfilePayload) =>
    apiService.patch<{ success: boolean }>(`/client/users/${userId}`, payload),

  updatePixKey: (userId: string, payload: UpdatePixKeyPayload) =>
    apiService.patch<{ success: boolean }>(`/client/users/${userId}/pix-key`, payload),

  uploadAvatar: async (userId: string, file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return apiService.post<{ success: boolean; avatarUrl: string }>(
      `/client/users/${userId}/avatar`,
      formData
    );
  },
};