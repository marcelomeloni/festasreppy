'use client'

import { X, Heart, EyeSlash, Eye, LockKey, Info, SpinnerGap, ArrowLeft } from '@phosphor-icons/react'

interface RadarHeaderProps {
  viewMode: 'radar' | 'blocked'
  eventName: string
  radarActive: boolean
  loadingMode: boolean
  togglingMode: boolean
  tapsRecebidos: number
  onToggleMode: () => void
  onSetViewMode: (mode: 'radar' | 'blocked') => void
  onClose: () => void
}

export function RadarHeader({
  viewMode,
  eventName,
  radarActive,
  loadingMode,
  togglingMode,
  tapsRecebidos,
  onToggleMode,
  onSetViewMode,
  onClose,
}: RadarHeaderProps) {
  return (
    <div className="bg-white px-5 pt-4 pb-4 border-b border-[#E0E0D8] shrink-0">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-2">
          {viewMode === 'blocked' && (
            <button
              onClick={() => onSetViewMode('radar')}
              className="w-8 h-8 shrink-0 rounded-full bg-[#F0F0EB] flex items-center justify-center hover:bg-[#E0E0D8] transition-colors"
            >
              <ArrowLeft size={15} weight="bold" color="#5C5C52" />
            </button>
          )}
          <div>
            <h3 className="font-bricolage text-[24px] font-extrabold text-[#0A0A0A] tracking-tighter leading-none">
              {viewMode === 'blocked' ? 'Bloqueados' : 'Reppy Crush'}
            </h3>
            <p className="font-body text-[13px] text-[#9A9A8F] mt-1 font-medium">
              {viewMode === 'blocked' ? 'Gerencie quem você bloqueou' : `Confirmados no ${eventName}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'radar' && (
            <button
              onClick={() => onSetViewMode('blocked')}
              className="w-8 h-8 shrink-0 rounded-full bg-[#F0F0EB] flex items-center justify-center hover:bg-[#E0E0D8] transition-colors"
              title="Ver usuários bloqueados"
            >
              <LockKey size={15} weight="bold" color="#5C5C52" />
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 shrink-0 rounded-full bg-[#F0F0EB] flex items-center justify-center hover:bg-[#E0E0D8] transition-colors"
          >
            <X size={15} weight="bold" color="#5C5C52" />
          </button>
        </div>
      </div>

      {viewMode === 'radar' && (
        <>
          {/* O Indicador de Recompensa Acumulada */}
          {tapsRecebidos > 0 && (
            <div className="bg-dopamine-pink/10 border border-dopamine-pink/20 rounded-full px-3 py-1.5 flex items-center gap-2 inline-flex mb-5 animate-in slide-in-from-left-2 fade-in">
              <Heart size={14} weight="fill" className="text-dopamine-pink-vibrant animate-heart-pulse" />
              <span className="font-body text-[12px] font-bold text-dopamine-pink-vibrant">
                {tapsRecebidos} match{tapsRecebidos > 1 ? 'es' : ''} mútuo{tapsRecebidos > 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* O Switch de Visibilidade (Mantemos a lógica de verde para "On/Ativo" por clareza de UI) */}
          <div
            className={`p-4 rounded-[16px] flex items-center justify-between transition-colors border-2 cursor-pointer
              ${radarActive ? 'bg-white border-[#1BFF11] shadow-[0_4px_20px_-10px_rgba(27,255,17,0.3)]' : 'bg-[#F0F0EB] border-transparent'}
              ${togglingMode ? 'opacity-60 pointer-events-none' : ''}`}
            onClick={onToggleMode}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300
                ${radarActive ? 'bg-[#1BFF11] text-[#0A0A0A] shadow-inner' : 'bg-[#E0E0D8] text-[#9A9A8F]'}`}>
                {loadingMode
                  ? <SpinnerGap size={20} weight="bold" className="animate-spin" />
                  : radarActive
                    ? <Eye size={20} weight="bold" />
                    : <EyeSlash size={20} weight="bold" />
                }
              </div>
              <div className="flex flex-col">
                <span className="font-bricolage text-[16px] font-extrabold text-[#0A0A0A] leading-tight">
                  Modo Crush
                </span>
                <span className={`font-body text-[13px] font-medium mt-0.5 transition-colors ${radarActive ? 'text-[#0FD40A]' : 'text-[#9A9A8F]'}`}>
                  {loadingMode ? 'Carregando...' : radarActive ? 'Ativado — você aparece para os outros' : 'Desativado — você é invisível'}
                </span>
              </div>
            </div>
            
            {/* Toggle visual refinado */}
            <div className={`w-12 h-6 rounded-full p-1 transition-all duration-300 flex shrink-0 ${radarActive ? 'bg-[#1BFF11] justify-end shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]' : 'bg-[#E0E0D8] justify-start shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]'}`}>
              <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>

          <div className="mt-3 bg-[#F7F7F2] border border-[#E0E0D8] rounded-[16px] p-3.5 flex gap-3 items-start">
            <Info size={18} weight="fill" className="text-[#9A9A8F] shrink-0 mt-0.5" />
            <p className="font-body text-[12px] text-[#5C5C52] leading-relaxed">
              O curtir é 100% secreto. Vocês só descobrem se houver match mútuo!
            </p>
          </div>
        </>
      )}
    </div>
  )
}