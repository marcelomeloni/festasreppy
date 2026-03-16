'use client'

import { useState } from 'react'
import { Ticket } from '@phosphor-icons/react'
import TicketCard from './TicketCard'
import { MyTicket } from '@/services/myTicketsService'

const PAGE_SIZE = 10

interface TicketListProps {
  proximos: MyTicket[]
  passados: MyTicket[]
  loading:  boolean
}

function EmptyState({ type }: { type: 'proximos' | 'passados' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-full bg-[#F0F0EB] flex items-center justify-center mb-4">
        <Ticket size={24} weight="thin" color="#9A9A8F" />
      </div>
      <p className="font-bricolage text-[18px] font-extrabold text-[#0A0A0A] mb-1">
        {type === 'proximos' ? 'Nenhum ingresso ativo.' : 'Nenhum evento passado ainda.'}
      </p>
      <p className="font-body text-[13px] text-[#9A9A8F] max-w-[220px]">
        {type === 'proximos'
          ? 'Quando comprar um ingresso, ele aparece aqui.'
          : 'Os eventos que você foi ficam registrados aqui.'}
      </p>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-[20px] border-[1.5px] border-[#E0E0D8] overflow-hidden animate-pulse">
      <div className="flex h-[88px]">
        <div className="w-[96px] shrink-0 bg-[#F0F0EB]" />
        <div className="flex-1 p-4 flex flex-col gap-2">
          <div className="h-3 w-2/3 bg-[#F0F0EB] rounded-full" />
          <div className="h-3 w-1/2 bg-[#F0F0EB] rounded-full" />
          <div className="h-3 w-1/3 bg-[#F0F0EB] rounded-full" />
        </div>
      </div>
      <div className="h-px bg-[#E0E0D8]" />
      <div className="p-3 flex gap-2">
        <div className="flex-1 h-[38px] bg-[#F0F0EB] rounded-full" />
        <div className="flex-1 h-[38px] bg-[#F0F0EB] rounded-full" />
        <div className="w-[42px] h-[42px] bg-[#F0F0EB] rounded-full" />
      </div>
    </div>
  )
}

export default function TicketList({ proximos, passados, loading }: TicketListProps) {
  const [tab, setTab]               = useState<'proximos' | 'passados'>('proximos')
  const [visibleProximos, setVisibleProximos] = useState(PAGE_SIZE)
  const [visiblePassados, setVisiblePassados] = useState(PAGE_SIZE)

  const tabs = [
    { id: 'proximos' as const, label: 'Próximos', count: proximos.length },
    { id: 'passados' as const, label: 'Passados', count: passados.length },
  ]

  const lista        = tab === 'proximos' ? proximos : passados
  const visible      = tab === 'proximos' ? visibleProximos : visiblePassados
  const listaVisible = lista.slice(0, visible)
  const hasMore      = visible < lista.length
  const remaining    = lista.length - visible

  function loadMore() {
    if (tab === 'proximos') {
      setVisibleProximos(v => v + PAGE_SIZE)
    } else {
      setVisiblePassados(v => v + PAGE_SIZE)
    }
  }

  function handleTabChange(id: 'proximos' | 'passados') {
    setTab(id)
  }

  return (
    <div>
      <div className="flex mb-1">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => handleTabChange(t.id)}
            className={`
              relative font-body text-[15px] font-semibold px-5 py-[14px] border-none bg-transparent cursor-pointer transition-colors
              ${tab === t.id ? 'text-[#0A0A0A]' : 'text-[#9A9A8F] hover:text-[#0A0A0A]'}
            `}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`
                ml-1.5 font-body text-[11px] font-bold px-1.5 py-0.5 rounded-full
                ${tab === t.id ? 'bg-[#0A0A0A] text-white' : 'bg-[#F0F0EB] text-[#9A9A8F]'}
              `}>
                {t.count}
              </span>
            )}
            {tab === t.id && (
              <span className="absolute bottom-0 left-5 right-5 h-[2px] bg-[#1BFF11] rounded-t-sm" />
            )}
          </button>
        ))}
      </div>
      <div className="h-px bg-[#E0E0D8] mb-6" />

      {loading ? (
        <div className="flex flex-col gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : lista.length === 0 ? (
        <EmptyState type={tab} />
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {listaVisible.map(ingresso => (
              <TicketCard key={ingresso.id} ingresso={ingresso} />
            ))}
          </div>

          {hasMore && (
            <button
              type="button"
              onClick={loadMore}
              className="w-full mt-4 py-3 rounded-full font-body text-[13px] font-semibold text-[#5C5C52] bg-[#F0F0EB] hover:bg-[#E0E0D8] border border-[#E0E0D8] transition-colors cursor-pointer"
            >
              Ver mais {remaining > PAGE_SIZE ? PAGE_SIZE : remaining} ingressos
            </button>
          )}
        </>
      )}
    </div>
  )
}