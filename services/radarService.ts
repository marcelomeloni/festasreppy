import { apiService } from "./apiService";

// ──────────────────────────────────────────────
// TIPOS
// ──────────────────────────────────────────────

export interface RadarProfile {
  userId:     string
  name:       string
  avatarUrl:  string
  instagram?: string
  tappedByMe: boolean
  isMutual:   boolean
}

interface RadarModeResponse { radarEnabled: boolean }
interface RadarListResponse { profiles: RadarProfile[] }
interface TapResponse       { isMutual: boolean }
interface RemoveTapResponse { message: string }
interface BlockResponse     { blocked: boolean }

// ──────────────────────────────────────────────
// SERVICE
// ──────────────────────────────────────────────

export const radarService = {

  // MODO RADAR

 getMode(eventId: string) {
  return apiService.get<RadarModeResponse>(`/client/radar/events/${eventId}/mode`)
},
setMode(eventId: string, enabled: boolean) {
  return apiService.patch<RadarModeResponse>(`/client/radar/events/${eventId}/mode`, { enabled })
},
getProfiles(eventId: string) {
  return apiService.get<RadarListResponse>(`/client/radar/events/${eventId}`)
},
tap(eventId: string, targetUserId: string) {
  return apiService.post<TapResponse>(`/client/radar/events/${eventId}/tap/${targetUserId}`)
},
removeTap(eventId: string, targetUserId: string) {
  return apiService.delete<RemoveTapResponse>(`/client/radar/events/${eventId}/tap/${targetUserId}`)
},
block(targetUserId: string) {
  return apiService.post<BlockResponse>(`/client/radar/block/${targetUserId}`)
},
unblock(targetUserId: string) {
  return apiService.delete<BlockResponse>(`/client/radar/block/${targetUserId}`)
},
}