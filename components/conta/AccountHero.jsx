'use client'

import { useState } from 'react'
import { Camera, Ticket, Lock, CaretRight, CircleNotch } from '@phosphor-icons/react'
import Link from 'next/link'
import AvatarUploadModal from './AvatarUploadModal'
// Importando o service
import { userService } from '@/services/userService'

// Adicionamos a propriedade `colorClasses` para cada rank
const RANKS = [
  { nome: 'Bixo',         min: 1,  max: 4,        publico: false, colorClasses: 'bg-[#F0F0EB] text-[#9A9A8F] border-[#E0E0D8]' },
  { nome: 'Iniciante',    min: 5,  max: 9,        publico: false, colorClasses: 'bg-[#F0F0EB] text-[#9A9A8F] border-[#E0E0D8]' },
  { nome: 'Veterano',     min: 10, max: 17,       publico: true,  colorClasses: 'bg-amber-100 text-amber-700 border-amber-300' }, // Dourado
  { nome: 'Veterano+',    min: 18, max: 29,       publico: true,  colorClasses: 'bg-purple-100 text-purple-700 border-purple-300' }, // Roxo
  { nome: 'Veterano Mor', min: 30, max: Infinity, publico: true,  colorClasses: 'bg-red-100 text-red-700 border-red-300' }, // Vermelho
]

function getRank(roles) {
  return RANKS.find(r => roles >= r.min && roles <= r.max) || RANKS[0]
}

function getNextRank(roles) {
  const idx = RANKS.findIndex(r => roles >= r.min && roles <= r.max)
  return RANKS[idx + 1] || null
}

function getProgress(roles) {
  const rank = getRank(roles)
  const next = getNextRank(roles)
  if (!next) return 100
  const range = rank.max - rank.min + 1
  const done  = roles - rank.min + 1
  return Math.round((done / range) * 100)
}

export default function AccountHero({ usuario }) {
  const roles  = usuario.attendedEventsCount ?? 0
  const rank   = getRank(roles)
  const next   = getNextRank(roles)
  const prog   = getProgress(roles)
  const faltam = next ? next.min - roles : 0

  const [avatarUrl, setAvatarUrl]         = useState(usuario.avatarUrl ?? null)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [isUploading, setIsUploading]     = useState(false)

  async function handleSaveAvatar({ file, previewUrl }) {
    if (!file) return // TODO: Aqui entrará a lógica de exclusão caso previewUrl seja null

    // Optimistic UI: Atualiza a interface imediatamente
    const previousUrl = avatarUrl
    setAvatarUrl(previewUrl)
    setIsUploading(true)

    try {
      // Chama o endpoint através do service importado
      const data = await userService.uploadAvatar(usuario.id, file)
      
      // Atualiza com a URL pública oficial retornada pelo backend
      if (data.success && data.avatarUrl) {
         setAvatarUrl(data.avatarUrl)
      }
    } catch (error) {
      console.error("Erro ao subir avatar:", error)
      alert("Houve um problema ao salvar sua foto de perfil. Tente novamente.")
      // Se falhar, reverte para a foto antiga
      setAvatarUrl(previousUrl)
    } finally {
      setIsUploading(false)
      setShowAvatarModal(false) // Fecha o modal após o processamento (ou erro)
    }
  }

  return (
    <>
      <div className="bg-white rounded-[20px] border-[1.5px] border-[#E0E0D8] p-5 relative overflow-hidden">
        
        {/* Overlay de loading enquanto faz o upload */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
            <CircleNotch size={24} weight="bold" className="text-primary animate-spin" />
          </div>
        )}

        <div className="flex items-center gap-4">

          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-[64px] h-[64px] rounded-full bg-[#F0F0EB] border-[1.5px] border-[#E0E0D8] overflow-hidden flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt={usuario.fullName || usuario.nome} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bricolage text-[24px] font-extrabold text-[#0A0A0A]">
                  {(usuario.fullName || usuario.nome)?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowAvatarModal(true)}
              disabled={isUploading}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0A0A0A] flex items-center justify-center hover:bg-[#1BFF11] transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera size={11} weight="bold" className="text-white group-hover:text-[#0A0A0A] transition-colors" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="font-bricolage text-[20px] font-extrabold text-[#0A0A0A] tracking-tight leading-none mb-0.5 truncate">
              {usuario.fullName || usuario.nome}
            </h2>
            <p className="font-body text-[13px] text-[#9A9A8F] truncate mb-2.5">
              {usuario.email}
            </p>

            {/* Badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 font-body text-[11px] font-bold text-[#0A0A0A] bg-[#1BFF11] px-2.5 py-1 rounded-full">
                <Ticket size={12} weight="fill" />
                {roles} {roles === 1 ? 'rolê' : 'rolês'}
              </span>

              {/* Renderização dinâmica das cores baseada no rank */}
              {rank.publico ? (
                <span className={`inline-flex items-center font-body text-[11px] font-bold border px-2.5 py-1 rounded-full ${rank.colorClasses}`}>
                  {rank.nome}
                </span>
              ) : (
                <span className={`inline-flex items-center gap-1.5 font-body text-[11px] font-semibold border px-2.5 py-1 rounded-full ${rank.colorClasses}`}>
                  <Lock size={11} weight="bold" />
                  {rank.nome}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Meus Ingressos button */}
        <Link
          href="/meus-ingressos"
          className="mt-4 flex items-center justify-between px-4 py-3 bg-[#F0F0EB] hover:bg-[#E8E8E0] border border-[#E0E0D8] hover:border-[#0A0A0A] rounded-[12px] transition-colors no-underline group"
        >
          <div className="flex items-center gap-2.5">
            <Ticket size={16} weight="fill" className="text-[#0A0A0A]" />
            <span className="font-body text-[14px] font-semibold text-[#0A0A0A]">
              Meus ingressos
            </span>
          </div>
          <CaretRight size={15} weight="bold" className="text-[#9A9A8F] group-hover:text-[#0A0A0A] transition-colors" />
        </Link>

        {/* Progress bar */}
        {next && (
          <div className="mt-4 pt-4 border-t border-[#F0F0EB]">
            <div className="flex justify-between items-center mb-2">
              <span className="font-body text-[11px] font-semibold text-[#9A9A8F] uppercase tracking-widest">
                Próximo nível
              </span>
              <span className="font-body text-[11px] font-semibold text-[#9A9A8F]">
                {faltam} rolê{faltam !== 1 ? 's' : ''} pro {next.nome}
              </span>
            </div>
            <div className="h-1.5 bg-[#F0F0EB] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0A0A0A] rounded-full transition-all duration-700"
                style={{ width: `${prog}%` }}
              />
            </div>
          </div>
        )}

        {!next && (
          <div className="mt-4 pt-4 border-t border-[#F0F0EB] flex items-center gap-2">
            <div className="h-1.5 flex-1 bg-[#1BFF11] rounded-full" />
            <span className="font-body text-[11px] font-bold text-[#0A0A0A] uppercase tracking-widest shrink-0">
              Nível máximo
            </span>
          </div>
        )}
      </div>

      {/* Modal — renderizado fora do card, no topo do DOM via fixed */}
      {showAvatarModal && (
        <AvatarUploadModal
          currentUrl={avatarUrl}
          nome={usuario.fullName || usuario.nome}
          onClose={() => setShowAvatarModal(false)}
          onSave={handleSaveAvatar}
        />
      )}
    </>
  )
}