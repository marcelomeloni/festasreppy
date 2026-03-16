'use client'

import { useState } from 'react'
import { CalendarBlank, MapPin, QrCode, Users, DotsThree, Tag } from '@phosphor-icons/react'
import Link from 'next/link'

import QRModal from './modais/QRModal'
import TransferModal from './modais/TransferModal'
import SellModal from './modais/SellModal'
import ActionsSheet from './modais/ActionsSheet'
import RadarModal from './modais/RadarModal'
import RefundModal from './modais/RefundModal'

import { MyTicket } from '@/services/myTicketsService'

function DaysUntilBadge({ days }: { days: number }) {
  if (days === 0) {
    return (
      <span className="inline-flex font-body text-[10px] font-bold text-black bg-[#1BFF11] px-2 py-0.5 rounded-full mb-2">
        Hoje!
      </span>
    )
  }
  if (days === 1) {
    return (
      <span className="inline-flex font-body text-[10px] font-bold text-black bg-[#1BFF11] px-2 py-0.5 rounded-full mb-2">
        Amanhã
      </span>
    )
  }
  if (days <= 7) {
    return (
      <span className="inline-flex font-body text-[10px] font-bold text-black bg-[#1BFF11] px-2 py-0.5 rounded-full mb-2">
        Em {days} dias
      </span>
    )
  }
  return null
}

interface TicketCardProps {
  ingresso: MyTicket
}

export default function TicketCard({ ingresso }: TicketCardProps) {
  const [showQR, setShowQR]             = useState(false)
  const [showActions, setShowActions]   = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [showSell, setShowSell]         = useState(false)
  const [showRadar, setShowRadar]       = useState(false)
  const [showRefund, setShowRefund]     = useState(false)

  const isPast = ingresso.status === 'encerrado'
  const isUsed = ingresso.status === 'usado'
  const isDone = isPast || isUsed

  const showDaysUntil = !isDone && ingresso.daysUntil !== null && ingresso.daysUntil !== undefined

  return (
    <>
      <div className={`bg-white rounded-[20px] border-[1.5px] border-[#E0E0D8] overflow-hidden ${isDone ? 'opacity-55' : ''}`}>
        <div className="flex gap-0">
          {ingresso.evento.imagemUrl && (
            <div className="relative w-[96px] shrink-0 self-stretch overflow-hidden bg-[#111]">
              <img
                src={ingresso.evento.imagemUrl}
                alt={ingresso.evento.nome}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
              {isDone && <div className="absolute inset-0 bg-white/20" />}
            </div>
          )}

          <div className="flex-1 min-w-0 p-4">
            {isDone && (
              <span className="inline-flex font-body text-[10px] font-bold text-[#9A9A8F] bg-[#F0F0EB] px-2 py-0.5 rounded-full mb-2">
                {isUsed ? 'Usado' : 'Encerrado'}
              </span>
            )}

            {showDaysUntil && <DaysUntilBadge days={ingresso.daysUntil!} />}

            <Link href={`/${ingresso.evento.slug}`} className="no-underline">
              <h3 className="font-bricolage text-[16px] font-extrabold text-[#0A0A0A] tracking-tight leading-tight mb-2 hover:opacity-70 transition-opacity line-clamp-2">
                {ingresso.evento.nome}
              </h3>
            </Link>

            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-1.5 font-body text-[12px] text-[#5C5C52]">
                <CalendarBlank size={12} weight="fill" color="#9A9A8F" />
                {ingresso.evento.data} · {ingresso.evento.hora}
              </span>
              {ingresso.evento.local && (
                <span className="inline-flex items-center gap-1.5 font-body text-[12px] text-[#5C5C52]">
                  <MapPin size={12} weight="fill" color="#9A9A8F" />
                  {ingresso.evento.local}
                </span>
              )}
            </div>
          </div>
        </div>

        {ingresso.isListed && ingresso.listingPrice && !isDone && (
          <button
            type="button"
            onClick={() => setShowSell(true)}
            className="mx-3 mb-0 flex items-center gap-2 bg-[#F0F0EB] hover:bg-[#E0E0D8] rounded-[10px] px-3 py-2 transition-colors w-[calc(100%-24px)] text-left cursor-pointer"
          >
            <Tag size={13} weight="fill" className="text-[#1BFF11] shrink-0" />
            <span className="font-body text-[12px] text-[#5C5C52] flex-1">
              Anunciado no{' '}
              <span className="font-bold text-black">Reppy Market</span>
              {' '}por{' '}
              <span className="font-bold text-black">
                {ingresso.listingPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </span>
            <span className="font-body text-[11px] text-[#9A9A8F] shrink-0">editar →</span>
          </button>
        )}

        <div className="flex items-center px-4 mt-3">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="h-px flex-1 bg-[#E0E0D8]" />
          ))}
        </div>

        <div className="p-3 flex items-center gap-2">
          {!isDone ? (
            <>
              <button
                type="button"
                onClick={() => setShowQR(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 font-body text-[13px] font-semibold text-white bg-[#0A0A0A] rounded-full py-2.5 hover:opacity-80 transition-opacity border-none cursor-pointer"
              >
                <QrCode size={15} weight="bold" />
                QR Code
              </button>

              <button
                type="button"
                onClick={() => setShowRadar(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 font-body text-[13px] font-semibold text-[#0A0A0A] bg-[#F0F0EB] border border-[#E0E0D8] hover:border-[#0A0A0A] rounded-full py-2.5 transition-colors cursor-pointer"
              >
                <Users size={15} weight="fill" />
                Ver quem vai
              </button>

              <button
                type="button"
                onClick={() => setShowActions(true)}
                className="w-[42px] h-[42px] shrink-0 rounded-full bg-[#F0F0EB] border border-[#E0E0D8] hover:border-[#0A0A0A] flex items-center justify-center transition-colors cursor-pointer"
                title="Mais opções"
              >
                <DotsThree size={18} weight="bold" color="#5C5C52" />
              </button>
            </>
          ) : (
            <Link
              href={`/${ingresso.evento.slug}`}
              className="flex-1 inline-flex items-center justify-center font-body text-[13px] font-semibold text-[#9A9A8F] bg-[#F0F0EB] rounded-full py-2.5 no-underline"
            >
              Ver evento
            </Link>
          )}
        </div>
      </div>

      {showQR       && <QRModal       ingresso={ingresso} onClose={() => setShowQR(false)}       />}
      {showRadar    && <RadarModal    ingresso={ingresso} onClose={() => setShowRadar(false)}    />}
      {showActions  && (
        <ActionsSheet
          ingresso={ingresso}
          onClose={() => setShowActions(false)}
          onOpenTransfer={() => setShowTransfer(true)}
          onOpenSell={() => setShowSell(true)}
          onOpenRefund={() => setShowRefund(true)}
        />
      )}
      {showTransfer && <TransferModal ingresso={ingresso} onClose={() => setShowTransfer(false)} />}
      {showSell     && <SellModal     ingresso={ingresso} onClose={() => setShowSell(false)}     />}
      {showRefund   && <RefundModal   ingresso={ingresso} onClose={() => setShowRefund(false)}   />}
    </>
  )
}