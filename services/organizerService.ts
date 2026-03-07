import { apiService } from "./apiService";

// ==========================================
// TIPAGENS
// ==========================================

export interface OrgLink {
  tipo:  string;
  label: string;
  url:   string;
}

export interface OrganizerProfile {
  id:        string;
  name:      string;
  slug:      string;
  logoUrl:   string;
  bannerUrl: string;
  city:      string;
  instagram: string;
  facebook:  string;
  website:   string;
  phone:     string;
  isFollowing?: boolean;
  whatsapp:  string;
  email:     string;
  followers: number;
  links:     OrgLink[];
}

export interface OrgEvent {
  id:        string;
  slug:      string;
  nome:      string;
  data:      string;
  hora:      string;
  local:     string;
  imagemUrl: string;
  status:    "normal" | "encerrado";
}

export interface OrganizerDetailResponse {
  organizer: OrganizerProfile;
  events:    OrgEvent[];
}

// ==========================================
// NORMALIZAÇÃO
// ==========================================

function normalizeOrganizer(raw: OrganizerDetailResponse): OrganizerDetailResponse {
  return {
    ...raw,
    organizer: {
      ...raw.organizer,
      followers: Number(raw.organizer?.followers) || 0,
      links:     raw.organizer?.links ?? [],
    },
    events: raw.events ?? [],
  };
}

// ==========================================
// SERVICE
// ==========================================

export const organizerService = {
  getOrganizerDetail: async (slug: string): Promise<OrganizerDetailResponse> => {
    const raw = await apiService.get<OrganizerDetailResponse>(
      `/client/organizers/${slug}`
    );
    return normalizeOrganizer(raw);
  },

  // O JWT no header já identifica o usuário — não precisa mais passar userId
  follow: (slug: string): Promise<{ following: boolean }> =>
    apiService.post(`/client/organizers/${slug}/follow`),

  unfollow: (slug: string): Promise<{ following: boolean }> =>
    apiService.delete(`/client/organizers/${slug}/follow`),
};