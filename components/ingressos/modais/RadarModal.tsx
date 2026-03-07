'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Lightning, InstagramLogo, EyeSlash, Eye, LockKey, Info, SpinnerGap } from '@phosphor-icons/react'
import { radarService, type RadarProfile } from '@/services/radarService'
import { MyTicket } from '@/services/myTicketsService'

interface RadarModalProps {
  ingresso: MyTicket
  onClose: () => void
}

export default function RadarModal({ ingresso, onClose }: RadarModalProps) {
 const eventId = ingresso.eventId

  const [radarActive, setRadarActive]   = useState(false)
  const [profiles, setProfiles]         = useState<RadarProfile[]>([])
  const [loadingMode, setLoadingMode]   = useState(true)
  const [loadingList, setLoadingList]   = useState(true)
  const [togglingMode, setTogglingMode] = useState(false)
  const [tappingId, setTappingId]       = useState<string | null>(null)
  const [matchName, setMatchName]       = useState<string | null>(null) // nome para toast de match

  // ── Carrega estado inicial do radar e lista de perfis ──
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

  // ── Toggle Modo Radar ──
  const handleToggleMode = useCallback(async () => {
    if (togglingMode) return
    const next = !radarActive
    setRadarActive(next) // optimistic
    setTogglingMode(true)
    try {
      const res = await radarService.setMode(eventId, next)
      setRadarActive(res.radarEnabled)
    } catch (err) {
      console.error('RadarModal toggleMode:', err)
      setRadarActive(!next) // rollback
    } finally {
      setTogglingMode(false)
    }
  }, [eventId, radarActive, togglingMode])

  // ── Tap ──
  const handleTap = useCallback(async (profile: RadarProfile) => {
    if (!radarActive || tappingId) return
    setTappingId(profile.userId)

    // Optimistic update
    setProfiles(prev =>
      prev.map(p =>
        p.userId === profile.userId
          ? { ...p, tappedByMe: !p.tappedByMe, isMutual: false }
          : p
      )
    )

    try {
      if (profile.tappedByMe) {
        await radarService.removeTap(eventId, profile.userId)
        setProfiles(prev =>
          prev.map(p =>
            p.userId === profile.userId
              ? { ...p, tappedByMe: false, isMutual: false }
              : p
          )
        )
      } else {
        const { isMutual } = await radarService.tap(eventId, profile.userId)
        setProfiles(prev =>
          prev.map(p =>
            p.userId === profile.userId
              ? { ...p, tappedByMe: true, isMutual }
              : p
          )
        )
        if (isMutual) {
          setMatchName(profile.name)
          setTimeout(() => setMatchName(null), 4000)
        }
      }
    } catch (err) {
      console.error('RadarModal tap:', err)
      // Rollback
      setProfiles(prev =>
        prev.map(p =>
          p.userId === profile.userId ? profile : p
        )
      )
    } finally {
      setTappingId(null)
    }
  }, [eventId, radarActive, tappingId])

  // ── Bloquear ──
  const handleBlock = useCallback(async (userId: string) => {
    try {
      await radarService.block(userId)
      setProfiles(prev => prev.filter(p => p.userId !== userId))
    } catch (err) {
      console.error('RadarModal block:', err)
    }
  }, [])

  const tapsRecebidos = profiles.filter(p => p.isMutual).length

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#F7F7F2] rounded-[24px] w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Toast de Match ── */}
        {matchName && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#0A0A0A] text-white font-body text-[13px] font-bold py-2.5 px-5 rounded-full shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Lightning size={16} weight="fill" className="text-[#1BFF11]" />
            Você e {matchName} vão se encontrar.
          </div>
        )}

        {/* ── Header Fixo ── */}
        <div className="bg-white p-6 border-b border-[#E0E0D8] shrink-0">
          <div className="flex items-center justify-between w-full mb-4">
            <div>
              <h3 className="font-bricolage text-[24px] font-extrabold text-[#0A0A0A] tracking-tighter leading-none">
                Reppy Radar
              </h3>
              <p className="font-body text-[13px] text-[#9A9A8F] mt-1 font-medium">
                Confirmados no {ingresso.evento.nome}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 shrink-0 rounded-full bg-[#F0F0EB] flex items-center justify-center hover:bg-[#E0E0D8] transition-colors"
            >
              <X size={15} weight="bold" color="#5C5C52" />
            </button>
          </div>

          {/* Taps mútuos */}
          {tapsRecebidos > 0 && (
            <div className="bg-[#1BFF11]/10 border border-[#1BFF11]/20 rounded-full px-3 py-1.5 flex items-center gap-2 inline-flex mb-5">
              <Lightning size={14} weight="fill" className="text-[#0FD40A]" />
              <span className="font-body text-[12px] font-bold text-[#0A0A0A]">
                {tapsRecebidos} match{tapsRecebidos > 1 ? 'es' : ''} mútuo{tapsRecebidos > 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Toggle Modo Radar */}
          <div
            className={`p-4 rounded-[16px] flex items-center justify-between transition-colors border-2 cursor-pointer
              ${radarActive ? 'bg-white border-[#1BFF11] shadow-sm' : 'bg-[#F0F0EB] border-transparent'}
              ${togglingMode ? 'opacity-60 pointer-events-none' : ''}`}
            onClick={handleToggleMode}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors
                ${radarActive ? 'bg-[#1BFF11] text-[#0A0A0A]' : 'bg-[#E0E0D8] text-[#9A9A8F]'}`}>
                {loadingMode
                  ? <SpinnerGap size={20} weight="bold" className="animate-spin" />
                  : radarActive
                    ? <Eye size={20} weight="bold" />
                    : <EyeSlash size={20} weight="bold" />
                }
              </div>
              <div className="flex flex-col">
                <span className="font-bricolage text-[16px] font-extrabold text-[#0A0A0A] leading-tight">
                  Modo Radar
                </span>
                <span className={`font-body text-[13px] font-medium mt-0.5 ${radarActive ? 'text-[#0FD40A]' : 'text-[#9A9A8F]'}`}>
                  {loadingMode ? 'Carregando...' : radarActive ? 'Ativado — você aparece para os outros' : 'Desativado — você é invisível'}
                </span>
              </div>
            </div>

            <div className={`w-12 h-6 rounded-full p-1 transition-colors flex shrink-0 ${radarActive ? 'bg-[#1BFF11] justify-end' : 'bg-[#E0E0D8] justify-start'}`}>
              <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>

          {/* Info */}
          <div className="mt-3 bg-[#F7F7F2] border border-[#E0E0D8] rounded-[16px] p-3.5 flex gap-3 items-start">
            <Info size={18} weight="fill" className="text-[#9A9A8F] shrink-0 mt-0.5" />
            <p className="font-body text-[12px] text-[#5C5C52] leading-relaxed">
              O tap é 100% secreto. Vocês só descobrem se houver tap mútuo!
            </p>
          </div>
        </div>

        {/* ── Grade de Perfis ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 relative">

          {!radarActive && !loadingList && (
            <div className="absolute top-10 left-0 right-0 z-10 flex justify-center pointer-events-none">
              <div className="bg-[#0A0A0A]/90 backdrop-blur-sm text-white font-body text-[13px] font-bold py-2 px-4 rounded-full shadow-lg border border-white/10 flex items-center gap-2">
                <EyeSlash size={16} weight="bold" />
                Ative o Modo Radar para interagir
              </div>
            </div>
          )}

          {loadingList ? (
            <div className="flex items-center justify-center py-16">
              <SpinnerGap size={32} weight="bold" className="animate-spin text-[#9A9A8F]" />
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-[40px]">👀</span>
              <p className="font-bricolage text-[18px] font-extrabold text-[#0A0A0A] mt-4 mb-1">
                Ninguém no radar ainda.
              </p>
              <p className="font-body text-sm text-[#9A9A8F]">
                Quando rolar, aparece aqui.
              </p>
            </div>
          ) : (
            <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 transition-opacity duration-300 ${!radarActive ? 'opacity-40 grayscale-[50%]' : ''}`}>
              {profiles.map(profile => {
                const isTapping = tappingId === profile.userId

                return (
                  <div key={profile.userId} className="relative aspect-[4/5] rounded-[16px] overflow-hidden group bg-black">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#111] flex items-center justify-center text-[40px]">
                        👤
                      </div>
                    )}

                    {profile.isMutual && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="font-bricolage text-[10px] font-extrabold uppercase tracking-wide px-2 py-1 rounded-full bg-[#1BFF11] text-[#0A0A0A] shadow-md">
                          Match
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    <div className="absolute bottom-0 left-0 w-full p-3 flex flex-col">
                      <span className="font-bricolage text-[16px] font-extrabold text-white leading-tight">
                        {profile.name}
                      </span>
                      {profile.instagram && (
                        <div className="flex items-center gap-1 mt-0.5 opacity-80">
                          <InstagramLogo size={12} weight="fill" className="text-white" />
                          <span className="font-body text-[10px] text-white font-medium">{profile.instagram}</span>
                        </div>
                      )}
                    </div>

                    {/* Tap button */}
                    <button
                      onClick={e => { e.stopPropagation(); handleTap(profile) }}
                      disabled={!radarActive || isTapping}
                      className={`absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all
                        ${!radarActive
                          ? 'bg-black/60 text-white/50 cursor-not-allowed border border-white/10'
                          : profile.tappedByMe
                            ? 'bg-[#1BFF11] text-[#0A0A0A] scale-110 shadow-[0_0_15px_rgba(27,255,17,0.5)]'
                            : 'bg-black/30 text-white border border-white/20 hover:bg-black/50 cursor-pointer'
                        }`}
                    >
                      {!radarActive ? (
                        <LockKey size={14} weight="fill" />
                      ) : isTapping ? (
                        <SpinnerGap size={14} weight="bold" className="animate-spin" />
                      ) : (
                        <Lightning size={16} weight={profile.tappedByMe ? 'fill' : 'bold'} />
                      )}
                    </button>

                    {/* Bloquear — aparece no hover */}
                    {radarActive && (
                      <button
                        onClick={e => { e.stopPropagation(); handleBlock(profile.userId) }}
                        className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/50 border border-white/10 text-white/50 hover:text-white hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        title="Bloquear"
                      >
                        <LockKey size={12} weight="fill" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {!loadingList && profiles.length > 0 && (
            <p className="text-center font-body text-[12px] text-[#9A9A8F] mt-6 mb-2">
              Mostrando todos os confirmados públicos.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}