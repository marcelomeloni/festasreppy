'use client'

import { useState, useEffect, useCallback } from 'react'
import { radarService, type RadarProfile, type BlockedUser } from '@/services/radarService'
import { MyTicket } from '@/services/myTicketsService'

import { MatchToast }       from './radar/MatchToast'
import { RadarHeader }      from './radar/RadarHeader'
import { RadarProfileGrid } from './radar/RadarProfileGrid'
import { BlockedUsersList } from './radar/BlockedUsersList'

interface RadarModalProps {
  ingresso: MyTicket
  onClose:  () => void
}

type ViewMode = 'radar' | 'blocked'

export default function RadarModal({ ingresso, onClose }: RadarModalProps) {
  const eventId = ingresso.eventId

  const [viewMode, setViewMode]             = useState<ViewMode>('radar')
  const [radarActive, setRadarActive]       = useState(false)
  const [profiles, setProfiles]             = useState<RadarProfile[]>([])
  const [blockedUsers, setBlockedUsers]     = useState<BlockedUser[]>([])
  const [loadingMode, setLoadingMode]       = useState(true)
  const [loadingList, setLoadingList]       = useState(true)
  const [loadingBlocked, setLoadingBlocked] = useState(false)
  const [togglingMode, setTogglingMode]     = useState(false)
  const [tappingId, setTappingId]           = useState<string | null>(null)
  const [unblockingId, setUnblockingId]     = useState<string | null>(null)
  const [matchName, setMatchName]           = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [modeRes, listRes] = await Promise.all([
          radarService.getMode(eventId),
          radarService.getProfiles(eventId),
        ])
        if (cancelled) return
        setRadarActive(modeRes.radarEnabled)
        setProfiles(listRes.profiles)
      } catch (err) {
        console.error('RadarModal load:', err)
      } finally {
        if (!cancelled) {
          setLoadingMode(false)
          setLoadingList(false)
        }
      }
    }
    load()
    return () => { cancelled = true }
  }, [eventId])

  const fetchBlockedUsers = useCallback(async () => {
    setLoadingBlocked(true)
    try {
      const res = await radarService.getBlockedUsers()
      setBlockedUsers(res.users)
    } catch (err) {
      console.error('RadarModal fetchBlockedUsers:', err)
    } finally {
      setLoadingBlocked(false)
    }
  }, [])

  const handleSetViewMode = useCallback((mode: ViewMode) => {
    setViewMode(mode)
    if (mode === 'blocked') fetchBlockedUsers()
  }, [fetchBlockedUsers])

  const handleToggleMode = useCallback(async () => {
    if (togglingMode) return
    const next = !radarActive
    setRadarActive(next)
    setTogglingMode(true)
    try {
      const res = await radarService.setMode(eventId, next)
      setRadarActive(res.radarEnabled)
    } catch (err) {
      console.error('RadarModal toggleMode:', err)
      setRadarActive(!next)
    } finally {
      setTogglingMode(false)
    }
  }, [eventId, radarActive, togglingMode])

  const handleTap = useCallback(async (profile: RadarProfile) => {
    if (!radarActive || tappingId) return
    setTappingId(profile.userId)
    setProfiles(prev =>
      prev.map(p => p.userId === profile.userId ? { ...p, tappedByMe: !p.tappedByMe, isMutual: false } : p)
    )
    try {
      if (profile.tappedByMe) {
        await radarService.removeTap(eventId, profile.userId)
        setProfiles(prev =>
          prev.map(p => p.userId === profile.userId ? { ...p, tappedByMe: false, isMutual: false } : p)
        )
      } else {
        const { isMutual } = await radarService.tap(eventId, profile.userId)
        setProfiles(prev =>
          prev.map(p => p.userId === profile.userId ? { ...p, tappedByMe: true, isMutual } : p)
        )
        if (isMutual) {
          setMatchName(profile.name)
          setTimeout(() => setMatchName(null), 4000)
        }
      }
    } catch (err) {
      console.error('RadarModal tap:', err)
      setProfiles(prev => prev.map(p => p.userId === profile.userId ? profile : p))
    } finally {
      setTappingId(null)
    }
  }, [eventId, radarActive, tappingId])

  const handleBlock = useCallback(async (userId: string) => {
    try {
      await radarService.block(userId)
      setProfiles(prev => prev.filter(p => p.userId !== userId))
    } catch (err) {
      console.error('RadarModal block:', err)
    }
  }, [])

  const handleUnblock = useCallback(async (userId: string) => {
    if (unblockingId) return
    setUnblockingId(userId)
    try {
      await radarService.unblock(userId)
      setBlockedUsers(prev => prev.filter(u => u.userId !== userId))
      const listRes = await radarService.getProfiles(eventId)
      setProfiles(listRes.profiles)
    } catch (err) {
      console.error('RadarModal unblock:', err)
    } finally {
      setUnblockingId(null)
    }
  }, [eventId, unblockingId])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      <div
        className="
          bg-[#F7F7F2] flex flex-col overflow-hidden shadow-2xl
          w-full h-[96dvh] rounded-t-[24px]
          sm:rounded-[24px] sm:w-full sm:max-w-md sm:h-auto sm:max-h-[85vh]
          sm:animate-in sm:slide-in-from-bottom-0 sm:zoom-in-95
        "
        onClick={e => e.stopPropagation()}
      >
        {matchName && <MatchToast name={matchName} />}

        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#E0E0D8]" />
        </div>

        <RadarHeader
          viewMode={viewMode}
          eventName={ingresso.evento.nome}
          radarActive={radarActive}
          loadingMode={loadingMode}
          togglingMode={togglingMode}
          tapsRecebidos={profiles.filter(p => p.isMutual).length}
          onToggleMode={handleToggleMode}
          onSetViewMode={handleSetViewMode}
          onClose={onClose}
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 relative">
          {viewMode === 'radar' && (
            <RadarProfileGrid
              profiles={profiles}
              radarActive={radarActive}
              loadingList={loadingList}
              tappingId={tappingId}
              onTap={handleTap}
              onBlock={handleBlock}
            />
          )}

          {viewMode === 'blocked' && (
            <BlockedUsersList
              users={blockedUsers}
              loading={loadingBlocked}
              unblockingId={unblockingId}
              onUnblock={handleUnblock}
            />
          )}
        </div>
      </div>
    </div>
  )
}