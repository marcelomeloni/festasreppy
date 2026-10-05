'use client'

import { useEffect, useState } from 'react'
import TicketList from '@/components/ingressos/TicketList'
import { myTicketsService, MyTicket } from '@/services/myTicketsService'

export default function MeusIngressosPage() {
  const [proximos, setProximos] = useState<MyTicket[]>([])
  const [passados, setPassados] = useState<MyTicket[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    myTicketsService.getMyTickets()
      .then(data => {
        setProximos(data.proximos)
        setPassados(data.passados)
      })
      .finally(() => setLoading(false))
  }, [])

  // Trasferência remove o ingresso do remetente: t.user_id passou a ser o
  // destinatário, então ele não pertence mais a esta lista. Tirar o item do
  // state local reflete o banco na hora, sem refazer o fetch e sem recarregar
  // a página inteira.
  function handleTicketTransferred(ticketId: string) {
    setProximos(list => list.filter(t => t.id !== ticketId))
    setPassados(list => list.filter(t => t.id !== ticketId))
  }

  return (
    <main className="min-h-screen bg-[#F7F7F2] pb-20">
      <div className="max-w-[600px] mx-auto px-4 pt-8">
        <div className="mb-6">
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A9A8F] mb-1">
            Sua conta
          </p>
          <h1 className="font-bricolage text-[32px] font-extrabold text-[#0A0A0A] leading-none">
            Meus ingressos
          </h1>
        </div>

        <TicketList
          proximos={proximos}
          passados={passados}
          loading={loading}
          onTicketTransferred={handleTicketTransferred}
        />
      </div>
    </main>
  )
}