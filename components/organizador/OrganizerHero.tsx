'use client'

import { useState } from 'react'
import { MapPin, Users } from '@phosphor-icons/react'
import FollowButton from './FollowButton'

interface OrganizerHeroProps {
  organizador: {
    nome:       string
    bannerUrl:  string | null
    avatarUrl:  string | null
    cidade:     string | null
    seguidores: number
    slug:       string
    isFollowing: boolean // <-- 1. ADICIONADO AQUI
  }
}

export default function OrganizerHero({ organizador }: OrganizerHeroProps) {
  const [followers, setFollowers] = useState<number>(organizador.seguidores ?? 0)

  function handleFollowChange(following: boolean) {
    setFollowers(prev => following ? prev + 1 : Math.max(0, prev - 1))
  }

  return (
    <div className="w-full">
      {/* Banner */}
      <div className="relative w-full h-[220px] overflow-hidden rounded-b-[28px] bg-[#0A0A0A]">
        {organizador.bannerUrl ? (
          <img src={organizador.bannerUrl} alt="banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      </div>

      {/* Info row */}
      <div className="flex items-end gap-5 px-6 -mt-11 relative z-10 flex-wrap">
        {/* Avatar */}
        <div className="shrink-0 size-[88px] rounded-full border-[3px] border-[#F7F7F2] overflow-hidden bg-[#1a1a1a] shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex items-center justify-center">
          {organizador.avatarUrl ? (
            <img src={organizador.avatarUrl} alt={organizador.nome} className="w-full h-full object-cover" />
          ) : (
            <span className="font-bricolage text-[32px] font-extrabold text-[#1BFF11]">
              {organizador.nome?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex-1 min-w-[200px] pt-12">
          <h1 className="font-bricolage text-[26px] font-extrabold text-[#0A0A0A] tracking-tight leading-none mb-2">
            {organizador.nome}
          </h1>
          <div className="flex flex-wrap gap-1.5">
            {organizador.cidade && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5C5C52] bg-[#F0F0EB] px-[10px] py-1 rounded-full">
                <MapPin size={12} weight="fill" />
                {organizador.cidade}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5C5C52] bg-[#F0F0EB] px-[10px] py-1 rounded-full">
              <Users size={12} weight="fill" />
              <span key={followers} className="animate-count">
                {followers.toLocaleString('pt-BR')}
              </span>
              &nbsp;seguidores
            </span>
          </div>
        </div>

        {/* Botão seguir */}
        <div className="pt-12 shrink-0">
          <FollowButton
            slug={organizador.slug}
            initialFollowing={organizador.isFollowing} // <-- 2. ADICIONADO AQUI
            onFollowChange={handleFollowChange}
          />
        </div>
      </div>

      <style>{`
        @keyframes countPop {
          0%   { transform: translateY(6px); opacity: 0; }
          60%  { transform: translateY(-2px); opacity: 1; }
          100% { transform: translateY(0);   opacity: 1; }
        }
        .animate-count {
          display: inline-block;
          animation: countPop 0.35s cubic-bezier(.22,.68,0,1.2) both;
        }
      `}</style>
    </div>
  )
}