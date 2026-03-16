'use client'

import { type FC, useState } from 'react'
import { Heart, InstagramLogo, EyeSlash, LockKey, SpinnerGap } from '@phosphor-icons/react'
import { type RadarProfile } from '@/services/radarService'

interface RadarProfileGridProps {
  profiles: RadarProfile[]
  radarActive: boolean
  loadingList: boolean
  tappingId: string | null
  onTap: (profile: RadarProfile) => void
  onBlock: (userId: string) => void
}

export const RadarProfileGrid: FC<RadarProfileGridProps> = ({
  profiles,
  radarActive,
  loadingList,
  tappingId,
  onTap,
  onBlock,
}) => {
  // Estado local para rastrear quais matches já tiveram a celebração "Takeover"
  // Isso impede que a tela inteira pule toda vez que o componente re-renderizar
  const [celebratedMatches, setCelebratedMatches] = useState<Set<string>>(new Set())

  const handleDismissCelebration = (userId: string) => {
    setCelebratedMatches(prev => {
      const next = new Set(prev)
      next.add(userId)
      return next
    })
  }

  if (loadingList) {
    return (
      <div className="flex items-center justify-center py-16">
        <SpinnerGap size={32} weight="bold" className="animate-spin text-gray-400" />
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-[40px]">👀</span>
        <p className="font-bricolage text-[18px] font-extrabold text-black mt-4 mb-1">
          Ninguém no Crush ainda.
        </p>
        <p className="font-body text-sm text-gray-400">Quando rolar, aparece aqui.</p>
      </div>
    )
  }

  return (
    <>
      {!radarActive && (
        <div className="absolute top-10 left-0 right-0 z-20 flex justify-center pointer-events-none">
          <div className="bg-black/90 backdrop-blur-sm text-white font-body text-[13px] font-bold py-2 px-4 rounded-full shadow-lg border border-white/10 flex items-center gap-2">
            <EyeSlash size={16} weight="bold" />
            Ative o Modo Crush para interagir
          </div>
        </div>
      )}

      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5 p-2 transition-opacity duration-300 ${!radarActive ? 'opacity-40 grayscale-[50%]' : ''}`}>
        {profiles.map(profile => {
          const isTapping = tappingId === profile.userId
          const isMatch = radarActive && profile.isMutual
          
          // O gatilho do Jackpot: É match e ainda não foi celebrado nesta sessão?
          const isCelebrating = isMatch && !celebratedMatches.has(profile.userId)

          return (
            <div key={profile.userId}>
              
              {/* === TELA CHEIA: O TAKEOVER DOPAMINÉRGICO === */}
              {isCelebrating && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 backdrop-blur-xl animate-in fade-in duration-500">
                  
                  {/* Tipografia de Impacto */}
                  <h2 className="font-display text-[56px] text-center font-black uppercase tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-b from-white to-dopamine-pink-vibrant animate-stamp-in drop-shadow-[0_0_20px_rgba(255,0,127,0.6)] mb-8 leading-none">
                    Deu<br/>Match!
                  </h2>

                  {/* O Card do Match em Destaque (Zoom) */}
                  <div className="relative w-[260px] aspect-[4/5] rounded-[24px] overflow-hidden shadow-[0_0_80px_rgba(255,0,127,0.5)] transition-transform duration-700 hover:scale-105 animate-in zoom-in-50 delay-150">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt={profile.name} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#111] flex items-center justify-center text-[80px]">👤</div>
                    )}
                    
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-6 left-0 w-full px-6 flex flex-col items-center text-center">
                      <span className="font-bricolage text-[28px] font-extrabold text-white drop-shadow-lg">{profile.name}</span>
                      {profile.instagram && (
                        <div className="flex items-center gap-1 mt-1 opacity-90">
                          <InstagramLogo size={16} weight="fill" className="text-white" />
                          <span className="font-body text-[14px] text-white font-medium">{profile.instagram}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ação de Resolução para manter o Flow */}
                  <button
                    onClick={() => handleDismissCelebration(profile.userId)}
                    className="mt-12 px-8 py-4 bg-gradient-to-r from-dopamine-pink to-dopamine-pink-vibrant text-white font-bricolage text-[16px] font-extrabold uppercase tracking-wide rounded-full shadow-[0_10px_30px_rgba(255,0,127,0.4)] transition-all hover:scale-110 active:scale-95"
                  >
                    Continuar no Crush
                  </button>
                </div>
              )}

              {/* === CARD NORMAL DA GRADE (Mantém o estado residual de conquista) === */}
              <div
                className={`relative aspect-[4/5] rounded-[16px] group transition-all duration-300 ${isMatch ? 'animate-match-glow shadow-xl' : ''}`}
              >
                <div className="absolute inset-0 z-10 rounded-[16px] overflow-hidden bg-black border border-white/10 flex flex-col">
                  {profile.avatarUrl ? (
                    <img 
                      src={profile.avatarUrl} 
                      alt={profile.name} 
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out 
                        ${isMatch ? 'opacity-80' : 'opacity-90 group-hover:scale-105'}`} 
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#111] flex items-center justify-center text-[40px]">👤</div>
                  )}

                  {/* Carimbo de Memória Visual (Para quando voltar pra grade) */}
                  {isMatch && !isCelebrating && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden">
                      <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
                      <div className="flex items-center justify-center transform rotate(-12deg)">
                        <div className="border-[3px] border-dopamine-pink-vibrant text-dopamine-pink-vibrant px-4 py-1.5 rounded-lg shadow-[0_0_20px_rgba(255,0,127,0.5),inset_0_0_15px_rgba(255,0,127,0.3)] bg-black/40 backdrop-blur-[2px]">
                          <span className="font-display text-[26px] leading-none font-black uppercase tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-white to-dopamine-pink-vibrant drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                            Match
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

                  <div className="absolute bottom-0 left-0 w-full p-3 flex flex-col z-30">
                    <span className="font-bricolage text-[16px] font-extrabold text-white leading-tight drop-shadow-md">
                      {profile.name}
                    </span>
                    {profile.instagram && (
                      <div className="flex items-center gap-1 mt-0.5 opacity-90">
                        <InstagramLogo size={12} weight="fill" className="text-white drop-shadow-sm" />
                        <span className="font-body text-[10px] text-white font-medium drop-shadow-sm">{profile.instagram}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botão de Coração */}
                <button
                  onClick={e => { e.stopPropagation(); onTap(profile) }}
                  disabled={!radarActive || isTapping}
                  className={`absolute top-2 right-2 z-40 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300
                    ${!radarActive
                      ? 'bg-black/60 text-white/50 cursor-not-allowed border border-white/10'
                      : profile.tappedByMe
                        ? 'bg-dopamine-pink text-white scale-110 shadow-[0_0_20px_rgba(255,17,59,0.8)] border border-white/20'
                        : 'bg-black/30 text-white border border-white/20 hover:bg-black/50 cursor-pointer hover:border-white/40 hover:scale-105'
                    }`}
                >
                  {!radarActive ? (
                    <LockKey size={14} weight="fill" />
                  ) : isTapping ? (
                    <SpinnerGap size={14} weight="bold" className="animate-spin" />
                  ) : (
                    <Heart size={16} weight={profile.tappedByMe ? 'fill' : 'bold'} />
                  )}
                </button>
              </div>

            </div>
          )
        })}
      </div>

      <p className="text-center font-body text-[12px] text-gray-400 mt-6 mb-2">
        Mostrando todos os confirmados públicos.
      </p>
    </>
  )
}