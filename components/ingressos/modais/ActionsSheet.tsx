'use client'

import { ArrowsLeftRight, Tag, Receipt } from '@phosphor-icons/react'
import { MyTicket } from '@/services/myTicketsService'

interface ActionsSheetProps {
  ingresso: MyTicket
  onClose: () => void
  onOpenTransfer: () => void
  onOpenSell: () => void
  onOpenRefund: () => void
}

export default function ActionsSheet({ ingresso, onClose, onOpenTransfer, onOpenSell, onOpenRefund }: ActionsSheetProps) {
  const actions = [
    {
      icon: <ArrowsLeftRight size={18} weight="bold" />,
      label: 'Transferir ingresso',
      sub: 'Manda pra um amigo pelo CPF',
      onClick: () => { onClose(); onOpenTransfer() },
      danger: false,
      show: true,
    },
    {
      icon: <Tag size={18} weight="bold" />,
      label: 'Vender no Reppy Market',
      sub: 'Recoloca à venda abaixo do lote atual',
      onClick: () => { onClose(); onOpenSell() },
      danger: false,
      show: ingresso.allowReppyMarket,
    },
    {
      icon: <Receipt size={18} weight="bold" />,
      label: 'Solicitar Reembolso',
      sub: 'Cancelar ingresso e estornar valor',
      onClick: () => { onClose(); onOpenRefund() },
      danger: true,
      show: ingresso.ticketPrice > 0,  // oculta para ingressos gratuitos
    },
  ].filter(a => a.show)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-[24px] w-full max-w-lg p-5 pb-8 flex flex-col gap-3 animate-in slide-in-from-bottom-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#E0E0D8] rounded-full mx-auto mb-2" />
        <p className="font-bricolage text-[15px] font-extrabold text-[#0A0A0A] mb-1 px-1 truncate">
          {ingresso.evento.nome}
        </p>

        {actions.map((a, i) => (
          <button
            key={i}
            onClick={a.onClick}
            className="flex items-center gap-4 px-4 py-3.5 rounded-[16px] bg-[#F7F7F2] border border-[#E0E0D8] hover:border-[#0A0A0A] transition-colors w-full text-left cursor-pointer"
          >
            <span className={`
              w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0
              ${a.danger ? 'bg-[#ffe5e5] text-[#FF2D2D]' : 'bg-[#F0F0EB] text-[#0A0A0A]'}
            `}>
              {a.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`font-body text-[14px] font-semibold ${a.danger ? 'text-[#FF2D2D]' : 'text-[#0A0A0A]'}`}>
                {a.label}
              </p>
              <p className="font-body text-[12px] text-[#9A9A8F]">{a.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}